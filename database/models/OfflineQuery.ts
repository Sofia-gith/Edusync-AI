// database/models/OfflineQuery.ts
import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

export type QueryStatus = 'pending' | 'synced' | 'failed';
export type QueryPriority = 'low' | 'normal' | 'high';

export default class OfflineQuery extends Model {
  static table = 'offline_queries';

  @field('query') query!: string;
  @field('response') response!: string;
  @field('timestamp') timestamp!: number;
  @field('status') status!: QueryStatus;
  @field('priority') priority!: QueryPriority;
  @field('retry_count') retryCount!: number;
  @field('error_message') errorMessage?: string;
  @field('response_source') responseSource!: string;
  @field('conversation_id') conversationId?: string;
  @field('device_id') deviceId!: string;
  @field('app_version') appVersion!: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}