import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import Embedding from './models/Embedding';
import SyncMetadata from './models/SyncMetadata';
import OfflineQuery from './models/OfflineQuery';

// Configuração do adapter SQLite
const adapter = new SQLiteAdapter({
  schema,
  // Nome do arquivo do banco de dados
  dbName: 'edusync',
  // Migrações (se necessário no futuro)
  // migrations,
  // JSI (JavaScript Interface) para melhor performance
  jsi: true,
  // Callbacks opcionais
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

// Criar instância do banco
const database = new Database({
  adapter,
  modelClasses: [
    Embedding,
    SyncMetadata,
    OfflineQuery,
  ],
});

export default database;