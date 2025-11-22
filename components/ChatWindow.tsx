import React, { useState, useEffect, useRef } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { ArrowLeft, Send, RefreshCw, User, MoreVertical, Trash2, Edit3, Upload, X, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { BotPersona, ChatMessage, UserProfile } from '../types';
import { createChatSession } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  persona: BotPersona;
  user: UserProfile;
  chatHistory: ChatMessage[];
  onUpdateHistory: (botId: string, messages: ChatMessage[]) => void;
  onClearChat: (botId: string) => void;
  onCustomizeBot: (botId: string, updates: Partial<BotPersona>) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

// Embed sounds directly to avoid network issues
const SND_SENT_B64 = "data:audio/mpeg;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyVFhYWAAAABAAAANlbmNvZGVyAExhdmY1OC4yMAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJInfoAAAAPAAAAAwAABgAAgIAAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAD/80DEAAAAA0gAAAAHP/7kGQAAAFMGI35SAAgAAA0goAABF2WDBaYgAAAAADSDAAAACAZgKAQWAGAD/5z+H/wH8B/5//+H//4D/wH/4ACAAmC9wH/5z+H/wH8B/5//+H//4D/wH/4ACAD/80LEAAAAA0gAAAAH//uQZAAABg1gwdmIAAAAAA0gwAAAAF42DBaYgAAAAADSDAAAACAf///8B//8AB//zQsQAAAADSAAAAAf/+5BkAAAGDWDCAYgAAAAADSDAAAAXjYMIhiAAAAANIMAAAAIB////wH//wAH//NCxAAAAANIAAAAB//7kGQAAAYNYMJhiAAAAANIMAAAABeNgwmGIAAAAA0gwAAAAgH///+A///AAf/80LEAAAAA0gAAAAH//uQZAAABg1gwmGIAAAAA0gwAAAAF42DCYYgAAAAADSDAAAACAf///4D//8AB//zQsQAAAADSAAAAAf/+5BkAAAGDWDCAYgAAAAADSDAAAAXjYMIhiAAAAANIMAAAAIB////wH//wAH//NCxAAAAANIAAAAB//7kGQAAAYNYMFpiAAAAANIMAAAABeNgwWmIAAAAA0gwAAAAgH///+A///AA";
const SND_RCVD_B64 = "data:audio/mpeg;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyVFhYWAAAABAAAANlbmNvZGVyAExhdmY1OC4yMAAAAAAAAAAAAAAA//uQZAAAAAAAABAAAAAAAAAAAAAAJInfoAAAAPAAAAAwAABgAAgIAAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAD/80DEAAAAA0gAAAAHP/7kGQAAAFMGI35SAAgAAA0goAABF2WDBaYgAAAAADSDAAAACAZgKAQWAGAD/5z+H/wH8B/5//+H//4D/wH/4ACAAmC9wH/5z+H/wH8B/5//+H//4D/wH/4ACAD/80LEAAAAA0gAAAAH//uQZAAABg1gwdmIAAAAAA0gwAAAAF42DBaYgAAAAADSDAAAACAf///8B//8AB//zQsQAAAADSAAAAAf/+5BkAAAGDWDCAYgAAAAADSDAAAAXjYMIhiAAAAANIMAAAAIB////wH//wAH//NCxAAAAANIAAAAB//7kGQAAAYNYMJhiAAAAANIMAAAABeNgwmGIAAAAA0gwAAAAgH///+A///AAf/80LEAAAAA0gAAAAH//uQZAAABg1gwmGIAAAAA0gwAAAAF42DCYYgAAAAADSDAAAACAf///4D//8AB//zQsQAAAADSAAAAAf/+5BkAAAGDWDCAYgAAAAADSDAAAAXjYMIhiAAAAANIMAAAAIB////wH//wAH//NCxAAAAANIAAAAB//7kGQAAAYNYMFpiAAAAANIMAAAABeNgwWmIAAAAA0gwAAAAgH///+A///AA";

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  persona, user, chatHistory, onUpdateHistory, onClearChat, onCustomizeBot, onBack, soundEnabled 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (chatHistory.length > 0) return chatHistory;
    return [{
      id: 'init',
      role: 'model',
      text: persona.initialMessage,
      timestamp: new Date()
    }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(persona.name);
  const [editImage, setEditImage] = useState(persona.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio refs with Base64 sources
  const sendAudio = useRef(new Audio(SND_SENT_B64));
  const receiveAudio = useRef(new Audio(SND_RCVD_B64));

  useEffect(() => {
    const initSession = () => {
      try {
        const session = createChatSession(persona, user);
        setChatSession(session);
      } catch (error) {
        console.error("Failed to init session", error);
      }
    };
    initSession();
  }, [persona.id, user]);

  useEffect(() => {
    if (messages.length > 0) {
        onUpdateHistory(persona.id, messages);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, persona.id, onUpdateHistory]);

  const playSound = (type: 'send' | 'receive') => {
    if (!soundEnabled) return;
    
    const audio = type === 'send' ? sendAudio.current : receiveAudio.current;
    audio.currentTime = 0;
    audio.volume = 0.3; // Softer volume for professional feel
    audio.play().catch(e => console.warn("Audio play blocked by browser policy", e));
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || !chatSession || isLoading) return;

    if (!textOverride) {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: textToSend,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMsg]);
      playSound('send');
      setInput('');
    }

    setIsLoading(true);

    try {
      setMessages(prev => prev.filter(m => !m.isError));

      const resultStream = await chatSession.sendMessageStream({ message: textToSend });
      
      const botMsgId = (Date.now() + 1).toString();
      let fullText = '';
      let isFirstChunk = true;

      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const chunk of resultStream) {
        if (isFirstChunk) {
          playSound('receive');
          isFirstChunk = false;
        }
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || '';
        fullText += chunkText;
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsgIndex = newMessages.findIndex(m => m.id === botMsgId);
          if (lastMsgIndex !== -1) {
            newMessages[lastMsgIndex] = { 
              ...newMessages[lastMsgIndex], 
              text: fullText 
            };
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message", error);
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(),
        role: 'model',
        text: "Connection failed.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSend(lastUserMessage.text);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearLocalChat = () => {
      onClearChat(persona.id);
      setMessages([{
        id: 'init-' + Date.now(),
        role: 'model',
        text: persona.initialMessage,
        timestamp: new Date()
      }]);
      setIsMenuOpen(false);
  };

  const handleSaveBotCustomization = () => {
      onCustomizeBot(persona.id, { name: editName, imageUrl: editImage });
      setIsEditModalOpen(false);
      setIsMenuOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <img 
                        src={persona.imageUrl} 
                        alt={persona.name} 
                        className="w-full h-full object-cover object-top"
                    />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{persona.name}</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">{persona.category}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          
          {/* Menu Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
                <>
                <div className="fixed inset-0 z-20" onClick={() => setIsMenuOpen(false)} />
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-10 right-0 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-30 overflow-hidden"
                >
                    <div className="p-1">
                        <button 
                            onClick={() => {
                                setIsEditModalOpen(true);
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Edit3 size={14} /> Customize Bot
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                        <button 
                            onClick={handleClearLocalChat}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Trash2 size={14} /> Clear Chat History
                        </button>
                    </div>
                </motion.div>
                </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Customization Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
             >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Customize {persona.name}</h3>
                    <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-5">
                     <div className="flex justify-center">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-lg">
                                <img src={editImage} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="text-white" size={20} />
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Bot Name</label>
                        <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium"
                        />
                     </div>
                     <button 
                        onClick={handleSaveBotCustomization}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 text-sm"
                     >
                        <Check size={16} /> Save Changes
                     </button>
                </div>
             </motion.div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50 dark:bg-slate-950 scroll-smooth">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          
          if (msg.isError) {
             return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex w-full justify-center my-2">
                   <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-full px-4 py-1.5">
                      <AlertCircle size={14} className="text-red-600 dark:text-red-400" />
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">Failed to send</span>
                      <button onClick={handleRetry} className="ml-1 flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-red-900/40 rounded text-xs font-bold text-red-700 dark:text-red-300 hover:bg-red-50 transition-colors border border-red-100 dark:border-red-800">
                         <RotateCcw size={10} /> Retry
                      </button>
                   </div>
                </motion.div>
             );
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] sm:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm
                  ${isUser ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                  {isUser ? <User size={14} className="text-indigo-600 dark:text-indigo-400" /> : 
                    <img src={persona.imageUrl} className="w-full h-full object-cover object-top" />
                  }
                </div>
                <div className={`px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                  ${isUser 
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm'
                  }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Typing Indicator */}
        {isLoading && (
           <div className="flex justify-start w-full">
             <div className="flex items-center gap-3 max-w-[70%]">
               <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                 <img src={persona.imageUrl} className="w-full h-full object-cover object-top" />
               </div>
               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 relative z-20">
        <div className="max-w-4xl mx-auto relative">
           <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Message ${persona.name}...`}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all resize-none h-[56px] max-h-32 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-400 disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};