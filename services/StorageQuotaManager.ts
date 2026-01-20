/**
 * StorageQuotaManager - Gerencia o espaço de armazenamento e cotas
 *
 * Responsabilidades:
 * - Monitorar espaço livre no dispositivo
 * - Gerenciar uso de armazenamento do app
 * - Alertar quando espaço estiver acabando
 * - Limpar arquivos antigos se necessário
 * - Alinhar com interface definida em message.txt (IStorageQuotaManager)
 */

import {
  cacheDirectory,
  deleteAsync,
  documentDirectory,
  getFreeDiskStorageAsync,
  getInfoAsync,
  getTotalDiskCapacityAsync,
  readDirectoryAsync,
} from "expo-file-system/legacy";

// ================================================================================
// INTERFACES & TYPES
// ================================================================================

export interface StorageStatus {
  freeSpace: number; // Bytes livres no dispositivo
  totalSpace: number; // Capacidade total do dispositivo (bytes)
  appUsage: number; // Espaço usado pelo app (estimado/calculado) (bytes)
  isLowSpace: boolean; // Se está com pouco espaço
  quotaExceeded: boolean; // Se excedeu a cota do app
}

export interface StorageUsage {
  totalEmbeddings: number;
  usedBytes: number;
  usedFormatted: string;
  availableBytes: number;
  quotaPercentage: number;
  isQuotaExceeded: boolean;
  oldestEmbeddingDate: string | null;
  newestEmbeddingDate: string | null;
}

export interface StorageQuotaConfig {
  maxStorageBytes: number;
  maxEmbeddings: number;
  warningThreshold: number;
  cleanupThreshold: number;
  minFreeStorageBytes: number;
  enableAutoCleanup: boolean;
  defaultCleanupStrategy: CleanupStrategy;
}

export type CleanupStrategy = "lru" | "oldest_first" | "low_usage" | "partial";
export interface CleanupResult {
  embeddingsRemoved: number;
  bytesFreed: number;
  strategy: string;
  durationMs: number;
  success: boolean;
  error?: string;
}

// Configuração padrão
const DEFAULT_CONFIG: StorageQuotaConfig = {
  maxStorageBytes: 100 * 1024 * 1024,
  maxEmbeddings: 10_000,
  warningThreshold: 0.8,
  cleanupThreshold: 0.9,
  minFreeStorageBytes: 50 * 1024 * 1024,
  enableAutoCleanup: true,
  defaultCleanupStrategy: "lru",
};

// ================================================================================
// STORAGE QUOTA MANAGER
// ================================================================================

class StorageQuotaManager {
  private config: StorageQuotaConfig;
  private listeners = new Set<(usage: StorageUsage) => void>();
  private averageEmbeddingBytes = 1500;

