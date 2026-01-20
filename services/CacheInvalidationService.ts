/**
 * CacheInvalidationService - Gerencia a validade e versionamento dos dados em cache
 *
 * Responsabilidades:
 * - Rastrear timestamps de criação/atualização de dados
 * - Verificar se dados expiraram (TTL)
 * - Gerenciar versões de dados para invalidar caches obsoletos
 * - Forçar invalidação de chaves específicas
 * - Alinhar com interface definida em message.txt (ICacheInvalidationService)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// ================================================================================
// INTERFACES & TYPES
// ================================================================================

export interface CacheMetadata {
  key: string;
  timestamp: number; // Quando foi salvo
  version: string | number; // Versão do dado (opcional)
  ttl?: number; // Time-to-live específico (opcional)
}

export interface CacheStatus {
  isValid: boolean;
  isExpired: boolean;
  lastUpdated: number | null;
  version: string | number | null;
  reason?: "expired" | "version_mismatch" | "missing" | "valid";
}

const METADATA_PREFIX = "@cache_meta:";
const CACHE_VERSION_KEY = "@cache_version";
const CACHE_TIMESTAMP_KEY = "@cache_timestamp";
const DEFAULT_MAX_AGE_HOURS = 30 * 24; // 30 dias

// ================================================================================
// CACHE INVALIDATION SERVICE
// ================================================================================

class CacheInvalidationService {
  private getApiBaseUrl(): string {
    const manifest: any =
      Constants?.expoConfig || (Constants as any).manifest || {};
    const apiBase = manifest?.extra?.API_BASE_URL || "";
    return apiBase || "";
  }

  /**
   * getLatestVersion(): Busca versão mais recente do backend
   */
  async getLatestVersion(): Promise<string> {
    const base = this.getApiBaseUrl();
    const url = (base ? `${base}` : "") + `/api/sync/version`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      throw new Error(`Failed to get latest version: ${res.status}`);
    }
    const data = await res.json();
    // Suporta payloads simples como { version: "1.2.3" } ou string
    return typeof data === "string" ? data : String(data.version ?? "");
  }

  /**
   * updateLocalVersion(version): Atualiza versão local e timestamp
   */
  async updateLocalVersion(version: string): Promise<void> {
    const now = Date.now();
    await AsyncStorage.multiSet([
      [CACHE_VERSION_KEY, version],
      [CACHE_TIMESTAMP_KEY, String(now)],
    ]);
  }

  /**
   * isCacheExpired(maxAgeHours?): Verifica expiração pelo tempo
   */
  async isCacheExpired(
    maxAgeHours: number = DEFAULT_MAX_AGE_HOURS
  ): Promise<boolean> {
    const tsStr = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!tsStr) return true;
    const ts = Number(tsStr);
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    return Date.now() - ts > maxAgeMs;
  }

  /**
   * isOutdated(): Compara versão local com remota
   * Força full sync se diferença > 2 major versions
   */
  async isOutdated(): Promise<boolean> {
    const latest = await this.getLatestVersion();
    const local = (await AsyncStorage.getItem(CACHE_VERSION_KEY)) || "";
    if (!local || !latest) return true;
    const majorLocal = parseInt(String(local).split(".")[0] || "0", 10);
    const majorRemote = parseInt(String(latest).split(".")[0] || "0", 10);
    return majorRemote - majorLocal > 2 || local !== latest;
  }

  /**
   * invalidateCache(): Invalida todo cache relacionado a embeddings
   */
  async invalidateCache(): Promise<void> {
    await this.clearAllMetadata();
    await AsyncStorage.multiRemove([CACHE_VERSION_KEY, CACHE_TIMESTAMP_KEY]);
  }

  /**
   * checkCacheStatus(): Alinhado ao guia (versão global)
   */
  async checkCacheStatus(): Promise<CacheStatus> {
    try {
      const [localVersion, isExpired] = await Promise.all([
        AsyncStorage.getItem(CACHE_VERSION_KEY),
        this.isCacheExpired(),
      ]);
      if (!localVersion) {
        return {
          isValid: false,
          isExpired: true,
          lastUpdated: null,
          version: null,
          reason: "missing",
        };
      }

      if (isExpired) {
        const tsStr = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
        return {
          isValid: false,
          isExpired: true,
          lastUpdated: tsStr ? Number(tsStr) : null,
          version: localVersion,
          reason: "expired",
        };
      }

      const outdated = await this.isOutdated();
      if (outdated) {
        const tsStr = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
        return {
          isValid: false,
          isExpired: false,
          lastUpdated: tsStr ? Number(tsStr) : null,
          version: localVersion,
          reason: "version_mismatch",
        };
      }

      const tsStr = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      return {
        isValid: true,
        isExpired: false,
        lastUpdated: tsStr ? Number(tsStr) : null,
        version: localVersion,
        reason: "valid",
      };
    } catch (error) {
      console.error("Error in global cache status:", error);
      return {
        isValid: false,
        isExpired: true,
        lastUpdated: null,
        version: null,
        reason: "missing",
      };
    }
  }

  /**
   * Registra atualização de um item no cache
   * @param key Chave do item
   * @param version Versão opcional do dado
   * @param ttl TTL opcional em milissegundos
   */
  async touch(
    key: string,
    version: string | number = 1,
    ttl?: number
  ): Promise<void> {
    const metadata: CacheMetadata = {
      key,
      timestamp: Date.now(),
      version,
      ttl,
    };

    try {
      await AsyncStorage.setItem(
        `${METADATA_PREFIX}${key}`,
        JSON.stringify(metadata)
      );
    } catch (error) {
      console.error(`Error saving cache metadata for ${key}:`, error);
    }
  }

  /**
   * Verifica o status de um item do cache
   * @param key Chave do item
   * @param expectedVersion Versão esperada (se houver atualização de schema/app)
   * @param defaultTtl TTL padrão se não houver um específico salvo (ms)
   */
  async checkKeyStatus(
    key: string,
    expectedVersion?: string | number,
    defaultTtl: number = 24 * 60 * 60 * 1000 // 24 horas default
  ): Promise<CacheStatus> {
    try {
      const raw = await AsyncStorage.getItem(`${METADATA_PREFIX}${key}`);

      if (!raw) {
        return {
          isValid: false,
          isExpired: true,
          lastUpdated: null,
          version: null,
          reason: "missing",
        };
      }

      const metadata: CacheMetadata = JSON.parse(raw);
      const now = Date.now();
      const ttl = metadata.ttl || defaultTtl;
      const age = now - metadata.timestamp;

      // Verifica expiração por tempo
      if (age > ttl) {
        return {
          isValid: false,
          isExpired: true,
          lastUpdated: metadata.timestamp,
          version: metadata.version,
          reason: "expired",
        };
      }

      // Verifica versão (se fornecida)
      if (
        expectedVersion !== undefined &&
        metadata.version !== expectedVersion
      ) {
        return {
          isValid: false,
          isExpired: false, // Não expirou por tempo, mas por versão
          lastUpdated: metadata.timestamp,
          version: metadata.version,
          reason: "version_mismatch",
        };
      }

      return {
        isValid: true,
        isExpired: false,
        lastUpdated: metadata.timestamp,
        version: metadata.version,
        reason: "valid",
      };
    } catch (error) {
      console.error(`Error checking cache status for ${key}:`, error);
      return {
        isValid: false,
        isExpired: true,
        lastUpdated: null,
        version: null,
        reason: "missing",
      };
    }
  }

  /**
   * Invalida (remove metadata) de um item específico
   */
  async invalidate(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${METADATA_PREFIX}${key}`);
    } catch (error) {
      console.error(`Error invalidating cache for ${key}:`, error);
    }
  }

  /**
   * Invalida todos os itens que começam com um prefixo
   */
  async invalidatePrefix(prefix: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const metaKeys = keys.filter((k) =>
        k.startsWith(`${METADATA_PREFIX}${prefix}`)
      );
      if (metaKeys.length > 0) {
        await AsyncStorage.multiRemove(metaKeys);
      }
    } catch (error) {
      console.error(`Error invalidating prefix ${prefix}:`, error);
    }
  }

  /**
   * Limpa todos os metadados de cache
   */
  async clearAllMetadata(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const metaKeys = keys.filter((k) => k.startsWith(METADATA_PREFIX));
      if (metaKeys.length > 0) {
        await AsyncStorage.multiRemove(metaKeys);
      }
    } catch (error) {
      console.error("Error clearing all cache metadata:", error);
    }
  }
}

// ================================================================================
// SINGLETON EXPORT
// ================================================================================

export const cacheInvalidationService = new CacheInvalidationService();
export default cacheInvalidationService;
