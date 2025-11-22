import React, { useState, useEffect, useMemo } from 'react';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { BotGrid } from './components/BotGrid';
import { ChatWindow } from './components/ChatWindow';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyModal } from './components/PrivacyModal';
import { UserProfile, BotPersona, Language, Gender, ChatMessage } from './types';
import { Storage } from './utils/storage';

type View = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'chat' | 'admin';

// Type for user-specific customizations
type BotOverrides = Record<string, Partial<BotPersona>>;
type ChatHistory = Record<string, ChatMessage[]>;

const ADMIN_EMAIL = 'admin@manachat.ai';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  
  // Load initial state from storage
  const [user, setUser] = useState<UserProfile | null>(Storage.loadUser());
  const [basePersonas, setBasePersonas] = useState(Storage.loadBasePersonas());
  const [chatHistory, setChatHistory] = useState<ChatHistory>(Storage.loadHistory());
  const [botOverrides, setBotOverrides] = useState<BotOverrides>(Storage.loadBotOverrides());
  
  // Settings
  const initialSettings = Storage.loadSettings();
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Theme handled via class, simple toggle state
  const [soundEnabled, setSoundEnabled] = useState(initialSettings.sound);
  const [notificationsEnabled, setNotificationsEnabled] = useState(initialSettings.notifications);

  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);

  // --- Effects for Persistence ---

  // Initialize View based on User existence
  useEffect(() => {
    if (user) {
      setView('dashboard');
    }
  }, []); // Run once on mount

  // Persist User
  useEffect(() => {
    if (user) Storage.saveUser(user);
  }, [user]);

  // Persist History
  useEffect(() => {
    Storage.saveHistory(chatHistory);
  }, [chatHistory]);

  // Persist Overrides
  useEffect(() => {
    Storage.saveBotOverrides(botOverrides);
  }, [botOverrides]);

  // Persist Admin Changes to Personas
  useEffect(() => {
    Storage.saveBasePersonas(basePersonas);
  }, [basePersonas]);

  // Persist Settings
  useEffect(() => {
    Storage.saveSettings({ sound: soundEnabled, notifications: notificationsEnabled });
  }, [soundEnabled, notificationsEnabled]);

  // Apply Dark Mode Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);


  // --- Computed Data ---
  const activePersonas = useMemo(() => {
    const merged: Record<Language, BotPersona[]> = { ...basePersonas };
    
    (['Telugu', 'Hindi', 'Tamil', 'English'] as Language[]).forEach(lang => {
      merged[lang] = basePersonas[lang].map(bot => {
        const override = botOverrides[bot.id];
        if (override) {
          return { ...bot, ...override };
        }
        return bot;
      });
    });
    return merged;
  }, [basePersonas, botOverrides]);

  const currentPersona = useMemo(() => {
    if (!currentPersonaId || !user) return null;
    return activePersonas[user.language].find(p => p.id === currentPersonaId) || null;
  }, [currentPersonaId, activePersonas, user]);


  // --- Handlers ---

  const startExperience = () => {
    if (user) {
      setView('dashboard');
    } else {
      setView('auth');
    }
  };

  const handleAuthComplete = (name: string, email: string, isLogin: boolean) => {
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL;
    
    const newUser: UserProfile = {
      name,
      email,
      gender: 'Male', // Default, will be set in onboarding if new
      language: 'Telugu', // Default
      isAdmin
    };

    if (isLogin) {
      if (!user) {
         setUser(newUser);
         setUser(prev => ({...prev!, name, email, isAdmin})); 
      }
      setView('dashboard');
    } else {
      // Signup
      setUser(newUser);
      setView('onboarding');
    }
  };
  
  const completeOnboarding = (gender: Gender, language: Language) => {
    if (user) {
      setUser({ ...user, gender, language });
      setView('dashboard');
    }
  };
  
  const handleSignOut = () => {
    Storage.clearUser();
    setUser(null);
    setView('landing');
  };

  const selectPersona = (persona: BotPersona) => {
    setCurrentPersonaId(persona.id);
    setView('chat');
  };

  const backToDashboard = () => {
    setView('dashboard');
    setCurrentPersonaId(null);
  };

  // Admin Update
  const handleUpdateBasePersona = (updatedBot: BotPersona, language: Language) => {
    setBasePersonas(prev => ({
      ...prev,
      [language]: prev[language].map(b => b.id === updatedBot.id ? updatedBot : b)
    }));
  };

  // User Profile Update
  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    if (user) setUser({ ...user, ...updates });
  };

  // History & Customization
  const handleUpdateHistory = (botId: string, messages: ChatMessage[]) => {
    setChatHistory(prev => ({ ...prev, [botId]: messages }));
  };

  const handleClearChat = (botId: string) => {
    setChatHistory(prev => {
      const newState = { ...prev };
      delete newState[botId];
      return newState;
    });
  };

  const handleCustomizeBot = (botId: string, updates: Partial<BotPersona>) => {
    setBotOverrides(prev => ({
      ...prev,
      [botId]: { ...prev[botId], ...updates }
    }));
  };

  return (
    <div className={`font-sans min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar available if user is logged in */}
      {user && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          user={user}
          onUpdateUser={handleUpdateUser}
          onNavigateToAdmin={() => setView('admin')}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
          onOpenPrivacy={() => {
            setSidebarOpen(false);
            setPrivacyOpen(true);
          }}
          onSignOut={handleSignOut}
        />
      )}

      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setPrivacyOpen(false)} />

      {view === 'landing' && (
        <LandingPage 
          onGetStarted={startExperience} 
          onOpenPrivacy={() => setPrivacyOpen(true)}
        />
      )}

      {view === 'auth' && (
        <Auth 
          onComplete={handleAuthComplete} 
          onBack={() => setView('landing')} 
        />
      )}
      
      {view === 'onboarding' && user && (
        <Onboarding 
          onComplete={completeOnboarding} 
          onBack={handleSignOut} // Back from onboarding = cancel signup
        />
      )}
      
      {view === 'dashboard' && user && (
        <BotGrid 
          personas={activePersonas[user.language]} 
          onSelect={selectPersona} 
          user={user}
          onBack={() => setView('onboarding')} // Allow going back to change prefs
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      )}
      
      {view === 'chat' && currentPersona && user && (
        <ChatWindow 
          persona={currentPersona} 
          user={user} 
          chatHistory={chatHistory[currentPersona.id] || []}
          onUpdateHistory={handleUpdateHistory}
          onClearChat={handleClearChat}
          onCustomizeBot={handleCustomizeBot}
          onBack={backToDashboard}
          soundEnabled={soundEnabled}
        />
      )}

      {view === 'admin' && user?.isAdmin && (
        <AdminDashboard 
          onBack={backToDashboard} 
          personas={basePersonas}
          onUpdatePersona={handleUpdateBasePersona}
        />
      )}
    </div>
  );
};

export default App;