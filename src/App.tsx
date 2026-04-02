import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Settings, UserCircle, Plus, X } from 'lucide-react';
import { Kin, Message, UserProfile } from './types';
import { CircleHub } from './components/CircleHub';
import { InteractionScreen } from './components/InteractionScreen';
import { CharacterLab } from './components/CharacterLab';
import { GuardianProtocol } from './components/GuardianProtocol';
import { Onboarding } from './components/Onboarding';
import { UserProfileScreen } from './components/UserProfileScreen';
import { generateKinResponse, generateKinResponseStream } from './services/aiService';
import { cn } from './lib/utils';

const INITIAL_KINS: Kin[] = [
  {
    id: 'aarav',
    name: 'Aarav',
    role: 'Mentor/Guide',
    dna: {
      archetypes: ['Stoic Mentor', 'Tough-Love Coach', 'Wise Elder'],
      brainModes: ['Motivation Spark (MI)', 'Acceptance & Commitment (ACT)', 'Positive Psychology'],
      language: 'Auto-Hinglish',
      sharedSoul: true,
      gender: 'Non-binary',
      age: 45,
      backgroundStory: 'A seasoned professional who has seen the ups and downs of the corporate world. Aarav is here to provide the wisdom and tough love you need to reach your potential.',
    },
    auraColor: '#3b82f6',
    avatar: 'https://picsum.photos/seed/aarav/400/400',
    status: 'idle',
  },
  {
    id: 'diya',
    name: 'Diya',
    role: 'Sibling/Friend',
    dna: {
      archetypes: ['Playful Sibling', 'Witty Maverick', 'Empathetic Listener'],
      brainModes: ['The Cheerleader (PERMA)', 'Positive Psychology', 'Grounding Anchor (DBT)'],
      language: 'Auto-Hinglish',
      sharedSoul: true,
      gender: 'Other',
      age: 22,
      backgroundStory: 'Your childhood best friend who knows all your secrets and still likes you. Diya is always ready with a joke or a shoulder to cry on.',
    },
    auraColor: '#ec4899',
    avatar: 'https://picsum.photos/seed/diya/400/400',
    status: 'idle',
  },
];

