export type Language = 'Telugu' | 'Hindi' | 'Tamil' | 'English';
export type Gender = 'Male' | 'Female';

export interface UserProfile {
  name: string;
  email: string;
  gender: Gender;
  language: Language;
  isAdmin?: boolean; // Added for RBAC
}

export interface BotPersona {
  id: string;
  name: string;
  category: string;
  description: string;
  systemInstruction: string;
  initialMessage: string;
  icon: string; 
  gradient: string;
  gender: 'Male' | 'Female';
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}