import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Globe, Users, Zap, ArrowRight, Sparkles, Play } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenPrivacy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenPrivacy }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      </div>

      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto relative z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <MessageSquare size={22} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manachat<span className="text-indigo-600 dark:text-indigo-400">.ai</span></span>
        </div>
        <div className="flex items-center gap-8">
            <button onClick={onOpenPrivacy} className="hidden md:block text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</button>
            <button 
              onClick={onGetStarted} 
              className="text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Sign In
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-16 pb-32 flex flex-col items-center px-4 max-w-7xl mx-auto z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-full mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
             <Sparkles size={14} className="text-amber-500" />
             <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Next Gen Conversational AI</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Chat fluently in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 dark:from-indigo-400 dark:via-violet-400 dark:to-blue-400">
              Your Native Tongue.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
            Experience culturally aware intelligence. Manachat connects with you in Telugu, Hindi, and Tamil with native nuance and emotion.
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 dark:shadow-indigo-500/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:hidden" />
              <span className="relative z-10">Start Chatting Now</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Mock Interface Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-20 relative w-full max-w-4xl mx-auto"
        >
          {/* Glow behind mock */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] opacity-20 blur-2xl" />
          
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">
            {/* Mock Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 p-4 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="mx-auto font-medium text-xs text-slate-400 uppercase tracking-widest">Manachat Preview</div>
            </div>
            
            {/* Mock Chat Area */}
            <div className="p-6 md:p-10 bg-slate-50/50 dark:bg-slate-950/50 grid gap-6">
              {/* Msg 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex-shrink-0" />
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 max-w-sm">
                  <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">Namaskaram! Ela unnavu? Eeroju special enti?</p>
                </div>
              </div>
              
              {/* Msg 2 */}
              <div className="flex items-start gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-sm">
                  <p className="text-sm font-medium">Nenu bagunnanu! Watching a movie. Tollywood updates emaina unnaya?</p>
                </div>
              </div>

              {/* Msg 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex-shrink-0" />
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 max-w-sm">
                  <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">Thappakunda! Latest blockbuster gurinchi cheppana? 🔥</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left">
          <FeatureCard 
            icon={<Globe className="text-white" size={24} />}
            color="bg-blue-500"
            title="Regional Mastery"
            desc="Expert fluency in Telugu, Hindi, and Tamil with deep cultural context awareness."
          />
          <FeatureCard 
            icon={<Users className="text-white" size={24} />}
            color="bg-violet-500"
            title="Diverse Personas"
            desc="From friendly pals to professional experts, find the perfect companion for any mood."
          />
          <FeatureCard 
            icon={<Zap className="text-white" size={24} />}
            color="bg-amber-500"
            title="Instant & Private"
            desc="Powered by advanced low-latency models. No chat history is ever stored on servers."
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-8 border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Manachat Systems Operational
          </span>
          <div className="flex gap-6">
             <button onClick={onOpenPrivacy} className="text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</button>
             <span className="text-sm text-slate-400">© 2024 Manachat.ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, desc: string, color: string}> = ({ icon, title, desc, color }) => (
  <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);