export default function App() {
  const [kins, setKins] = useState<Kin[]>(INITIAL_KINS);
  const [selectedKinId, setSelectedKinId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isCharacterLabOpen, setIsCharacterLabOpen] = useState(false);
  const [isCreatingNewKin, setIsCreatingNewKin] = useState(false);
  const [newKinData, setNewKinData] = useState<Kin | null>(null);
  const [isGuardianOpen, setIsGuardianOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [distressCount, setDistressCount] = useState(0);
  const [memoryPings, setMemoryPings] = useState<Kin['memoryPings']>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'User',
    gender: '',
    age: undefined,
    city: '',
    state: '',
    country: '',
    lifeStage: '',
    emotionalState: '',
    likes: [],
    dislikes: [],
    preferences: ['Filter Coffee', 'Rain'],
    dailyWins: 3,
    goals: [],
    personality: '',
    onboardingCompleted: false,
  });

  const selectedKin = kins.find(k => k.id === selectedKinId);

  const handleSendMessage = async (text: string) => {
    if (!selectedKinId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages(prev => ({
      ...prev,
      [selectedKinId]: [...(prev[selectedKinId] || []), userMsg]
    }));

    // Detect distress (simple keyword check for demo)
    const distressKeywords = ['hopeless', 'suicide', 'end it', 'give up', 'dying', 'hurt myself'];
    if (distressKeywords.some(kw => text.toLowerCase().includes(kw))) {
      setDistressCount(prev => prev + 1);
    }

    // Update Kin status to thinking
    setKins(prev => prev.map(k => k.id === selectedKinId ? { ...k, status: 'thinking' } : k));

    try {
      const history = messages[selectedKinId] || [];
      const kinMsgId = (Date.now() + 1).toString();
      
      // Create initial empty message
      const initialKinMsg: Message = {
        id: kinMsgId,
        senderId: selectedKinId,
        text: '',
        timestamp: Date.now(),
        isSomatic: distressCount >= 2,
      };

      setMessages(prev => ({
        ...prev,
        [selectedKinId]: [...(prev[selectedKinId] || []), initialKinMsg]
      }));

      const stream = generateKinResponseStream(selectedKin!, history, text, userProfile);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => {
          const currentMessages = prev[selectedKinId] || [];
          const updatedMessages = currentMessages.map(m => 
            m.id === kinMsgId ? { ...m, text: fullText } : m
          );
          return { ...prev, [selectedKinId]: updatedMessages };
        });
      }
    } catch (error: any) {
      console.error('Failed to generate response:', error);
      
      const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
      const errorMessage = isRateLimit 
        ? "I'm a bit overwhelmed with requests right now. Can we try again in a moment? (Rate limit reached)"
        : "I'm having trouble connecting right now. Let's try again in a bit.";

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedKinId,
        text: errorMessage,
        timestamp: Date.now(),
        isSystem: true,
      };

      setMessages(prev => ({
        ...prev,
        [selectedKinId]: [...(prev[selectedKinId] || []), errorMsg]
      }));
    } finally {
      setKins(prev => prev.map(k => k.id === selectedKinId ? { ...k, status: 'active' } : k));
    }
  };

  useEffect(() => {
    if (distressCount >= 3) {
      setIsGuardianOpen(true);
      setDistressCount(0); // Reset after trigger
    }
  }, [distressCount]);

  const updateKin = (updates: Partial<Kin>) => {
    if (isCreatingNewKin && newKinData) {
      setNewKinData({ ...newKinData, ...updates });
    } else if (selectedKinId) {
      setKins(prev => prev.map(k => k.id === selectedKinId ? { ...k, ...updates } : k));
    }
  };

  const handleStartNewKin = () => {
    const newKin: Kin = {
      id: `kin-${Date.now()}`,
      name: '',
      role: 'Sibling/Friend',
      dna: {
        archetypes: ['Empathetic Listener'],
        brainModes: ['Grounding Anchor (DBT)'],
        language: 'Auto-Hinglish',
        sharedSoul: true,
        gender: 'Female',
        age: 25,
        backgroundStory: '',
      },
      auraColor: '#6366f1',
      avatar: `https://picsum.photos/seed/${Date.now()}/400/400`,
      status: 'idle',
    };
    setNewKinData(newKin);
    setIsCreatingNewKin(true);
    setIsCharacterLabOpen(true);
  };

  const handleFinalizeKin = () => {
    if (isCreatingNewKin && newKinData) {
      setKins(prev => [...prev, newKinData]);
      setIsCreatingNewKin(false);
      setNewKinData(null);
    }
    setIsCharacterLabOpen(false);
  };

  const handleDeleteKin = (id: string) => {
    setKins(prev => prev.filter(k => k.id !== id));
    setSelectedKinId(null);
    setIsCharacterLabOpen(false);
  };

  const handleDiscardPing = (pingId: string) => {
    setMemoryPings(prev => prev?.filter(p => p.id !== pingId) || []);
  };

  const handleSetMemoryPing = (text: string) => {
    if (!selectedKinId) return;
    const newPing = {
      id: Date.now().toString(),
      kinId: selectedKinId,
      text,
      timestamp: Date.now(),
    };
    setMemoryPings(prev => [...(prev || []), newPing]);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-teal-calm/30">
      {!userProfile.onboardingCompleted && (
        <Onboarding onComplete={setUserProfile} />
      )}
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 z-30">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-teal-calm/10 border border-teal-calm/20 flex items-center justify-center">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-teal-calm rounded-full animate-pulse" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold tracking-tight text-white/90">Comiway.ai</h1>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => setIsGuardianOpen(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-teal-calm/10 border border-teal-calm/20 rounded-full text-teal-calm hover:bg-teal-calm/20 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest">Guardian</span>
          </button>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 overflow-hidden hover:border-teal-calm/50 transition-colors"
          >
            <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          {!selectedKinId ? (
            <motion.div
              key="hub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="text-center mb-8 md:mb-12 px-4">
                <h2 className="text-3xl md:text-4xl font-light text-white/90 mb-4">Your Digital Family</h2>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed text-sm md:text-base">
                  Step into your sanctuary. Your Kin are here to listen, support, and grow with you.
                </p>
              </div>
              
              <CircleHub 
                kins={kins} 
                onSelectKin={(k) => setSelectedKinId(k.id)} 
                onEditKin={(k) => {
                  setSelectedKinId(k.id);
                  setIsCharacterLabOpen(true);
                }}
                onDeleteKin={handleDeleteKin}
              />

              <button 
                onClick={handleStartNewKin}
                className="mt-8 md:mt-12 flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 glass border-white/10 rounded-full text-slate-300 hover:bg-white/10 transition-all group"
              >
                <Plus className="w-5 h-5 text-teal-calm group-hover:rotate-90 transition-transform" />
                <span className="text-sm font-medium">Architect New Kin</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="interaction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <InteractionScreen 
                kin={selectedKin!}
                messages={messages[selectedKinId] || []}
                onSendMessage={handleSendMessage}
                onBack={() => setSelectedKinId(null)}
                onSetMemoryPing={handleSetMemoryPing}
                onEdit={() => setIsCharacterLabOpen(true)}
                onDelete={() => handleDeleteKin(selectedKinId)}
              />
              
              {/* Character Lab Trigger */}
              <button 
                onClick={() => setIsCharacterLabOpen(true)}
                className="fixed right-4 bottom-4 md:right-8 md:bottom-8 p-3 md:p-4 glass-dark border-white/10 rounded-2xl text-slate-400 hover:text-teal-calm transition-colors z-30"
              >
                <Settings className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {isCharacterLabOpen && (isCreatingNewKin ? newKinData : selectedKin) && (
          <CharacterLab 
            kin={isCreatingNewKin ? newKinData! : selectedKin!}
            onUpdateKin={updateKin}
            onDeleteKin={handleDeleteKin}
            onClose={handleFinalizeKin}
            isNew={isCreatingNewKin}
          />
        )}
        {isProfileOpen && (
          <UserProfileScreen 
            profile={userProfile}
            onUpdate={(updates) => setUserProfile(prev => ({ ...prev, ...updates }))}
            onClose={() => setIsProfileOpen(false)}
          />
        )}
      </AnimatePresence>

      <GuardianProtocol 
        isOpen={isGuardianOpen} 
        onClose={() => setIsGuardianOpen(false)} 
      />

      {/* Memory Pins */}
      <div className="fixed left-8 bottom-8 space-y-4 z-30">
        <AnimatePresence>
          {memoryPings?.map(ping => (
            <motion.div
              key={ping.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="glass p-5 rounded-2xl border-teal-calm/20 max-w-xs relative group shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-calm rounded-full shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-teal-calm">Memory Ping</span>
                </div>
                <button 
                  onClick={() => handleDiscardPing(ping.id)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {ping.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
