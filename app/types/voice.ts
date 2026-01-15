
export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
}

export interface VoiceSettings {
  language: string;
  sensitivity: number;
  autoStop: boolean;
}