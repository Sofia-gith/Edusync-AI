import { useState, useEffect, useCallback } from 'react';
import connectivityService, {
  ConnectivityStatus,
  ConnectionQuality,
  SyncEligibility,
  SyncRules,
} from '../services/ConnectivityService';

/**
 * Hook para gerenciar conectividade no React Native
 * 
 * Exemplo de uso:
 * ```tsx
 * const { isConnected, type, checkSyncEligibility } = useConnectivity();
 * 
 * const handleSync = async () => {
 *   const eligibility = await checkSyncEligibility({
 *     requireWiFi: true,
 *     minBatteryLevel: 20,
 *     allowCellular: false,
 *   });
 *   
 *   if (eligibility.eligible) {
 *     // Iniciar sincronização
 *   } else {
 *     alert(eligibility.reason);
 *   }
 * };
 * ```
 */
export function useConnectivity() {
  const [status, setStatus] = useState<ConnectivityStatus>({
    isConnected: false,
    type: 'unknown',
    isInternetReachable: null,
  });

  const [quality, setQuality] = useState<ConnectionQuality | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ========================================
  // Efeito: Buscar status inicial e assinar mudanças
  // ========================================
  useEffect(() => {
    let isSubscribed = true;

    // Buscar status inicial
    const fetchInitialStatus = async () => {
      try {
        const initialStatus = await connectivityService.getStatus();
        if (isSubscribed) {
          setStatus(initialStatus);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching initial connectivity status:', error);
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialStatus();

    // Assinar mudanças de conectividade
    const unsubscribe = connectivityService.onConnectivityChange((newStatus) => {
      if (isSubscribed) {
        setStatus(newStatus);
      }
    });

    // Cleanup
    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // ========================================
  // Função: Testar qualidade de conexão
  // ========================================
  const checkQuality = useCallback(async (apiBaseUrl: string = 'https://api.edusync.com') => {
    try {
      const connectionQuality = await connectivityService.testConnectionQuality(apiBaseUrl);
      setQuality(connectionQuality);
      return connectionQuality;
    } catch (error) {
      console.error('Error checking connection quality:', error);
      const poorQuality: ConnectionQuality = { latency: -1, quality: 'poor' };
      setQuality(poorQuality);
      return poorQuality;
    }
  }, []);

  // ========================================
  // Função: Verificar elegibilidade de sync
  // ========================================
  const checkSyncEligibility = useCallback(async (rules: SyncRules): Promise<SyncEligibility> => {
    try {
      return await connectivityService.checkSyncEligibility(rules);
    } catch (error) {
      console.error('Error checking sync eligibility:', error);
      return {
        eligible: false,
        reason: 'Error checking sync eligibility',
      };
    }
  }, []);

  // ========================================
  // Função: Estimar tempo de download
  // ========================================
  const estimateDownloadTime = useCallback(async (bytes: number): Promise<number> => {
    try {
      return await connectivityService.estimateDownloadTime(bytes);
    } catch (error) {
      console.error('Error estimating download time:', error);
      return Infinity;
    }
  }, []);

  // ========================================
  // Função: Forçar atualização do status
  // ========================================
  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const newStatus = await connectivityService.getStatus();
      setStatus(newStatus);
    } catch (error) {
      console.error('Error refreshing connectivity status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========================================
  // Retorno do hook
  // ========================================
  return {
    // Status
    isConnected: status.isConnected,
    type: status.type,
    isInternetReachable: status.isInternetReachable,
    quality,
    isLoading,

    // Métodos
    checkQuality,
    checkSyncEligibility,
    estimateDownloadTime,
    refreshStatus,

    // Status completo (para casos avançados)
    fullStatus: status,
  };
}

export default useConnectivity;