import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import connectivityService from "./ConnectivityService";
import storageQuotaManager from "./StorageQuotaManager";
import database from '../database';
import Embedding from '../database/models/Embedding';

export interface DownloadProgress {
  currentBatch: number;
  totalBatches: number;
  downloadedCount: number;
  totalCount: number;
  percentage: number;
  speedKBps: number;
  estimatedTimeSeconds: number;
}

export interface DownloadTask {
  id: string;
  offset: number;
  limit: number;
  status: "pending" | "downloading" | "completed" | "failed";
  retryCount: number;
  error?: string;
}

export interface IDownloadManager {
  startDownload(version?: string): Promise<void>;
  pauseDownload(): Promise<void>;
  resumeDownload(): Promise<void>;
  cancelDownload(): Promise<void>;
  getProgress(): DownloadProgress | null;
  onProgress(callback: (progress: DownloadProgress) => void): () => void;
  isDownloading(): boolean;
  getPendingTasks(): Promise<DownloadTask[]>;
  retryFailed(): Promise<void>;
}

export interface DownloadManagerConfig {
  apiBaseUrl: string;
  batchSize: number;
  maxConcurrent: number;
  maxRetries: number;
  retryDelayMs: number;
  timeoutMs: number;
  enableCompression: boolean;
}

export const DEFAULT_DOWNLOAD_CONFIG: DownloadManagerConfig = {
  apiBaseUrl:
    (Constants?.expoConfig as any)?.extra?.API_BASE_URL ||
    "http://localhost:3000",
  batchSize: 500,
  maxConcurrent: 2,
  maxRetries: 3,
  retryDelayMs: 5000,
  timeoutMs: 30000,
  enableCompression: true,
};

export type DownloadEvent =
  | { type: "started"; totalBatches: number; totalCount: number }
  | { type: "progress"; progress: DownloadProgress }
  | { type: "batch_completed"; batchNumber: number; embeddingsCount: number }
  | {
      type: "batch_failed";
      batchNumber: number;
      error: string;
      retryCount: number;
    }
  | { type: "completed"; totalDownloaded: number; durationMs: number }
  | { type: "cancelled" }
  | { type: "error"; error: string };

export interface IDownloadEventEmitter {
  on(event: "download_event", callback: (event: DownloadEvent) => void): void;
  off(event: "download_event", callback: (event: DownloadEvent) => void): void;
  emit(event: "download_event", data: DownloadEvent): void;
}

const TASKS_KEY = "@download_tasks";

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number }
) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout ?? DEFAULT_DOWNLOAD_CONFIG.timeoutMs
  );
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

class DownloadManager implements IDownloadManager, IDownloadEventEmitter {
  private config: DownloadManagerConfig;
  private running = false;
  private paused = false;
  private cancelled = false;
  private progress: DownloadProgress | null = null;
  private listeners = new Set<(progress: DownloadProgress) => void>();
  private eventListeners = new Set<(event: DownloadEvent) => void>();

  constructor(config?: Partial<DownloadManagerConfig>) {
    this.config = { ...DEFAULT_DOWNLOAD_CONFIG, ...(config || {}) };
  }

  on(event: "download_event", callback: (event: DownloadEvent) => void): void {
    if (event === "download_event") {
      this.eventListeners.add(callback);
    }
  }
  off(event: "download_event", callback: (event: DownloadEvent) => void): void {
    if (event === "download_event") {
      this.eventListeners.delete(callback);
    }
  }
  emit(event: "download_event", data: DownloadEvent): void {
    if (event === "download_event") {
      this.eventListeners.forEach((cb) => {
        try {
          cb(data);
        } catch {}
      });
    }
  }

