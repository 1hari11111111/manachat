import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BotPersona, UserProfile } from '../types';
import * as Icons from 'lucide-react';

interface BotGridProps {
  personas: BotPersona[];
  onSelect: (persona: BotPersona) => void;
  user: UserProfile;
  onBack: () => void;
  onOpenSidebar: () => void;
}

export const BotGrid: React.FC<BotGridProps> = ({ personas, onSelect, user, onBack, onOpenSidebar }) => {
  
  const filteredPersonas = useMemo(() => {
    if (user.gender === 'Male') return personas.filter(p => p.gender === 'Female');
    if (user.gender === 'Female') return personas.filter(p => p.gender === 'Male');
    return personas;
  }, [personas, user.gender]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto mb-8 pt-4 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-sm bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <Icons.ArrowLeft size={16} />
          <span>Back to Preferences</span>
        </button>
        
        <button 
          onClick={onOpenSidebar}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-sm bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
        >
          <Icons.Menu size={18} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Choose a Companion</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-xl">
              Select a persona to start chatting instantly. Showing {filteredPersonas.length} profiles.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
               {user.gender} User
             </div>
             <div className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
               {user.language}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPersonas.map((persona, index) => {
            const IconComponent = (Icons as any)[persona.icon] || Icons.MessageCircle;
            
            return (
              <motion.button
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(persona)}
                className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 overflow-hidden text-left transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col relative"
              >
                {/* Image Area */}
                <div className="h-64 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img 
                    src={persona.imageUrl} 
                    alt={persona.name} 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-4 left-4 text-white pr-4">
                    <h3 className="text-2xl font-bold drop-shadow-md leading-tight mb-1">{persona.name}</h3>
                    <span className="text-white/90 text-sm font-medium inline-flex items-center gap-1.5">
                       <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span> 
                       Online
                    </span>
                  </div>

                  <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg`}>
                     <IconComponent size={14} strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">{persona.category}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-2 mb-5">
                    {persona.description}
                  </p>
                  
                  <div className="mt-auto w-full py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-center font-semibold text-slate-900 dark:text-white text-sm group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                    Start Chat <Icons.ArrowRight size={14} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};