import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, json } from '@nozbe/watermelondb/decorators';

export default class Embedding extends Model {
  static table = 'embeddings';

  @field('vector') vector!: string; // JSON stringified array
  @field('content') content!: string;
  @field('source') source?: string;
  @field('chapter') chapter?: string;
  @field('page') page?: number;
  @field('metadata') metadata?: string; // JSON stringified object



  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Helper para pegar vector como array
  get vectorArray(): number[] {
    try {
      return JSON.parse(this.vector);
    } catch {
      return [];
    }
  }

  // Helper para pegar metadata como objeto
  get metadataObject(): Record<string, any> {
    if (!this.metadata) return {};
    try {
      return JSON.parse(this.metadata);
    } catch {
      return {};
    }
  }
}