import { UserProfile, ChatMessage, BotPersona, Language } from '../types';
import { PERSONAS } from '../data/personas';

const KEYS = {
  USER: 'lingochat_user',
  CHAT_HISTORY: 'lingochat_history',
  BOT_OVERRIDES: 'lingochat_bot_overrides',
  BASE_PERSONAS: 'lingochat_base_personas',
  THEME: 'lingochat_theme',
  SETTINGS: 'lingochat_settings'
};

export const Storage = {
  // User
  saveUser: (user: UserProfile) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  loadUser: (): UserProfile | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  clearUser: () => localStorage.removeItem(KEYS.USER),

  // Chat History
  saveHistory: (history: Record<string, ChatMessage[]>) => 
    localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(history)),
  loadHistory: (): Record<string, ChatMessage[]> => {
    const data = localStorage.getItem(KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : {};
  },

  // Bot Overrides (User Customizations)
  saveBotOverrides: (overrides: Record<string, Partial<BotPersona>>) => 
    localStorage.setItem(KEYS.BOT_OVERRIDES, JSON.stringify(overrides)),
  loadBotOverrides: (): Record<string, Partial<BotPersona>> => {
    const data = localStorage.getItem(KEYS.BOT_OVERRIDES);
    return data ? JSON.parse(data) : {};
  },

  // Base Personas (Admin Edits)
  saveBasePersonas: (personas: Record<Language, BotPersona[]>) => 
    localStorage.setItem(KEYS.BASE_PERSONAS, JSON.stringify(personas)),
  loadBasePersonas: (): Record<Language, BotPersona[]> => {
    const data = localStorage.getItem(KEYS.BASE_PERSONAS);
    // If no saved personas, return the default static list
    return data ? JSON.parse(data) : PERSONAS;
  },

  // Settings
  saveSettings: (settings: any) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings)),
  loadSettings: () => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { sound: true, notifications: true };
  },
  
  clearAll: () => localStorage.clear() // For debugging
};