import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Database, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[70] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <Shield size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Privacy & Security</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-600 dark:text-slate-300">
              
              {/* Critical Disclaimer */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2">
                  <Database size={20} /> Data Storage Policy
                </h3>
                <p className="text-indigo-800 dark:text-indigo-200 text-sm leading-relaxed">
                  <strong>Your chats are NOT stored on our servers.</strong> All conversations happen in real-time and are ephemeral. Once you close the tab or refresh the page, your chat history is wiped from memory. We prioritize your privacy above all else.
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock size={20} /> Data Protection
                </h3>
                <p className="text-sm leading-relaxed">
                  We utilize secure, encrypted connections for all AI interactions. Your inputs are sent directly to our advanced AI processing engine and are not retained by Manachat.ai for training purposes.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Accounts</h3>
                <p className="text-sm leading-relaxed">
                  Any profile information (Name, Gender, Language preference) is stored locally in your browser's session state to customize the experience. We do not sell, trade, or transfer your personal information to outside parties.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Copyrights</h3>
                <p className="text-sm leading-relaxed">
                  © 2024 Manachat.ai. All visual assets, persona designs, and code are the intellectual property of Manachat.ai. Avatar images are sourced from Unsplash under valid licenses.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-center">
              <button 
                onClick={onClose}
                className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};