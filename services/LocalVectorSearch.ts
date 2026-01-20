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
  private embeddings: EmbeddingRecord[] = [];
  private expectedDimensions = 384;

  validateDimensions(embedding: EmbeddingVector): boolean {
    return (
      Array.isArray(embedding) && embedding.length === this.expectedDimensions
    );
  }

  async preloadEmbeddings(records: EmbeddingRecord[]): Promise<void> {
    this.embeddings = records.slice();
  }

  async getEmbeddingCount(): Promise<number> {
    return this.embeddings.length;
  }

  async search(
    queryEmbedding: EmbeddingVector,
    options: SearchOptions = {},
  ): Promise<LocalSearchResult[]> {
    const topK = options.topK ?? 10;
    const minScore = options.minScore ?? 0;
    const filtered = this.applyFilter(this.embeddings, options.filter);
    const results = filtered
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

  private applyFilter(
    records: EmbeddingRecord[],
    filter?: { source?: string; chapter?: string },
  ) {
    if (!filter) return records;
    return records.filter((r) => {
      if (filter.source && r.source !== filter.source) return false;
      if (filter.chapter && r.chapter !== filter.chapter) return false;
      return true;
    });
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
