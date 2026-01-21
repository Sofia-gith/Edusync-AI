// database/schema/index.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    // Tabela de embeddings (vetores para busca)
    tableSchema({
      name: 'embeddings',
      columns: [
        { name: 'vector', type: 'string' }, // JSON.stringify(number[])
        { name: 'content', type: 'string' },
        { name: 'source', type: 'string', isOptional: true },
        { name: 'chapter', type: 'string', isOptional: true },
        { name: 'page', type: 'number', isOptional: true },
        { name: 'metadata', type: 'string', isOptional: true }, // JSON
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Tabela de metadados de sincronização
    tableSchema({
      name: 'sync_metadata',
      columns: [
        { name: 'key', type: 'string', isIndexed: true },
        { name: 'value', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'last_synced', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    // Tabela de queries offline (para analytics)
    tableSchema({
      name: 'offline_queries',
      columns: [
        { name: 'query', type: 'string' },
        { name: 'response', type: 'string' },
        { name: 'timestamp', type: 'number', isIndexed: true },
        { name: 'status', type: 'string', isIndexed: true }, // pending, synced, failed
        { name: 'priority', type: 'string' },
        { name: 'retry_count', type: 'number' },
        { name: 'error_message', type: 'string', isOptional: true },
        { name: 'response_source', type: 'string' }, // local, cache, fallback
        { name: 'conversation_id', type: 'string', isOptional: true },
        { name: 'device_id', type: 'string' },
        { name: 'app_version', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});