/**
 * ConnectivityService - Gerencia conectividade de rede e elegibilidade de sincronização
 *
 * Dependências necessárias:
 * npm install @react-native-community/netinfo react-native-device-info
 */

import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import DeviceInfo from "react-native-device-info";

// ================================================================================
// INTERFACES & TYPES
// ================================================================================

export interface ConnectivityStatus {
  isConnected: boolean;
  type: "wifi" | "cellular" | "none" | "unknown";
  isInternetReachable: boolean | null;
}

export interface ConnectionQuality {
  latency: number; // em millisegundos
  quality: "excellent" | "good" | "fair" | "poor";
}

export interface SyncEligibility {
  eligible: boolean;
  reason?: string;
  batteryLevel?: number;
  connectionType?: string;
}

export interface SyncRules {
  requireWiFi: boolean; // Exigir WiFi para sincronização?
  minBatteryLevel: number; // Nível mínimo de bateria (0-100)
  allowCellular: boolean; // Permitir dados móveis?
}

// ================================================================================
// CONNECTIVITY SERVICE
// ================================================================================

class ConnectivityService {
  private listeners: Array<(status: ConnectivityStatus) => void> = [];
  private netInfoUnsubscribe: (() => void) | null = null;

  constructor() {
    this.initializeNetInfoListener();
  }

  /**
   * Inicializa o listener de mudanças de conectividade
   */
  private initializeNetInfoListener() {
    this.netInfoUnsubscribe = NetInfo.addEventListener(
      (state: NetInfoState) => {
        const status = this.parseNetInfoState(state);
        this.notifyListeners(status);
      }
    );
  }

  /**
   * Converte estado do NetInfo para ConnectivityStatus
   */
  private parseNetInfoState(state: NetInfoState): ConnectivityStatus {
    const isConnected = state.isConnected ?? false;

    let type: ConnectivityStatus["type"] = "unknown";
    if (state.type === "wifi") {
      type = "wifi";
    } else if (state.type === "cellular") {
      type = "cellular";
    } else if (state.type === "none") {
      type = "none";
    } else if (isConnected) {
      // Fallback para qualquer outro tipo conectado (ethernet, bluetooth, vpn, other)
      // Emuladores frequentemente caem aqui
      type = "wifi";
    }

    return {
      isConnected,
      type,
      isInternetReachable: state.isInternetReachable,
    };
  }

  /**
   * Obtém o status atual de conectividade
   */
  async getStatus(): Promise<ConnectivityStatus> {
    const state = await NetInfo.fetch();
    return this.parseNetInfoState(state);
  }

  /**
   * Verifica se o dispositivo está elegível para sincronização
   * baseado nas regras fornecidas
   */
  async checkSyncEligibility(rules: SyncRules): Promise<SyncEligibility> {
    const status = await this.getStatus();
    const batteryLevel = await this.getBatteryLevel();

    // Regra 1: Deve estar conectado à internet
    if (!status.isConnected) {
      return {
        eligible: false,
        reason: "No internet connection available",
        batteryLevel,
        connectionType: status.type,
      };
    }

    // Regra 2: Internet deve ser alcançável
    if (status.isInternetReachable === false) {
      return {
        eligible: false,
        reason: "Internet not reachable",
        batteryLevel,
        connectionType: status.type,
      };
    }

    // Regra 3: WiFi obrigatório?
    if (rules.requireWiFi && status.type !== "wifi") {
      return {
        eligible: false,
        reason: "WiFi connection required for sync",
        batteryLevel,
        connectionType: status.type,
      };
    }

    // Regra 4: Nível mínimo de bateria
    if (batteryLevel < rules.minBatteryLevel) {
      return {
        eligible: false,
        reason: `Battery too low (${batteryLevel}%). Minimum required: ${rules.minBatteryLevel}%`,
        batteryLevel,
        connectionType: status.type,
      };
    }

    // Regra 5: Permitir dados móveis?
    if (!rules.allowCellular && status.type === "cellular") {
      return {
        eligible: false,
        reason: "Cellular data not allowed for sync",
        batteryLevel,
        connectionType: status.type,
      };
    }

    // Todas as regras passaram!
    return {
      eligible: true,
      batteryLevel,
      connectionType: status.type,
    };
  }

  /**
   * Registra callback para mudanças de conectividade
   * Retorna função para cancelar inscrição
   */
  onConnectivityChange(
    callback: (status: ConnectivityStatus) => void
  ): () => void {
    this.listeners.push(callback);

    // Retorna função de cleanup
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Notifica todos os listeners sobre mudança de conectividade
   */
  private notifyListeners(status: ConnectivityStatus) {
    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (error) {
        console.error("Error in connectivity listener:", error);
      }
    });
  }

  /**
   * Estima tempo de download baseado no tipo de conexão
   * @param bytes - Tamanho do arquivo em bytes
   * @returns Tempo estimado em segundos
   */
  async estimateDownloadTime(bytes: number): Promise<number> {
    const status = await this.getStatus();

    // Velocidades médias estimadas (bytes por segundo)
    const averageSpeeds: Record<ConnectivityStatus["type"], number> = {
      wifi: 2_000_000, // 2 MB/s (WiFi rural típico)
      cellular: 500_000, // 500 KB/s (3G/4G rural)
      none: 0,
      unknown: 500_000, // Assume 3G como fallback
    };

    const speed = averageSpeeds[status.type];

    if (speed === 0) {
      return Infinity; // Sem conexão
    }

    return Math.ceil(bytes / speed);
  }

  /**
   * Testa a qualidade da conexão fazendo ping ao servidor
   * @param apiBaseUrl - URL base da API para testar
   */
  async testConnectionQuality(apiBaseUrl: string): Promise<ConnectionQuality> {
    const startTime = Date.now();

    try {
      // Faz requisição HEAD (mais leve) para endpoint de health
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      await fetch(`${apiBaseUrl}/health`, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;

      // Classificação de qualidade baseada em latência
      let quality: ConnectionQuality["quality"];
      if (latency < 100) {
        quality = "excellent"; // <100ms
      } else if (latency < 300) {
        quality = "good"; // 100-300ms
      } else if (latency < 1000) {
        quality = "fair"; // 300ms-1s
      } else {
        quality = "poor"; // >1s
      }

      return { latency, quality };
    } catch (error) {
      console.error("Connection quality test failed:", error);
      return { latency: -1, quality: "poor" };
    }
  }

  /**
   * Obtém nível de bateria do dispositivo
   * @returns Nível de bateria (0-100)
   */
  private async getBatteryLevel(): Promise<number> {
    try {
      const batteryLevel = await DeviceInfo.getBatteryLevel();
      // getBatteryLevel retorna valor entre 0 e 1
      return Math.floor(batteryLevel * 100);
    } catch (error) {
      console.error("Error getting battery level:", error);
      return 100; // Assume 100% em caso de erro (fail-safe)
    }
  }

  /**
   * Limpa recursos ao destruir o serviço
   */
  destroy() {
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
      this.netInfoUnsubscribe = null;
    }
    this.listeners = [];
  }
}

// ================================================================================
// SINGLETON EXPORT
// ================================================================================

export const connectivityService = new ConnectivityService();
export default connectivityService;
