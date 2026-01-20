/**
 * useVectorSearch - Hook para busca vetorial em React Native
 *
 * Facilita o uso do VectorService em componentes React.
 * Gerencia estado de loading, resultados e erros.
 *
 * Exemplo de uso:
 * ```tsx
 * const { results, isSearching, search, error } = useVectorSearch();
 *
 * const handleSearch = async () => {
 *   const res = await search("Como ensinar subtração?", 5);
 *   console.log("Resultados:", res);
 * };
 * ```
 */

import { useState, useCallback, useEffect } from "react";
import vectorService, { SearchResult } from "../services/VectorService";

export interface UseVectorSearchOptions {
  /** Número padrão de resultados */
  defaultLimit?: number;

  /** Auto-limpar resultados ao desmontar? */
  clearOnUnmount?: boolean;

  /** Debounce time em ms (para busca automática) */
  debounceMs?: number;
}

export interface UseVectorSearchReturn {
  /** Resultados da última busca */
  results: SearchResult[];

  /** Está buscando? */
  isSearching: boolean;

  /** Erro (se houver) */
  error: Error | null;

  /** Última query executada */
  lastQuery: string | null;

  /** Executar busca */
  search: (query: string, limit?: number) => Promise<SearchResult[]>;

  /** Limpar resultados */
  clearResults: () => void;

  /** Estatísticas do cache */
  cacheStats: {
    totalQueries: number;
    memoryCacheSize: number;
  } | null;

  /** Atualizar estatísticas do cache */
  refreshCacheStats: () => Promise<void>;
}

export function useVectorSearch(
  options: UseVectorSearchOptions = {}
): UseVectorSearchReturn {
  const {
    defaultLimit = 3,
    clearOnUnmount = true,
    debounceMs = 0,
  } = options;

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState<{
    totalQueries: number;
    memoryCacheSize: number;
  } | null>(null);

  /**
   * Executar busca vetorial
   */
  const performSearch = useCallback(
    async (query: string, limit?: number): Promise<SearchResult[]> => {
      // Valida query
      if (!query || query.trim().length === 0) {
        setError(new Error("Query cannot be empty"));
        return [];
      }

      setIsSearching(true);
      setError(null);
      setLastQuery(query);

      try {
        const searchResults = await vectorService.search(
          query,
          limit || defaultLimit
        );

        setResults(searchResults);
        return searchResults;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unknown search error");
        setError(error);
        console.error("Search error:", error);
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    [defaultLimit]
  );

  /**
   * Busca com debounce (útil para auto-complete)
   */
  const debouncedSearch = useCallback(
    async (query: string, limit?: number): Promise<SearchResult[]> => {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const results = await performSearch(query, limit);
          resolve(results);
        }, debounceMs);
      });
    },
    [performSearch, debounceMs]
  );

  /**
   * Limpar resultados
   */
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setLastQuery(null);
  }, []);

  /**
   * Atualizar estatísticas do cache
   */
  const refreshCacheStats = useCallback(async () => {
    try {
      const stats = await vectorService.getCacheStats();
      setCacheStats({
        totalQueries: stats.totalQueries,
        memoryCacheSize: stats.memoryCacheSize,
      });
    } catch (err) {
      console.error("Failed to get cache stats:", err);
    }
  }, []);

  /**
   * Cleanup ao desmontar
   */
  useEffect(() => {
    // Carrega stats iniciais
    refreshCacheStats();

    return () => {
      if (clearOnUnmount) {
        clearResults();
      }
    };
  }, [clearOnUnmount, clearResults, refreshCacheStats]);

  return {
    results,
    isSearching,
    error,
    lastQuery,
    search: debounceMs > 0 ? debouncedSearch : performSearch,
    clearResults,
    cacheStats,
    refreshCacheStats,
  };
}

/**
 * Hook para pré-carregar queries comuns (modo offline)
 */
export function usePreloadCommonQueries() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState<Error | null>(null);

  const preload = useCallback(async () => {
    setIsPreloading(true);
    setPreloadError(null);

    try {
      await vectorService.preloadCommonQueries?.();
      console.log("✓ Common queries preloaded");
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Preload failed");
      setPreloadError(error);
      console.error("✗ Preload error:", error);
    } finally {
      setIsPreloading(false);
    }
  }, []);

  return { isPreloading, preloadError, preload };
}

/**
 * Hook para gerenciar cache de embeddings
 */
export function useEmbeddingCache() {
  const [stats, setStats] = useState<{
    totalQueries: number;
    memoryCacheSize: number;
    oldestTimestamp: number | null;
    mostUsedQuery: string | null;
  } | null>(null);

  const refreshStats = useCallback(async () => {
    const cacheStats = await vectorService.getCacheStats();
    setStats(cacheStats);
  }, []);

  const clearCache = useCallback(async () => {
    await vectorService.clearCache?.();
    await refreshStats();
  }, [refreshStats]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    stats,
    refreshStats,
    clearCache,
  };
}

export default useVectorSearch;