  async startDownload(version?: string): Promise<void> {
    if (this.running) return;
    this.cancelled = false;
    this.paused = false;
    this.running = true;

    // Checa conectividade e regras base
    const eligible = await connectivityService.checkSyncEligibility({
      requireWiFi: false,
      allowCellular: true,
      minBatteryLevel: 20,
    });
    if (!eligible.eligible) {
      this.running = false;
      this.emit("download_event", {
        type: "error",
        error: eligible.reason || "Not eligible for sync",
      });
      return;
    }

    // Valida armazenamento aproximado
    // Estimativa: 1.5KB por embedding (guia)
    const approxBytesPerEmbedding = 1500;

    const batchSize = this.config.batchSize;
    const startedAt = Date.now();
    let offset = 0;
    let currentBatch = 0;
    let downloadedCount = 0;
    let totalCount = 0;
    let totalBatches = 0;

    // Emite started com estimativas desconhecidas (0); atualiza conforme descobre
    this.emit("download_event", {
      type: "started",
      totalBatches,
      totalCount,
    });

    while (!this.cancelled) {
      if (this.paused) {
        await sleep(500);
        continue;
      }

      // Verifica quota antes de cada batch
      const hasSpace = await storageQuotaManager.hasSufficientStorage(
        batchSize * approxBytesPerEmbedding
      );
      if (!hasSpace) {
        await storageQuotaManager.executeCleanup("oldest_first");
        const hasSpaceAfter = await storageQuotaManager.hasSufficientStorage(
          batchSize * approxBytesPerEmbedding
        );
        if (!hasSpaceAfter) {
          this.emit("download_event", {
            type: "error",
            error: "Insufficient storage for next batch",
          });
          break;
        }
      }

      currentBatch += 1;
      const url = `${
        this.config.apiBaseUrl
      }/api/export/embeddings?offset=${offset}&limit=${batchSize}${
        version ? `&version=${encodeURIComponent(version)}` : ""
      }`;

      const headers: HeadersInit = {};
      if (this.config.enableCompression) {
        headers["Accept-Encoding"] = "gzip";
      }

      let attempt = 0;
      let batchData: any[] | null = null;
      let errorMessage = "";
      const batchStart = Date.now();

      while (attempt < this.config.maxRetries) {
        try {
          const res = await fetchWithTimeout(url, {
            method: "GET",
            headers,
            timeout: this.config.timeoutMs,
          });
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) {
            batchData = [];
          } else {
            batchData = data;
          }
          break;
        } catch (err: any) {
          errorMessage = String(err?.message || err);
          attempt += 1;
          this.emit("download_event", {
            type: "batch_failed",
            batchNumber: currentBatch,
            error: errorMessage,
            retryCount: attempt,
          });
          await sleep(this.config.retryDelayMs);
        }
      }

      if (batchData == null) {
        // Falhou completamente
        this.emit("download_event", {
          type: "error",
          error: `Batch ${currentBatch} failed: ${errorMessage}`,
        });
        break;
      }

      if (batchData.length === 0) {
        // Sem mais dados
        break;
      }

      // ✅ PERSISTIR EMBEDDINGS NO BANCO DE DADOS
      try {
        await database.write(async () => {
          const embeddingsCollection = database.get<Embedding>('embeddings');
          
          const newRecords = batchData.map((emb: any) =>
            embeddingsCollection.prepareCreate((record) => {
              record.vector = JSON.stringify(emb.vector);
              record.content = emb.content || '';
              record.source = emb.source || '';
              record.chapter = emb.chapter || '';
              record.page = emb.page || 0;
              
              // Tratamento correto de metadata opcional
              if (emb.metadata) {
                record.metadata = JSON.stringify(emb.metadata);
              }
            })
          );
          
          await database.batch(...newRecords);
        });
        
        console.log(`✅ Batch ${currentBatch} persisted: ${batchData.length} embeddings`);
      } catch (dbError) {
        console.error(`❌ Database error on batch ${currentBatch}:`, dbError);
        this.emit("download_event", {
          type: "error",
          error: `Database error: ${dbError}`,
        });
      }

      const batchDurationSec = (Date.now() - batchStart) / 1000;
      const bytesDownloaded = batchData.length * approxBytesPerEmbedding;
      const speedKBps = bytesDownloaded / 1024 / Math.max(1, batchDurationSec);
      downloadedCount += batchData.length;
      offset += batchSize;

      // Atualiza estimativas
      totalCount = Math.max(totalCount, downloadedCount);
      totalBatches = Math.max(totalBatches, currentBatch);
      const percentage =
        totalCount > 0
          ? Math.min(100, Math.round((downloadedCount / totalCount) * 100))
          : 0;
      const elapsedSec = (Date.now() - startedAt) / 1000;
      const eta =
        percentage > 0
          ? Math.max(
              0,
              Math.round(elapsedSec / (percentage / 100) - elapsedSec)
            )
          : 0;

      this.progress = {
        currentBatch,
        totalBatches,
        downloadedCount,
        totalCount,
        percentage,
        speedKBps: Math.round(speedKBps),
        estimatedTimeSeconds: eta,
      };
      this.listeners.forEach((cb) => {
        try {
          cb(this.progress!);
        } catch {}
      });
      this.emit("download_event", {
        type: "progress",
        progress: this.progress!,
      });
      this.emit("download_event", {
        type: "batch_completed",
        batchNumber: currentBatch,
        embeddingsCount: batchData.length,
      });
    }

    const durationMs = Date.now() - startedAt;
    this.running = false;
    if (this.cancelled) {
      this.emit("download_event", { type: "cancelled" });
    } else {
      this.emit("download_event", {
        type: "completed",
        totalDownloaded: downloadedCount,
        durationMs,
      });
    }
  }

  async pauseDownload(): Promise<void> {
    this.paused = true;
  }

  async resumeDownload(): Promise<void> {
    this.paused = false;
  }

  async cancelDownload(): Promise<void> {
    this.cancelled = true;
    this.running = false;
    await AsyncStorage.removeItem(TASKS_KEY);
  }

  getProgress(): DownloadProgress | null {
    return this.progress;
  }

  onProgress(callback: (progress: DownloadProgress) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  isDownloading(): boolean {
    return this.running && !this.paused && !this.cancelled;
  }

  async getPendingTasks(): Promise<DownloadTask[]> {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    try {
      const tasks = JSON.parse(raw);
      return Array.isArray(tasks) ? tasks : [];
    } catch {
      return [];
    }
  }

  async retryFailed(): Promise<void> {
    const tasks = await this.getPendingTasks();
    const failed = tasks.filter((t) => t.status === "failed");
    const updated = tasks.map((t) =>
      t.status === "failed"
        ? { ...t, status: "pending" as const, retryCount: 0, error: undefined }
        : t
    );
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    if (failed.length > 0 && !this.running) {
      await this.startDownload();
    }
  }
}

export const downloadManager = new DownloadManager();
export default downloadManager;