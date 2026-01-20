import { Q } from '@nozbe/watermelondb';
import database from '../database';
import Embedding from '../database/models/Embedding';

type EmbeddingVector = number[];

interface EmbeddingRecord {
  id: string;
  vector: EmbeddingVector;
  content?: string;
  source?: string;
  chapter?: string;
  metadata?: Record<string, any>;
}

interface SearchOptions {
  topK?: number;
  minScore?: number;
  filter?: { source?: string; chapter?: string };
}

interface LocalSearchResult {
  id: string;
  score: number;
  content?: string;
  source?: string;
  chapter?: string;
  metadata?: Record<string, any>;
}

class LocalVectorSearch {
  private expectedDimensions = 384;

  validateDimensions(embedding: EmbeddingVector): boolean {
    return (
      Array.isArray(embedding) && embedding.length === this.expectedDimensions
    );
  }

  /**
   * Carrega embeddings do banco de dados
   */
  private async loadEmbeddingsFromDB(
    filter?: { source?: string; chapter?: string }
  ): Promise<EmbeddingRecord[]> {
    try {
      const embeddingsCollection = database.get<Embedding>('embeddings');
      
      // Criar array de condições
      const conditions: any[] = [];

      // Aplicar filtros usando Q.where
      if (filter?.source) {
        conditions.push(Q.where('source', filter.source));
      }
      if (filter?.chapter) {
        conditions.push(Q.where('chapter', filter.chapter));
      }

      // Executar query
      const records = await embeddingsCollection
        .query(...conditions)
        .fetch();

      return records.map((r) => ({
        id: r.id,
        vector: r.vectorArray,
        content: r.content,
        source: r.source,
        chapter: r.chapter,
        metadata: r.metadataObject,
      }));
    } catch (error) {
      console.error('Error loading embeddings from DB:', error);
      return [];
    }
  }

  async getEmbeddingCount(): Promise<number> {
    try {
      const embeddingsCollection = database.get<Embedding>('embeddings');
      return await embeddingsCollection.query().fetchCount();
    } catch (error) {
      console.error('Error getting embedding count:', error);
      return 0;
    }
  }

  async search(
    queryEmbedding: EmbeddingVector,
    options: SearchOptions = {}
  ): Promise<LocalSearchResult[]> {
    const topK = options.topK ?? 10;
    const minScore = options.minScore ?? 0;

    // Carrega embeddings do banco com filtros
    const embeddings = await this.loadEmbeddingsFromDB(options.filter);

    if (embeddings.length === 0) {
      console.warn('⚠️  No embeddings found in database');
      return [];
    }

    // Calcula similaridade
    const results = embeddings
      .map((rec) => {
        const score = this.cosineSimilarity(queryEmbedding, rec.vector);
        return {
          id: rec.id,
          score,
          content: rec.content,
          source: rec.source,
          chapter: rec.chapter,
          metadata: rec.metadata,
        };
      })
      .filter((r) => r.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  }

  private cosineSimilarity(a: EmbeddingVector, b: EmbeddingVector): number {
    const n = a.length;
    if (n !== b.length || n === 0) return 0;
    let dot = 0;
    let magA = 0;
    let magB = 0;
    for (let i = 0; i < n; i++) {
      const ai = a[i];
      const bi = b[i];
      dot += ai * bi;
      magA += ai * ai;
      magB += bi * bi;
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }
}

export const localVectorSearch = new LocalVectorSearch();
export default localVectorSearch;