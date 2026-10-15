export type Priority = 'low' | 'medium' | 'high';
export type Page = 'dashboard' | 'chat' | 'voice' | 'tasks' | 'habits' | 'reminders' | 'gita' | 'settings';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priority: Priority;
  done: boolean;
  category?: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  done: boolean;
}

export interface Habit {
  id: string;
  name: string;
  doneDates: string[]; // YYYY-MM-DD
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

export interface Settings {
  name: string;
  greeting: string;
  language: 'tamil-english' | 'english';
  morningTime: string;
  eveningTime: string;
  voiceProfile: 'normal' | 'gita';
  speakReplies: boolean;
  notifications: boolean;
  collegeDays: number[]; // 0=Sun..6=Sat
  goals: string[];
}
