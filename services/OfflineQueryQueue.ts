/**
 * OfflineQueryQueue - Versão Migrada para WatermelonDB
 * 
 * ✅ Migrado de AsyncStorage para WatermelonDB
 * ✅ Suporta queries complexas (filtrar por status, prioridade, timestamp)
 * ✅ Performance otimizada para 1000+ queries
 * ✅ Sincronização incremental com backend
 * ✅ Indexes otimizados para analytics
 * 
 * @module OfflineQueryQueue
 */

import database from '../database';
import OfflineQuery from '../database/models/OfflineQuery';
import { Q } from '@nozbe/watermelondb';
import Constants from 'expo-constants';
import connectivityService from './ConnectivityService';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ================================================================================
// INTERFACES
// ================================================================================

export type QueryStatus = 'pending' | 'synced' | 'failed';
export type QueryPriority = 'low' | 'normal' | 'high';

export interface QueryMetadata {
  /** Fonte da resposta (local/cache/fallback) */
  responseSource: 'local' | 'cache' | 'fallback';
  /** ID da conversação (para contexto) */
  conversationId?: string;
  /** Prioridade customizada */
  priority?: QueryPriority;
  /** Dados adicionais */
  [key: string]: any;
}

export interface QuerySyncResult {
  synced: number;
  failed: number;
}

export interface QueueStats {
  total: number;
  pending: number;
  failed: number;
  synced: number;
  byPriority: {
    high: number;
    normal: number;
    low: number;
  };
}

// ================================================================================
// CONSTANTS
// ================================================================================

const CONSENT_KEY = '@analytics_consent';
const BATCH_SIZE = 50;
const MAX_RETRIES = 3;

// ================================================================================
// OFFLINE QUERY QUEUE SERVICE (WatermelonDB)
// ================================================================================

