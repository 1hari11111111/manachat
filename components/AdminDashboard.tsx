import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Users, MessageSquare, Activity, Globe, 
  TrendingUp, Server, Edit3, Save, X, Search, 
  BarChart3, PieChart, Smartphone, Star, Upload
} from 'lucide-react';
import { BotPersona, Language } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
  personas: Record<Language, BotPersona[]>;
  onUpdatePersona: (persona: BotPersona, language: Language) => void;
}

type Tab = 'overview' | 'bots';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, personas, onUpdatePersona }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedLang, setSelectedLang] = useState<Language>('Telugu');
  const [editingBot, setEditingBot] = useState<BotPersona | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [editForm, setEditForm] = useState<Partial<BotPersona>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (bot: BotPersona) => {
    setEditingBot(bot);
    setEditForm(bot);
  };

  const handleSave = () => {
    if (!editingBot) return;

    const updatedBot = { ...editingBot, ...editForm } as BotPersona;
    onUpdatePersona(updatedBot, selectedLang);
    setEditingBot(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the form with the Base64 image string
        setEditForm({ ...editForm, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 font-sans text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Workspace</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Platform Management System</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('bots')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'bots' ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              Manage Chatbots
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <OverviewTab key="overview" />
          ) : (
            <ManageBotsTab 
              key="bots"
              selectedLang={selectedLang} 
              setSelectedLang={setSelectedLang}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onEdit={handleEditClick}
              personas={personas}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      {editingBot && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Persona</h3>
              <button onClick={() => setEditingBot(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden relative group bg-slate-100 dark:bg-slate-800">
                  <img src={editForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  {/* Upload Overlay on Image */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                  >
                    <Upload size={20} />
                    <span className="text-[10px] font-bold mt-1 uppercase">Upload</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Display Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Category</label>
                  <input 
                    type="text" 
                    value={editForm.category} 
                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Gender</label>
                   <select 
                    value={editForm.gender}
                    onChange={e => setEditForm({...editForm, gender: e.target.value as any})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                   >
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                   </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex justify-between items-center">
                  <span>Image Source</span>
                  {/* Explicit Upload Button */}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    <Upload size={10} /> Upload File
                  </button>
                </label>
                <input 
                  type="text" 
                  value={editForm.imageUrl} 
                  onChange={e => setEditForm({...editForm, imageUrl: e.target.value})}
                  placeholder="Enter URL or Upload Image"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-600 dark:text-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Description</label>
                <textarea 
                  rows={3}
                  value={editForm.description} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none dark:text-white"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-3 justify-end">
              <button 
                onClick={() => setEditingBot(null)}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const OverviewTab = () => {
  const keyStats = [
    { title: 'Total Users', value: '142,450', change: '+12.5%', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Sessions', value: '3,432', change: '+8.2%', icon: Activity, color: 'bg-emerald-500' },
    { title: 'Total Messages', value: '1.2M', change: '+24.1%', icon: MessageSquare, color: 'bg-indigo-500' },
    { title: 'Avg Session Time', value: '18m 42s', change: '-1.2%', icon: Smartphone, color: 'bg-amber-500' },
    { title: 'Retention Rate', value: '68%', change: '+3.4%', icon: PieChart, color: 'bg-rose-500' },
    { title: 'Feedback Score', value: '4.8/5', change: '+0.1', icon: Star, color: 'bg-purple-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {keyStats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2.5 rounded-lg ${stat.color} text-white shadow-sm`}>
                <stat.icon size={18} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart Mockup */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <TrendingUp size={20} className="text-slate-400" /> User Growth & Traffic
            </h3>
            <div className="flex gap-2">
              <select className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold px-3 py-1.5 text-slate-600 dark:text-slate-300">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
          </div>
          
          {/* CSS Bar Chart Mockup */}
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
              <div key={i} className="w-full bg-slate-50 dark:bg-slate-700 rounded-t-lg relative group">
                 <div 
                  className="absolute bottom-0 left-0 right-0 bg-indigo-500 dark:bg-indigo-600 rounded-t-lg transition-all group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500"
                  style={{ height: `${h}%` }}
                 ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 px-2">
            <span>Jan 1</span>
            <span>Jan 15</span>
            <span>Jan 30</span>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <Server size={20} className="text-slate-400" /> System Status
          </h3>
          
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600 dark:text-slate-400">API Latency</span>
                <span className="text-green-600 dark:text-green-400">42ms</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[15%] bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600 dark:text-slate-400">Database Load</span>
                <span className="text-amber-600 dark:text-amber-400">64%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[64%] bg-amber-500 rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600 dark:text-slate-400">Memory Usage</span>
                <span className="text-indigo-600 dark:text-indigo-400">28%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[28%] bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
               <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-xl flex items-start gap-3">
                 <div className="p-1 bg-green-100 dark:bg-green-900/50 rounded-full text-green-600 dark:text-green-400 mt-0.5">
                   <Activity size={14} />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-green-800 dark:text-green-300">All Systems Operational</h4>
                   <p className="text-xs text-green-600 dark:text-green-400 mt-1">No incidents reported in the last 24h.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ManageBotsTabProps {
  selectedLang: Language;
  setSelectedLang: (lang: Language) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onEdit: (bot: BotPersona) => void;
  personas: Record<Language, BotPersona[]>;
}

const ManageBotsTab: React.FC<ManageBotsTabProps> = ({
  selectedLang,
  setSelectedLang,
  searchQuery,
  setSearchQuery,
  onEdit,
  personas
}) => {
  // Ensure we have a valid array, default to empty if undefined
  const botsForLang = personas[selectedLang] || [];
  
  const filteredBots = botsForLang.filter(bot => 
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {(['Telugu', 'Hindi', 'Tamil', 'English'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                selectedLang === lang 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search personas..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBots.map(bot => (
          <div key={bot.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                <img src={bot.imageUrl} alt={bot.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <h3 className="font-bold text-slate-900 dark:text-white truncate">{bot.name}</h3>
                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${bot.gender === 'Male' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'}`}>
                     {bot.gender}
                   </span>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{bot.category}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{bot.description}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-end">
               <button 
                 onClick={() => onEdit(bot)}
                 className="text-xs font-bold flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
               >
                 <Edit3 size={14} /> Edit Persona
               </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};