  constructor(config: Partial<StorageQuotaConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Obtém o status atual do armazenamento
   */
  async getStorageStatus(): Promise<StorageStatus> {
    const freeSpace = await getFreeDiskStorageAsync();
    const totalSpace = await getTotalDiskCapacityAsync();
    const appUsage = await this.calculateAppUsage();

    return {
      freeSpace,
      totalSpace,
      appUsage,
      isLowSpace: freeSpace < this.config.minFreeStorageBytes,
      quotaExceeded: appUsage > this.config.maxStorageBytes,
    };
  }

  /**
   * getUsage(): Interface do backend
   */
  async getUsage(): Promise<StorageUsage> {
    const status = await this.getStorageStatus();
    const filesInfo = await this.collectFilesInfo();
    const oldest = filesInfo.length
      ? new Date(Math.min(...filesInfo.map((f) => f.modified))).toISOString()
      : null;
    const newest = filesInfo.length
      ? new Date(Math.max(...filesInfo.map((f) => f.modified))).toISOString()
      : null;
    const totalEmbeddings = await this.getEmbeddingsCount();
    const usedBytes = status.appUsage;
    const quotaPercentage =
      this.config.maxStorageBytes > 0
        ? Math.min(
            100,
            Math.round((usedBytes / this.config.maxStorageBytes) * 100)
          )
        : 0;
    const isQuotaExceeded =
      usedBytes > this.config.maxStorageBytes ||
      totalEmbeddings > this.config.maxEmbeddings;
    return {
      totalEmbeddings,
      usedBytes,
      usedFormatted: this.formatBytes(usedBytes),
      availableBytes: status.freeSpace,
      quotaPercentage,
      isQuotaExceeded,
      oldestEmbeddingDate: oldest,
      newestEmbeddingDate: newest,
    };
  }

  /**
   * isQuotaExceeded(): Alinhado ao guia
   */
  async isQuotaExceeded(): Promise<boolean> {
    const usage = await this.getUsage();
    return usage.isQuotaExceeded;
  }

  /**
   * Verifica se há espaço suficiente para salvar um arquivo
   * @param sizeBytes Tamanho do arquivo a ser salvo
   */
  async hasSpaceFor(sizeBytes: number): Promise<boolean> {
    const status = await this.getStorageStatus();
    if (status.freeSpace < sizeBytes + this.config.minFreeStorageBytes) {
      return false;
    }
    if (status.appUsage + sizeBytes > this.config.maxStorageBytes) {
      return false;
    }

    return true;
  }

  /**
   * hasSufficientStorage(requiredBytes): Alinhado ao guia
   */
  async hasSufficientStorage(requiredBytes: number): Promise<boolean> {
    return this.hasSpaceFor(requiredBytes);
  }

  /**
   * Calcula o espaço usado pelos diretórios do app
   * Nota: Isso pode ser custoso se houver muitos arquivos
   */
  private async calculateAppUsage(): Promise<number> {
    try {
      // Começa com o diretório de documentos e cache
      const documentDirSize = await this.getDirectorySize(documentDirectory);
      const cacheDirSize = await this.getDirectorySize(cacheDirectory);

      return documentDirSize + cacheDirSize;
    } catch (error) {
      console.error("Error calculating app usage:", error);
      return 0;
    }
  }

  /**
   * Calcula tamanho de um diretório recursivamente
   */
  private async getDirectorySize(uri: string | null): Promise<number> {
    if (!uri) return 0;

    try {
      const info = await getInfoAsync(uri);
      if (!info.exists) return 0;
      if (!info.isDirectory) return info.size || 0;

      const files = await readDirectoryAsync(uri);
      let totalSize = 0;

      for (const file of files) {
        const fileUri = uri + (uri.endsWith("/") ? "" : "/") + file;
        // Evita recursão infinita ou muito profunda se necessário,
        // mas para estrutura simples do Expo é ok
        totalSize += await this.getDirectorySize(fileUri);
      }

      return totalSize;
    } catch (error) {
      console.warn(`Error calculating size for ${uri}:`, error);
      return 0;
    }
  }

  async monitorAndCleanup(): Promise<CleanupResult | null> {
    const usage = await this.getUsage();
    if (
      usage.quotaPercentage >= Math.round(this.config.warningThreshold * 100)
    ) {
      this.listeners.forEach((cb) => {
        try {
          cb(usage);
        } catch {}
      });
    }
    if (!this.config.enableAutoCleanup) return null;
    if (
      usage.quotaPercentage >= Math.round(this.config.cleanupThreshold * 100)
    ) {
      const rec = await this.getRecommendedCleanup();
      return this.executeCleanup(rec.name);
    }
    return null;
  }

  /**
   * Limpa o cache do aplicativo para liberar espaço
   */
  async clearCache(): Promise<void> {
    try {
      if (cacheDirectory) {
        const files = await readDirectoryAsync(cacheDirectory);
        for (const file of files) {
          await deleteAsync(cacheDirectory + file, { idempotent: true });
        }
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw error;
    }
  }

  /**
   * cleanup(strategy): Alinhado ao guia
   */
  async executeCleanup(
    strategy: CleanupStrategy = "oldest_first",
    targetPercentage = 0.2
  ): Promise<CleanupResult> {
    const start = Date.now();
    const infos = await this.collectFilesInfo();
    if (infos.length === 0) {
      return {
        embeddingsRemoved: 0,
        bytesFreed: 0,
        strategy,
        durationMs: Date.now() - start,
        success: true,
      };
    }
    let sorted = infos.slice();
    if (strategy === "oldest_first") {
      sorted.sort((a, b) => a.modified - b.modified);
    } else if (strategy === "lru") {
      sorted.sort((a, b) => a.modified - b.modified);
    } else if (strategy === "low_usage") {
      sorted.sort((a, b) => a.size - b.size);
    } else if (strategy === "partial") {
      sorted.sort((a, b) => b.size - a.size);
    }
    const usage = await this.getUsage();
    const targetBytes = Math.max(
      0,
      Math.floor(usage.usedBytes * targetPercentage)
    );
    let bytesFreed = 0;
    let removed = 0;
    for (const f of sorted) {
      if (bytesFreed >= targetBytes) break;
      await deleteAsync(f.uri, { idempotent: true });
      bytesFreed += f.size;
      removed += 1;
    }
    return {
      embeddingsRemoved: removed,
      bytesFreed,
      strategy,
      durationMs: Date.now() - start,
      success: true,
    };
  }

  /**
   * Atualiza as configurações de cota
   */
  updateConfig(newConfig: Partial<StorageQuotaConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  async setQuotaLimits(maxBytes: number, maxEmbeddings: number): Promise<void> {
    this.config.maxStorageBytes = maxBytes;
    this.config.maxEmbeddings = maxEmbeddings;
  }
  async getQuotaLimits(): Promise<{ maxBytes: number; maxEmbeddings: number }> {
    return {
      maxBytes: this.config.maxStorageBytes,
      maxEmbeddings: this.config.maxEmbeddings,
    };
  }

  onStorageWarning(callback: (usage: StorageUsage) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  estimateStorageNeeded(embeddingCount: number): number {
    return embeddingCount * this.averageEmbeddingBytes;
  }

  async getRecommendedCleanup(): Promise<{
    name: CleanupStrategy;
    description: string;
    priority: number;
    targetPercentage: number;
  }> {
    const usage = await this.getUsage();
    if (
      usage.quotaPercentage >= Math.round(this.config.cleanupThreshold * 100)
    ) {
      return {
        name: "oldest_first",
        description: "",
        priority: 2,
        targetPercentage: 0.2,
      };
    }
    return { name: "lru", description: "", priority: 1, targetPercentage: 0.2 };
  }

  private formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(1)} ${units[i]}`;
  }

  private async collectFilesInfo(): Promise<
    Array<{ uri: string; size: number; modified: number }>
  > {
    const uris: string[] = [];
    if (documentDirectory) {
      const docs = await readDirectoryAsync(documentDirectory);
      for (const name of docs) uris.push(documentDirectory + name);
    }
    if (cacheDirectory) {
      const cache = await readDirectoryAsync(cacheDirectory);
      for (const name of cache) uris.push(cacheDirectory + name);
    }
    const infos = await Promise.all(
      uris.map(async (uri) => {
        const info = await getInfoAsync(uri);
        const anyInfo = info as any;
        return {
          uri,
          size: anyInfo?.size ?? 0,
          modified: anyInfo?.modificationTime ?? 0,
        };
      })
    );
    return infos;
  }

  private async getEmbeddingsCount(): Promise<number> {
    return 0;
  }
}

// ================================================================================
// SINGLETON EXPORT
// ================================================================================

export const storageQuotaManager = new StorageQuotaManager();
export default storageQuotaManager;
