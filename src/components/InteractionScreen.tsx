import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Activity, ChevronLeft, BellPlus, Edit2, Trash2 } from 'lucide-react';
import { Kin, Message } from '../types';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

interface InteractionScreenProps {
  kin: Kin;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  onSetMemoryPing: (text: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const InteractionScreen: React.FC<InteractionScreenProps> = ({ kin, messages, onSendMessage, onBack, onSetMemoryPing, onEdit, onDelete }) => {
  const [inputText, setInputText] = useState('');
  const [isPingModalOpen, setIsPingModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pingText, setPingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSetPing = () => {
    if (!pingText.trim()) return;
    onSetMemoryPing(pingText);
    setPingText('');
    setIsPingModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-white/5">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-base md:text-lg font-medium text-slate-200">{kin.name}</h2>
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-teal-calm/70">{kin.role}</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={() => setIsPingModalOpen(true)}
            className="p-2 md:p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-teal-calm transition-colors"
            title="Set Memory Ping"
          >
            <BellPlus className="w-4 h-4" />
          </button>
          <button 
            onClick={onEdit}
            className="p-2 md:p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-teal-calm transition-colors"
            title="Edit Kin"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <div className="relative">
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 p-4 glass-dark border border-red-500/30 rounded-2xl shadow-2xl w-48 z-50"
                >
                  <p className="text-[10px] text-slate-300 mb-3 text-center">Delete {kin.name}?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                    >
                      No
                    </button>
                    <button 
                      onClick={onDelete}
                      className="flex-1 py-2 rounded-lg bg-red-500 text-[10px] font-bold uppercase tracking-widest text-white"
                    >
                      Yes
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className={cn(
                "p-2 md:p-2.5 rounded-xl transition-colors",
                showDeleteConfirm ? "bg-red-500/20 text-red-400" : "bg-white/5 text-slate-400 hover:text-red-400"
              )}
              title="Delete Kin"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Memory Ping Modal */}
      <AnimatePresence>
        {isPingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md glass-dark border border-white/10 p-8 rounded-3xl shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Set Memory Ping</h3>
              <p className="text-sm text-slate-500 mb-6">Ask {kin.name} to remind you of something later.</p>
              
              <textarea
                value={pingText}
                onChange={(e) => setPingText(e.target.value)}
                placeholder="e.g., Remind me to take my meds at 8 PM..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-200 outline-none focus:border-teal-calm/30 transition-colors resize-none mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsPingModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSetPing}
                  className="flex-1 py-3 rounded-xl bg-teal-calm text-black font-bold hover:scale-[1.02] transition-transform"
                >
                  Set Ping
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6 scroll-smooth custom-scrollbar" ref={scrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col",
                msg.isSystem ? "w-full items-center" : msg.senderId === 'user' ? "ml-auto items-end max-w-[80%]" : "mr-auto items-start max-w-[80%]"
              )}
            >
              <div
                className={cn(
                  "p-4 rounded-3xl text-sm leading-relaxed",
                  msg.isSystem 
                    ? "bg-red-500/10 border border-red-500/20 text-red-400 text-center italic max-w-[90%]"
                    : msg.senderId === 'user' 
                      ? "bg-white/10 text-slate-200 rounded-tr-none" 
                      : "glass-dark text-slate-300 rounded-tl-none border-teal-calm/10"
                )}
              >
                <div className="markdown-body">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
              {msg.isSomatic && (
                <div className="mt-2 flex items-center gap-2 text-[10px] text-teal-calm/60 uppercase tracking-widest">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Coregulation Active
                </div>
              )}
            </div>
          ))}
          {kin.status === 'thinking' && (
            <div className="flex items-center gap-3 text-slate-500 text-xs italic ml-2">
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 bg-slate-500 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 bg-slate-500 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 bg-slate-500 rounded-full" />
              </div>
              {kin.name} is typing...
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 pt-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${kin.name}...`}
            className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl py-3 md:py-4 px-4 md:px-6 pr-14 md:pr-16 focus:outline-none focus:border-teal-calm/30 transition-colors text-sm md:text-base text-slate-200 placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 md:right-3 p-2 md:p-3 bg-teal-calm text-black rounded-xl md:rounded-2xl hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-3 px-4">
          Kin can make mistakes. We're consistently working to enhance your experience.
        </p>
      </div>
    </div>
  );
};
