/**
 * VectorService - Adapter para alinhar frontend com backend
 *
 * Responsabilidades:
 * - Receber queries em texto (string) como o backend espera
 * - Gerar embeddings (localmente ou via API)
 * - Cachear embeddings para queries repetidas
 * - Delegar busca vetorial para LocalVectorSearch
 * - Retornar resultados no formato do backend (SearchResult)
 *
 * Estratégia:
 * 1. Cache-first: Verifica se embedding já foi gerado
 * 2. Fallback para backend: Chama /api/embeddings/generate se online
 * 3. Fallback local: Usa modelo local se offline (opcional)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import localVectorSearch from "./LocalVectorSearch";
import connectivityService from "./ConnectivityService";

// ================================================================================
// INTERFACES (Alinhadas com Backend)
// ================================================================================

/**
 * Resultado de busca (formato backend)
 */
export interface SearchResult {
  /** Conteúdo do documento */
  content: string;

  /** Metadados do documento */
  metadata: {
    source?: string;
    page?: number;
    chapter?: string;
    [key: string]: any;
  };

  /** Score de similaridade (0-1) */
  score?: number;
}

/**
 * Interface do VectorService (compatível com backend)
 */
export interface IVectorService {
  /**
   * Busca vetorial a partir de uma query em texto
   * @param query - Texto da pergunta do professor
   * @param limit - Quantidade de resultados (padrão: 3)
   * @returns Array de resultados ordenados por relevância
   */
  search(query: string, limit?: number): Promise<SearchResult[]>;

  /**
   * Pré-carrega embeddings comuns (opcional)
   * Útil para queries frequentes em modo offline
   */
  preloadCommonQueries?(): Promise<void>;

  /**
   * Limpa cache de embeddings
   */
  clearCache?(): Promise<void>;
}

// ================================================================================
// CONFIGURAÇÃO
// ================================================================================

const EMBEDDING_CACHE_KEY = "@vector_embedding_cache";
const COMMON_QUERIES_KEY = "@common_queries_cache";
const CACHE_VERSION = "1.0.0"; // Incrementar se formato mudar

interface CachedEmbedding {
  query: string;
  embedding: number[];
  timestamp: number;
  usageCount: number;
  version: string;
}

interface EmbeddingCacheStorage {
  [query: string]: CachedEmbedding;
}

// ================================================================================
// VECTOR SERVICE
// ================================================================================

class VectorService implements IVectorService {
  private memoryCache = new Map<string, number[]>();
  private commonQueries: string[] = [
    "Como ensinar subtração com zero?",
    "Estratégias para turmas multisseriadas",
    "Como lidar com alunos em diferentes níveis?",
    "Atividades para alfabetização",
    "Como ensinar matemática de forma lúdica?",
  ];

  /**
   * Obtém URL base da API
   */
  private getApiBaseUrl(): string {
    const manifest: any =
      Constants?.expoConfig || (Constants as any).manifest || {};
    return manifest?.extra?.API_BASE_URL || "http://localhost:3000";
  }

  /**
   * Busca vetorial (método principal - alinhado com backend)
   */
  async search(query: string, limit: number = 3): Promise<SearchResult[]> {
    try {
      // 1. Normaliza query (lowercase, trim)
      const normalizedQuery = query.trim().toLowerCase();

      // 2. Obtém embedding (cache → backend → local)
      const embedding = await this.getEmbedding(normalizedQuery);

      if (!embedding) {
        console.warn("Failed to generate embedding for query:", query);
        return [];
      }

      // 3. Busca local usando LocalVectorSearch
      const localResults = await localVectorSearch.search(embedding, {
        topK: limit,
        minScore: 0.5, // Threshold mínimo de similaridade
      });

      // 4. Converte LocalSearchResult → SearchResult (formato backend)
      const results: SearchResult[] = localResults.map((r) => ({
        content: r.content || "",
        metadata: {
          source: r.source,
          chapter: r.chapter,
          ...r.metadata,
        },
        score: r.score,
      }));

      // 5. Incrementa contador de uso no cache
      await this.incrementUsageCount(normalizedQuery);

      return results;
    } catch (error) {
      console.error("Error in VectorService.search:", error);
      return [];
    }
  }

  /**
   * Obtém embedding para uma query (cache-first strategy)
   */
  private async getEmbedding(query: string): Promise<number[] | null> {
    // 1. Verifica memória RAM (mais rápido)
    if (this.memoryCache.has(query)) {
      return this.memoryCache.get(query)!;
    }

    // 2. Verifica AsyncStorage (cache persistente)
    const cachedEmbedding = await this.getCachedEmbedding(query);
    if (cachedEmbedding) {
      this.memoryCache.set(query, cachedEmbedding);
      return cachedEmbedding;
    }

    // 3. Gera novo embedding
    const embedding = await this.generateEmbedding(query);

    if (embedding) {
      // Salva no cache
      await this.saveCachedEmbedding(query, embedding);
      this.memoryCache.set(query, embedding);
    }

    return embedding;
  }

  /**
   * Gera embedding (online → offline fallback)
   */
  private async generateEmbedding(query: string): Promise<number[] | null> {
    // Verifica conectividade
    const status = await connectivityService.getStatus();

    if (status.isConnected) {
      // Tenta gerar no backend
      try {
        return await this.generateEmbeddingFromBackend(query);
      } catch (error) {
        console.warn("Backend embedding failed, trying local:", error);
        // Fallback para local se backend falhar
      }
    }

    // Fallback: Gera localmente (se implementado)
    // return await this.generateEmbeddingLocally(query);

    // Por enquanto, retorna null (será implementado no Milestone 4)
    console.warn("No offline embedding generation available");
    return null;
  }

