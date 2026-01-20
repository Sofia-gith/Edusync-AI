import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import connectivityService from "./ConnectivityService";

interface QueuedQuery {
  id: string;
  query: string;
  response?: string;
  metadata?: Record<string, any>;
  status: "pending" | "synced" | "failed";
  attempts: number;
  createdAt: number;
  lastAttemptAt?: number;
}

interface QuerySyncResult {
  synced: number;
  failed: number;
}

interface QueueStats {
  total: number;
  pending: number;
  failed: number;
  synced: number;
}

const QUEUE_KEY = "@offline_queries";
const CONSENT_KEY = "@analytics_consent";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

class OfflineQueryQueue {
  private apiBase(): string {
    const manifest: any = Constants?.expoConfig || (Constants as any).manifest || {};
    return manifest?.extra?.API_BASE_URL || "http://localhost:3000";
  }

  async setUserConsent(consent: boolean): Promise<void> {
    await AsyncStorage.setItem(CONSENT_KEY, consent ? "1" : "0");
  }

  private async hasConsent(): Promise<boolean> {
    const v = await AsyncStorage.getItem(CONSENT_KEY);
    return v === "1";
  }

  async addQuery(query: string, response?: string, metadata?: Record<string, any>): Promise<string> {
    const id = uid();
    const item: QueuedQuery = {
      id,
      query,
      response,
      metadata,
      status: "pending",
      attempts: 0,
      createdAt: Date.now(),
    };
    const queue = await this.getQueue();
    queue.push(item);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return id;
  }

  async getQueue(): Promise<QueuedQuery[]> {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  async getStats(): Promise<QueueStats> {
    const q = await this.getQueue();
    let pending = 0;
    let failed = 0;
    let synced = 0;
    for (const item of q) {
      if (item.status === "pending") pending++;
      else if (item.status === "failed") failed++;
      else if (item.status === "synced") synced++;
    }
    return { total: q.length, pending, failed, synced };
  }

  async clearSynced(): Promise<number> {
    const q = await this.getQueue();
    const filtered = q.filter((i) => i.status !== "synced");
    const removed = q.length - filtered.length;
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    return removed;
  }

  async retryFailed(): Promise<QuerySyncResult> {
    const q = await this.getQueue();
    const updated = q.map((i) =>
      i.status === "failed" ? { ...i, status: "pending", attempts: 0, lastAttemptAt: undefined } : i
    );
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
    return this.syncPendingQueries();
  }

  async syncPendingQueries(): Promise<QuerySyncResult> {
    if (!(await this.hasConsent())) {
      return { synced: 0, failed: 0 };
    }
    const eligible = await connectivityService.checkSyncEligibility({
      requireWiFi: false,
      allowCellular: true,
      minBatteryLevel: 20,
    });
    if (!eligible.eligible) {
      return { synced: 0, failed: 0 };
    }
    const q = await this.getQueue();
    const pending = q.filter((i) => i.status === "pending");
    const batchSize = 50;
    let syncedCount = 0;
    let failedCount = 0;
    for (let i = 0; i < pending.length; i += batchSize) {
      const batch = pending.slice(i, i + batchSize);
      try {
        const res = await fetch(`${this.apiBase()}/api/sync/queries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ queries: batch }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const successIds = new Set(batch.map((b) => b.id));
        for (const item of q) {
          if (successIds.has(item.id)) {
            item.status = "synced";
          }
        }
        syncedCount += batch.length;
      } catch {
        const failIds = new Set(batch.map((b) => b.id));
        for (const item of q) {
          if (failIds.has(item.id)) {
            item.status = "failed";
            item.attempts += 1;
            item.lastAttemptAt = Date.now();
          }
        }
        failedCount += batch.length;
      }
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    }
    return { synced: syncedCount, failed: failedCount };
  }
}

export const offlineQueryQueue = new OfflineQueryQueue();
export default offlineQueryQueue;

