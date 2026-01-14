export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  time: string;
  messages: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}