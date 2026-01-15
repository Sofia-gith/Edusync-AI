export type ResourceCategory = 'math' | 'reading' | 'classroom' | 'behavior' | 'all';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  icon: string;
  downloadUrl?: string;
  isDownloaded: boolean;
  fileSize?: number;
}

export interface ResourceFilter {
  category: ResourceCategory;
  searchQuery?: string;
}