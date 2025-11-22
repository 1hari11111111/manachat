import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ArrowLeft, User, Users, Globe2 } from 'lucide-react';
import { Gender, Language } from '../types';

interface OnboardingProps {
  onComplete: (gender: Gender, language: Language) => void;
  onBack: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [gender, setGender] = useState<Gender | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);

  const handleNext = () => {
    if (step === 1 && gender) {
      setStep(2);
    } else if (step === 2 && language && gender) {
      onComplete(gender, language);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 relative transition-colors duration-300">
       {/* Back Button */}
       <div className="absolute top-8 left-8">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-sm bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="w-full max-w-4xl">
        {/* Steps Indicator */}
        <div className="flex justify-center mb-16 gap-3">
          <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'}`} />
          <div className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-6 text-indigo-600 dark:text-indigo-400">
                <Users size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Select Your Profile</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-12 text-base max-w-md mx-auto leading-relaxed">
                We curate chatbots based on your profile to ensure the most engaging conversations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-xl mx-auto">
                {(['Male', 'Female'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`group relative p-8 rounded-2xl border transition-all duration-200 text-left flex flex-col items-start h-full ${
                      gender === g 
                        ? 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-800 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 ring-1 ring-indigo-600 dark:ring-indigo-500' 
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex w-full justify-between items-start mb-6">
                      <div className={`p-4 rounded-xl ${gender === g ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        <User size={28} />
                      </div>
                      {gender === g && (
                        <CheckCircle2 className="text-indigo-600 dark:text-indigo-400" size={24} />
                      )}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${gender === g ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{g}</h3>
                    <p className="text-sm text-slate-400 font-medium">
                      {g === 'Male' ? 'Interact with female personas' : 'Interact with male personas'}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div
             key="step2"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="text-center"
           >
             <div className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-6 text-indigo-600 dark:text-indigo-400">
                <Globe2 size={32} strokeWidth={1.5} />
              </div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Preferred Language</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-12 text-base max-w-md mx-auto leading-relaxed">
               Choose the language you're most comfortable chatting in.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
               {(['Telugu', 'Hindi', 'Tamil', 'English'] as Language[]).map((l) => (
                 <button
                   key={l}
                   onClick={() => setLanguage(l)}
                   className={`group relative p-6 rounded-2xl border transition-all duration-200 text-left flex flex-col items-start h-full ${
                     language === l 
                       ? 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-800 shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 ring-1 ring-indigo-600 dark:ring-indigo-500' 
                       : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                   }`}
                 >
                   <div className="flex w-full justify-between items-start mb-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                       language === l ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                     }`}>
                       {l.charAt(0)}
                     </div>
                     {language === l && (
                       <CheckCircle2 className="text-indigo-600 dark:text-indigo-400" size={22} />
                     )}
                   </div>
                   <h3 className={`text-lg font-bold mb-1 ${language === l ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{l}</h3>
                   <div className="flex items-center gap-2 mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                      {l === 'Hindi' ? 'Devanagari' : 'English Script'}
                    </span>
                   </div>
                 </button>
               ))}
             </div>
           </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 flex justify-center">
          <button
            onClick={handleNext}
            disabled={step === 1 ? !gender : !language}
            className="px-8 py-3.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-slate-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all flex items-center gap-2 hover:-translate-y-0.5"
          >
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};