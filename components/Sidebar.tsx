import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, LogOut, ShieldCheck, ChevronRight, ArrowLeft, Moon, Sun, Bell, Volume2, Lock, Mail, Shield, Edit2, Check } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onNavigateToAdmin: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onOpenPrivacy: () => void;
  onSignOut: () => void;
}

type SidebarView = 'menu' | 'profile' | 'settings';

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onClose, user, onUpdateUser, onNavigateToAdmin, 
  theme, onToggleTheme,
  soundEnabled, onToggleSound,
  notificationsEnabled, onToggleNotifications,
  onOpenPrivacy,
  onSignOut
}) => {
  const [view, setView] = useState<SidebarView>('menu');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editLang, setEditLang] = useState<Language>(user.language);

  const handleClose = () => {
    setView('menu');
    setIsEditing(false);
    onClose();
  };

  const handleSaveProfile = () => {
    onUpdateUser({ name: editName, language: editLang });
    setIsEditing(false);
  };

  const SubViewHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
      <button 
        onClick={onBack}
        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
      >
        <ArrowLeft size={20} />
      </button>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col overflow-hidden border-l border-slate-200 dark:border-slate-800"
          >
            <AnimatePresence mode="wait">
              {view === 'menu' && (
                <motion.div 
                  key="menu"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="flex flex-col h-full w-full"
                >
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Menu</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-6 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                       <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium capitalize">{user.gender} • {user.language}</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <button onClick={() => { setEditName(user.name); setEditLang(user.language); setView('profile'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium group">
                      <div className="flex items-center gap-3"><User size={18} /> Profile</div>
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
                    </button>
                    <button onClick={() => setView('settings')} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium group">
                      <div className="flex items-center gap-3"><Settings size={18} /> Settings</div>
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
                    </button>
                    <button onClick={onOpenPrivacy} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium group">
                      <div className="flex items-center gap-3"><Shield size={18} /> Privacy & Policy</div>
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
                    </button>
                    {user.isAdmin && (
                      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="px-4 pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Admin Zone</p>
                        <button onClick={() => { onNavigateToAdmin(); handleClose(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors text-sm font-bold">
                          <ShieldCheck size={18} /> Admin Dashboard
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <button onClick={onSignOut} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/30 transition-colors text-sm font-semibold">
                      <LogOut size={18} /> Sign Out
                    </button>
                    <div className="mt-4 text-center space-y-1">
                      <p className="text-[10px] text-slate-400 dark:text-slate-600">© 2024 Manachat.ai</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-600">Chats synced to device.</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Use existing Profile/Settings subviews (just re-render them) */}
              {view === 'profile' && (
                <motion.div key="profile" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="flex flex-col h-full w-full bg-white dark:bg-slate-900">
                  <SubViewHeader title="My Profile" onBack={() => setView('menu')} />
                  <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="flex flex-col items-center mb-6">
                       <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-lg mb-4">{user.name.charAt(0)}</div>
                       {!isEditing ? (
                         <>
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
                           <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2 flex items-center gap-1 transition-colors"><Edit2 size={12} /> Edit Profile</button>
                         </>
                       ) : (
                         <button onClick={handleSaveProfile} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full text-xs font-bold text-green-600 dark:text-green-400 mt-2 flex items-center gap-1 transition-colors"><Check size={12} /> Save Changes</button>
                       )}
                    </div>
                    <div className="space-y-4">
                       <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>{isEditing ? <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" /> : <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300"><User size={18} className="text-slate-400" /><span className="text-sm font-medium">{user.name}</span></div>}</div>
                       <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase ml-1">Preferred Language</label>{isEditing ? <select value={editLang} onChange={(e) => setEditLang(e.target.value as Language)} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"><option value="Telugu">Telugu</option><option value="Hindi">Hindi</option><option value="Tamil">Tamil</option></select> : <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300"><div className="w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{user.language.charAt(0)}</div><span className="text-sm font-medium">{user.language}</span></div>}</div>
                       <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label><div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 opacity-70"><Mail size={18} className="text-slate-400" /><span className="text-sm font-medium">{user.email}</span><span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">Locked</span></div></div>
                    </div>
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800"><button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"><div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-400"><div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900 transition-colors"><Lock size={18} /></div><div className="text-left"><p className="text-sm font-bold">Change Password</p><p className="text-xs text-slate-400 group-hover:text-indigo-400">Update your security</p></div></div><ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400" /></button></div>
                  </div>
                </motion.div>
              )}
              
              {view === 'settings' && (
                 <motion.div key="settings" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="flex flex-col h-full w-full bg-white dark:bg-slate-900">
                 <SubViewHeader title="Settings" onBack={() => setView('menu')} />
                 <div className="p-6 space-y-8">
                    <section className="space-y-3"><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</h4><div className="flex items-center justify-between p-1"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}</div><div><p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p><p className="text-xs text-slate-500 dark:text-slate-400">Adjust the interface theme</p></div></div><button onClick={onToggleTheme} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}><div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} /></button></div></section>
                    <section className="space-y-4"><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Essentials</h4><div className="flex items-center justify-between p-1"><div className="flex items-center gap-3"><div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"><Bell size={18} /></div><div><p className="text-sm font-bold text-slate-900 dark:text-white">Notifications</p><p className="text-xs text-slate-500 dark:text-slate-400">Get updates about new bots</p></div></div><button onClick={onToggleNotifications} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}><div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} /></button></div><div className="flex items-center justify-between p-1"><div className="flex items-center gap-3"><div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"><Volume2 size={18} /></div><div><p className="text-sm font-bold text-slate-900 dark:text-white">Sound Effects</p><p className="text-xs text-slate-500 dark:text-slate-400">Play sounds on messages</p></div></div><button onClick={onToggleSound} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${soundEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}><div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} /></button></div></section>
                 </div>
               </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};