class OfflineQueryQueue {
  /**
   * Obtém URL base da API
   */
  private getApiBaseUrl(): string {
    const manifest: any = Constants?.expoConfig || (Constants as any).manifest || {};
    return manifest?.extra?.API_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Gerencia consentimento do usuário para analytics
   */
  async setUserConsent(consent: boolean): Promise<void> {
    await AsyncStorage.setItem(CONSENT_KEY, consent ? '1' : '0');
  }

  /**
   * Verifica se usuário consentiu com analytics
   */
  private async hasConsent(): Promise<boolean> {
    const value = await AsyncStorage.getItem(CONSENT_KEY);
    return value === '1';
  }

  /**
   * Adiciona query à fila offline
   * 
   * @param query - Texto da pergunta do professor
   * @param response - Resposta fornecida (opcional)
   * @param metadata - Metadados adicionais
   * @returns ID da query na fila
   */
  async addQuery(
    query: string,
    response?: string,
    metadata?: QueryMetadata
  ): Promise<string> {
    const queriesCollection = database.get<OfflineQuery>('offline_queries');

    const newQuery = await database.write(async () => {
      return await queriesCollection.create((record) => {
        record.query = query;
        record.response = response || '';
        record.timestamp = Date.now();
        record.status = 'pending';
        record.priority = metadata?.priority || 'normal';
        record.retryCount = 0;
        record.responseSource = metadata?.responseSource || 'local';
        record.conversationId = metadata?.conversationId;
        record.deviceId = this.getDeviceId();
        record.appVersion = DeviceInfo.getVersion();
      });
    });

    console.log(`✅ Query adicionada à fila: ${newQuery.id}`);
    return newQuery.id;
  }

  /**
   * Busca queries na fila (com filtros opcionais)
   * 
   * @param status - Filtrar por status (opcional)
   * @returns Array de queries
   */
  async getQueue(status?: QueryStatus): Promise<OfflineQuery[]> {
    const queriesCollection = database.get<OfflineQuery>('offline_queries');

    const conditions: any[] = [];
    
    if (status) {
      conditions.push(Q.where('status', status));
    }

    return await queriesCollection
      .query(...conditions)
      .fetch();
  }

  /**
   * Obtém estatísticas da fila
   */
  async getStats(): Promise<QueueStats> {
    const queriesCollection = database.get<OfflineQuery>('offline_queries');

    // Queries otimizadas com indexes
    const [pending, failed, synced, high, normal, low] = await Promise.all([
      queriesCollection.query(Q.where('status', 'pending')).fetchCount(),
      queriesCollection.query(Q.where('status', 'failed')).fetchCount(),
      queriesCollection.query(Q.where('status', 'synced')).fetchCount(),
      queriesCollection.query(Q.where('priority', 'high')).fetchCount(),
      queriesCollection.query(Q.where('priority', 'normal')).fetchCount(),
      queriesCollection.query(Q.where('priority', 'low')).fetchCount(),
    ]);

    return {
      total: pending + failed + synced,
      pending,
      failed,
      synced,
      byPriority: { high, normal, low },
    };
  }

  /**
   * Remove queries sincronizadas (cleanup)
   * 
   * @returns Número de queries removidas
   */
  async clearSynced(): Promise<number> {
    const synced = await this.getQueue('synced');

    await database.write(async () => {
      await Promise.all(synced.map((q) => q.markAsDeleted()));
    });

    console.log(`🗑️  ${synced.length} queries sincronizadas removidas`);
    return synced.length;
  }

  /**
   * Reprocessa queries que falharam
   * 
   * @returns Resultado da sincronização
   */
  async retryFailed(): Promise<QuerySyncResult> {
    const failed = await this.getQueue('failed');

    if (failed.length === 0) {
      console.log('ℹ️  Nenhuma query falha para reprocessar');
      return { synced: 0, failed: 0 };
    }

    // Reseta status e contador de tentativas
    await database.write(async () => {
      await Promise.all(
        failed.map((q) =>
          q.update((record) => {
            record.status = 'pending';
            record.retryCount = 0;
            record.errorMessage = undefined;
          })
        )
      );
    });

    console.log(`🔄 ${failed.length} queries marcadas para retry`);
    
    // Tenta sincronizar novamente
    return this.syncPendingQueries();
  }

  /**
   * Sincroniza queries pendentes com backend
   * 
   * Estratégia:
   * 1. Verifica conectividade e elegibilidade
   * 2. Busca queries pendentes (ordenadas por prioridade e timestamp)
   * 3. Envia em batches para evitar timeout
   * 4. Atualiza status local baseado em resposta do backend
   * 
   * @returns Resultado da sincronização
   */
  async syncPendingQueries(): Promise<QuerySyncResult> {
    // 1. Verifica consentimento
    if (!(await this.hasConsent())) {
      console.log('⚠️  Usuário não consentiu com analytics - sync cancelado');
      return { synced: 0, failed: 0 };
    }

    // 2. Verifica elegibilidade (WiFi, bateria, etc.)
    const eligible = await connectivityService.checkSyncEligibility({
      requireWiFi: false,
      allowCellular: true,
      minBatteryLevel: 20,
    });

    if (!eligible.eligible) {
      console.log(`⚠️  Sync não elegível: ${eligible.reason}`);
      return { synced: 0, failed: 0 };
    }

    // 3. Busca queries pendentes (ordenadas por prioridade e timestamp)
    const queriesCollection = database.get<OfflineQuery>('offline_queries');
    const pending = await queriesCollection
      .query(
        Q.where('status', 'pending'),
        Q.sortBy('priority', Q.desc), // high > normal > low
        Q.sortBy('timestamp', Q.asc)  // mais antigas primeiro
      )
      .fetch();

    if (pending.length === 0) {
      console.log('ℹ️  Nenhuma query pendente para sincronizar');
      return { synced: 0, failed: 0 };
    }

    console.log(`🔄 Sincronizando ${pending.length} queries...`);

    let syncedCount = 0;
    let failedCount = 0;

    // 4. Processa em batches
    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
      const batch = pending.slice(i, i + BATCH_SIZE);

      try {
        // Prepara payload
        const payload = batch.map((q) => ({
          id: q.id,
          query: q.query,
          response: q.response,
          timestamp: q.timestamp,
          priority: q.priority,
          responseSource: q.responseSource,
          conversationId: q.conversationId,
          deviceId: q.deviceId,
          appVersion: q.appVersion,
        }));

        // Envia para backend
        const response = await fetch(`${this.getApiBaseUrl()}/api/sync/queries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ queries: payload }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Marca como sincronizadas
        await database.write(async () => {
          await Promise.all(
            batch.map((q) =>
              q.update((record) => {
                record.status = 'synced';
              })
            )
          );
        });

        syncedCount += batch.length;
        console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} sincronizado (${batch.length} queries)`);

      } catch (error) {
        console.error(`❌ Erro ao sincronizar batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);

        // Marca como falhas (incrementa retry count)
        await database.write(async () => {
          await Promise.all(
            batch.map((q) =>
              q.update((record) => {
                record.status = record.retryCount + 1 >= MAX_RETRIES ? 'failed' : 'pending';
                record.retryCount += 1;
                record.errorMessage = String(error);
              })
            )
          );
        });

        failedCount += batch.length;
      }
    }

    console.log(`📊 Sync completo: ${syncedCount} sucesso, ${failedCount} falhas`);
    
    return { synced: syncedCount, failed: failedCount };
  }

  /**
   * Gera device ID único (hasheado para privacidade)
   * 
   * ⚠️ IMPORTANTE: Em produção, aplicar SHA-256 hash
   */
  private getDeviceId(): string {
    try {
      const uniqueId = DeviceInfo.getUniqueIdSync();
      
      // TODO: Aplicar SHA-256 hash para privacidade
      // import CryptoJS from 'crypto-js';
      // return CryptoJS.SHA256(uniqueId).toString();
      
      return uniqueId;
    } catch (error) {
      console.error('Erro ao obter device ID:', error);
      return 'unknown-device';
    }
  }

  /**
   * Busca queries por conversação (para histórico)
   * 
   * @param conversationId - ID da conversação
   * @returns Queries da conversação
   */
  async getQueriesByConversation(conversationId: string): Promise<OfflineQuery[]> {
    const queriesCollection = database.get<OfflineQuery>('offline_queries');

    return await queriesCollection
      .query(Q.where('conversation_id', conversationId))
      .fetch();
  }

  /**
   * Limpa queries antigas (> X dias)
   * 
   * @param daysOld - Idade mínima em dias (padrão: 30)
   * @returns Número de queries removidas
   */
  async cleanupOldQueries(daysOld: number = 30): Promise<number> {
    const threshold = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    const queriesCollection = database.get<OfflineQuery>('offline_queries');

    const oldQueries = await queriesCollection
      .query(Q.where('timestamp', Q.lt(threshold)))
      .fetch();

    if (oldQueries.length === 0) {
      console.log('ℹ️  Nenhuma query antiga para limpar');
      return 0;
    }

    await database.write(async () => {
      await Promise.all(oldQueries.map((q) => q.markAsDeleted()));
    });

    console.log(`🗑️  ${oldQueries.length} queries antigas (>${daysOld} dias) removidas`);
    return oldQueries.length;
  }

  /**
   * Exporta queries para análise (formato JSON)
   * 
   * @param limit - Número máximo de queries (padrão: 1000)
   * @returns JSON com queries
   */
  async exportQueries(limit: number = 1000): Promise<string> {
    const queriesCollection = database.get<OfflineQuery>('offline_queries');
    
    const queries = await queriesCollection
      .query(Q.take(limit))
      .fetch();

    const exported = queries.map((q) => ({
      id: q.id,
      query: q.query,
      response: q.response,
      timestamp: new Date(q.timestamp).toISOString(),
      status: q.status,
      priority: q.priority,
      retryCount: q.retryCount,
      responseSource: q.responseSource,
      conversationId: q.conversationId,
      createdAt: q.createdAt.toISOString(),
    }));

    return JSON.stringify(exported, null, 2);
  }
}

// ================================================================================
// SINGLETON EXPORT
// ================================================================================

export const offlineQueryQueue = new OfflineQueryQueue();
export default offlineQueryQueue;