  /**
   * Gera embedding via backend API
   */
  private async generateEmbeddingFromBackend(
    query: string
  ): Promise<number[]> {
    const url = `${this.getApiBaseUrl()}/api/embeddings/generate`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Backend deve retornar: { embedding: number[] }
    if (!data.embedding || !Array.isArray(data.embedding)) {
      throw new Error("Invalid embedding format from backend");
    }

    // Valida dimensões (384 para all-MiniLM-L6-v2)
    if (!localVectorSearch.validateDimensions(data.embedding)) {
      throw new Error(
        `Invalid embedding dimensions: ${data.embedding.length}, expected 384`
      );
    }

    return data.embedding;
  }

  /**
   * Gera embedding localmente (OPCIONAL - para Milestone 4)
   *
   * Descomente quando implementar LocalEmbeddingService
   */
  // private async generateEmbeddingLocally(query: string): Promise<number[]> {
  //   const localEmbeddingService = new LocalEmbeddingService();
  //   const result = await localEmbeddingService.generateEmbedding(query);
  //   return result.embedding;
  // }

  /**
   * Obtém embedding do cache persistente
   */
  private async getCachedEmbedding(query: string): Promise<number[] | null> {
    try {
      const cacheJson = await AsyncStorage.getItem(EMBEDDING_CACHE_KEY);
      if (!cacheJson) return null;

      const cache: EmbeddingCacheStorage = JSON.parse(cacheJson);
      const cached = cache[query];

      if (!cached) return null;

      // Verifica versão do cache
      if (cached.version !== CACHE_VERSION) {
        console.log("Cache version mismatch, ignoring cached embedding");
        return null;
      }

      // Verifica idade do cache (30 dias)
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 dias
      const age = Date.now() - cached.timestamp;
      if (age > maxAge) {
        console.log("Cached embedding expired");
        return null;
      }

      return cached.embedding;
    } catch (error) {
      console.error("Error reading cached embedding:", error);
      return null;
    }
  }

  /**
   * Salva embedding no cache persistente
   */
  private async saveCachedEmbedding(
    query: string,
    embedding: number[]
  ): Promise<void> {
    try {
      const cacheJson = await AsyncStorage.getItem(EMBEDDING_CACHE_KEY);
      const cache: EmbeddingCacheStorage = cacheJson
        ? JSON.parse(cacheJson)
        : {};

      cache[query] = {
        query,
        embedding,
        timestamp: Date.now(),
        usageCount: 1,
        version: CACHE_VERSION,
      };

      // Limita cache a 1000 queries (LRU)
      const keys = Object.keys(cache);
      if (keys.length > 1000) {
        const sorted = keys.sort(
          (a, b) => cache[a].timestamp - cache[b].timestamp
        );
        const toRemove = sorted.slice(0, 100); // Remove 100 mais antigas
        toRemove.forEach((k) => delete cache[k]);
      }

      await AsyncStorage.setItem(EMBEDDING_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error("Error saving cached embedding:", error);
    }
  }

  /**
   * Incrementa contador de uso de uma query
   */
  private async incrementUsageCount(query: string): Promise<void> {
    try {
      const cacheJson = await AsyncStorage.getItem(EMBEDDING_CACHE_KEY);
      if (!cacheJson) return;

      const cache: EmbeddingCacheStorage = JSON.parse(cacheJson);
      if (cache[query]) {
        cache[query].usageCount += 1;
        await AsyncStorage.setItem(EMBEDDING_CACHE_KEY, JSON.stringify(cache));
      }
    } catch (error) {
      console.error("Error incrementing usage count:", error);
    }
  }

  /**
   * Pré-carrega embeddings para queries comuns
   * Útil para preparar app para modo offline
   */
  async preloadCommonQueries(): Promise<void> {
    console.log("Preloading common queries...");

    for (const query of this.commonQueries) {
      try {
        await this.getEmbedding(query.toLowerCase());
        console.log(`✓ Preloaded: ${query}`);
      } catch (error) {
        console.error(`✗ Failed to preload: ${query}`, error);
      }
    }

    console.log("Common queries preloaded!");
  }

  /**
   * Limpa cache de embeddings
   */
  async clearCache(): Promise<void> {
    this.memoryCache.clear();
    await AsyncStorage.removeItem(EMBEDDING_CACHE_KEY);
    console.log("Embedding cache cleared");
  }

  /**
   * Obtém estatísticas do cache
   */
  async getCacheStats(): Promise<{
    totalQueries: number;
    memoryCacheSize: number;
    oldestTimestamp: number | null;
    mostUsedQuery: string | null;
  }> {
    const cacheJson = await AsyncStorage.getItem(EMBEDDING_CACHE_KEY);
    if (!cacheJson) {
      return {
        totalQueries: 0,
        memoryCacheSize: this.memoryCache.size,
        oldestTimestamp: null,
        mostUsedQuery: null,
      };
    }

    const cache: EmbeddingCacheStorage = JSON.parse(cacheJson);
    const entries = Object.values(cache);

    const oldest = entries.length
      ? Math.min(...entries.map((e) => e.timestamp))
      : null;

    const mostUsed = entries.length
      ? entries.reduce((a, b) => (a.usageCount > b.usageCount ? a : b)).query
      : null;

    return {
      totalQueries: entries.length,
      memoryCacheSize: this.memoryCache.size,
      oldestTimestamp: oldest,
      mostUsedQuery: mostUsed,
    };
  }
}

// ================================================================================
// SINGLETON EXPORT
// ================================================================================

export const vectorService = new VectorService();
export default vectorService;