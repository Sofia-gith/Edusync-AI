export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  schoolName: string;
  schoolType: 'rural' | 'urban';
  grades: string[];
  language: string;
}

export interface UserStats {
  totalClasses: number;
  totalStudents: number;
  totalConsultations: number;
}

export interface UserPreferences {
  language: string;
  voiceEnabled: boolean;
  dailyTipsEnabled: boolean;
  notificationsEnabled: boolean;
}