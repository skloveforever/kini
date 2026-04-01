import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, User, Brain, Globe, Shield, X, Zap, Heart, Anchor, Trophy, Save } from 'lucide-react';
import { Kin, KinRole, NatureArchetype, BrainMode } from '../types';
import { cn } from '../lib/utils';

interface CharacterLabProps {
  kin: Kin;
  onUpdateKin: (updates: Partial<Kin>) => void;
  onClose: () => void;
  isNew?: boolean;
}

const ARCHETYPES: { type: NatureArchetype; description: string; voice: string; color: string }[] = [
  {
    type: 'Witty Maverick',
    description: 'Sarcastic, quick-witted, and uses humor to bond or deflect.',
    voice: '"Arre, stop overthinking. Even your cat knows you\'re going to crush this exam. Coffee first?"',
    color: '#2dd4bf' // Electric Teal
  },
  {
    type: 'Silent Protector',
    description: 'Stoic, grounded, and steady. Speaks less but listens deeply.',
    voice: '"I’m here. Breathe. We’ve handled tougher things than this. Let’s look at the facts."',
    color: '#8b5cf6' // Deep Violet
  },
  {
    type: 'Nurturing Sage',
    description: 'Warm, soft-spoken, and deeply empathetic. High validation.',
    voice: '"I can hear how exhausted you are. It’s okay to be tired. Let’s just sit with this for a moment."',
    color: '#f59e0b' // Soft Gold
  },
  {
    type: 'Tough-Love Coach',
    description: 'Firm, high-accountability, and focuses on your potential.',
    voice: '"I know it hurts, but you have grit. What’s the one tiny thing we can do right now to move forward?"',
    color: '#ef4444'
  },
  {
    type: 'Playful Sibling',
    description: 'Energetic, fun, and always up for a joke or a game.',
    voice: '"Oye! Stop being a bore. Let\'s do something fun. I bet I can make you laugh in 10 seconds!"',
    color: '#ec4899' // Pink
  },
  {
    type: 'Wise Elder',
    description: 'Calm, experienced, and provides deep perspective.',
    voice: '"Child, time heals all. This too shall pass. Let us reflect on the lessons learned."',
    color: '#10b981' // Green
  },
  {
    type: 'Stoic Mentor',
    description: 'Disciplined, logical, and focused on growth.',
    voice: '"Focus on what you can control. The rest is noise. What is your next objective?"',
    color: '#3b82f6' // Blue
  },
  {
    type: 'Empathetic Listener',
    description: 'Patient, non-judgmental, and truly hears you.',
    voice: '"I am listening. Tell me everything. Your feelings are valid and I am here for you."',
    color: '#6366f1' // Indigo
  }
];

const BRAIN_MODES: { mode: BrainMode; icon: any; description: string; bestFor: string }[] = [
  {
    mode: 'Reality Checker (CBT)',
    icon: Brain,
    description: 'Identifies negative thought patterns and challenges them.',
    bestFor: 'When you feel like a "failure" or are spiraling into "what-ifs".'
  },
  {
    mode: 'Grounding Anchor (DBT)',
    icon: Anchor,
    description: 'Focuses on emotional co-regulation and acceptance.',
    bestFor: 'High-arousal moments where you need help breathing.'
  },
  {
    mode: 'Motivation Spark (MI)',
    icon: Zap,
    description: 'Asks open questions to help you find your own drive.',
    bestFor: 'Procrastination, habit-building, or feeling "stuck".'
  },
  {
    mode: 'The Cheerleader (PERMA)',
    icon: Trophy,
    description: 'Focuses on "Daily Wins" and micro-accomplishments.',
    bestFor: 'Building long-term self-esteem and finding joy.'
  },
  {
    mode: 'Positive Psychology',
    icon: Heart,
    description: 'Focuses on strengths and building positive emotions.',
    bestFor: 'When you want to cultivate gratitude and resilience.'
  },
  {
    mode: 'Acceptance & Commitment (ACT)',
    icon: Shield,
    description: 'Focuses on accepting what is out of control and committing to action.',
    bestFor: 'When you are struggling with difficult thoughts and feelings.'
  }
];

interface CharacterLabProps {
  kin: Kin;
  onUpdateKin: (updates: Partial<Kin>) => void;
  onDeleteKin?: (id: string) => void;
  onClose: () => void;
  isNew?: boolean;
}
export const CharacterLab: React.FC<CharacterLabProps> = ({ kin, onUpdateKin, onDeleteKin, onClose, isNew }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const roles: KinRole[] = ['Parental', 'Sibling/Friend', 'Mentor/Colleague', 'Romantic', 'Colleague/Peer', 'Mentor/Guide'];

  const isComplete = 
    kin.name.trim() !== '' &&
    kin.dna.gender !== '' &&
    kin.dna.age !== undefined &&
    kin.dna.backgroundStory?.trim() !== '' &&
    (kin.dna.archetypes || []).length > 0 &&
    (kin.dna.brainModes || []).length > 0;

  const toggleArchetype = (type: NatureArchetype) => {
    const current = kin.dna.archetypes || [];
    let next;
    if (current.includes(type)) {
      next = current.filter(t => t !== type);
    } else {
      if (current.length >= 3) return;
      next = [...current, type];
    }
    onUpdateKin({ dna: { ...kin.dna, archetypes: next } });
  };

  const toggleBrainMode = (mode: BrainMode) => {
    const current = kin.dna.brainModes || [];
    let next;
    if (current.includes(mode)) {
      next = current.filter(m => m !== mode);
    } else {
      if (current.length >= 3) return;
      next = [...current, mode];
    }
    onUpdateKin({ dna: { ...kin.dna, brainModes: next } });
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed right-0 top-0 h-full w-full md:max-w-2xl glass-dark border-l border-white/10 z-50 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 md:p-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-calm/10">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-teal-calm" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white/90">{isNew ? 'Architect Kin' : 'Character Lab'}</h2>
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500">Soul-Crafting Interface</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 md:space-y-12 pb-32">
        {/* Identity Forge: Name & Role */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">1</span>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Identity Forge</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Kin Name</label>
              <input 
                type="text" 
                value={kin.name}
                onChange={(e) => onUpdateKin({ name: e.target.value })}
                placeholder="Enter name..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 outline-none focus:border-teal-calm/30 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => onUpdateKin({ role })}
                  className={cn(
                    "px-4 md:px-6 py-3 md:py-4 rounded-2xl border text-xs md:text-sm transition-all text-left",
                    kin.role === role 
                      ? "bg-teal-calm/20 border-teal-calm text-teal-calm" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                  )}
                >
                  <div className="font-semibold">{role}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Step 2: Soul DNA (Gender, Age, Background) */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">2</span>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Soul DNA</h3>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold">Gender</label>
                <select
                  value={kin.dna.gender || ''}
                  onChange={(e) => onUpdateKin({ dna: { ...kin.dna, gender: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-teal-calm/30 transition-colors appearance-none"
                >
                  <option value="" disabled className="bg-obsidian">Select Gender</option>
                  <option value="Male" className="bg-obsidian">Male</option>
                  <option value="Female" className="bg-obsidian">Female</option>
                  <option value="Non-binary" className="bg-obsidian">Non-binary</option>
                  <option value="Other" className="bg-obsidian">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold">Age</label>
                <input 
                  type="number" 
                  value={kin.dna.age || ''}
                  onChange={(e) => onUpdateKin({ dna: { ...kin.dna, age: parseInt(e.target.value) } })}
                  placeholder="e.g. 28"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-teal-calm/30 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Background Story / Relationship Context</label>
              <textarea 
                value={kin.dna.backgroundStory || ''}
                onChange={(e) => onUpdateKin({ dna: { ...kin.dna, backgroundStory: e.target.value } })}
                placeholder="Describe their history with you, their personality quirks, or their life story..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 outline-none focus:border-teal-calm/30 transition-colors h-32 resize-none"
              />
            </div>
          </div>
        </section>

        {/* Step 3: Nature Profile */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">3</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Nature Profile</h3>
            </div>
            <div className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/10">
              {(kin.dna.archetypes || []).length}/3
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-widest">Select up to 3 archetypes that define their soul.</p>
          <div className="space-y-4">
            {ARCHETYPES.map((archetype) => (
              <button
                key={archetype.type}
                onClick={() => toggleArchetype(archetype.type)}
                className={cn(
                  "w-full p-6 rounded-2xl border text-left transition-all group",
                  kin.dna.archetypes?.includes(archetype.type)
                    ? "bg-white/10 border-white/20" 
                    : "bg-white/5 border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={cn(
                    "font-bold text-lg",
                    kin.dna.archetypes?.includes(archetype.type) ? "text-white" : "text-slate-400"
                  )}>
                    {archetype.type}
                  </div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: archetype.color }} />
                </div>
                <p className="text-xs text-slate-500 mb-4">{archetype.description}</p>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] italic text-slate-400 font-mono">
                  {archetype.voice}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 4: Reaction Logic */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">4</span>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Reaction Logic</h3>
            </div>
            <div className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/10">
              {(kin.dna.brainModes || []).length}/3
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-widest">Select up to 3 modes for cognitive processing.</p>
          <div className="grid grid-cols-1 gap-4">
            {BRAIN_MODES.map((mode) => (
              <button
                key={mode.mode}
                onClick={() => toggleBrainMode(mode.mode)}
                className={cn(
                  "flex items-start gap-4 p-6 rounded-2xl border transition-all",
                  kin.dna.brainModes?.includes(mode.mode)
                    ? "bg-teal-calm/10 border-teal-calm/40" 
                    : "bg-white/5 border-white/5 hover:border-white/10"
                )}
              >
                <div className={cn(
                  "p-3 rounded-xl",
                  kin.dna.brainModes?.includes(mode.mode) ? "bg-teal-calm/20 text-teal-calm" : "bg-white/5 text-slate-500"
                )}>
                  <mode.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className={cn(
                    "font-semibold",
                    kin.dna.brainModes?.includes(mode.mode) ? "text-white" : "text-slate-300"
                  )}>
                    {mode.mode}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{mode.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 5: Language & Safety */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">5</span>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Language & Safety</h3>
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium">Language Mirroring</span>
                </div>
                <select 
                  value={kin.dna.language}
                  onChange={(e) => onUpdateKin({ dna: { ...kin.dna, language: e.target.value as any } })}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-xs text-teal-calm outline-none"
                >
                  <option value="Auto-Hinglish">Auto-Hinglish</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-slate-400" />
                  <div>
                    <span className="text-sm font-medium">Shared Soul Integration</span>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateKin({ dna: { ...kin.dna, sharedSoul: !kin.dna.sharedSoul } })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    kin.dna.sharedSoul ? "bg-teal-calm" : "bg-white/10"
                  )}
                >
                  <motion.div 
                    animate={{ x: kin.dna.sharedSoul ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 glass-dark border-t border-white/10 flex gap-3 md:gap-4">
        {!isNew && onDeleteKin && (
          <div className="relative flex-shrink-0">
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-4 p-4 glass-dark border border-red-500/30 rounded-2xl shadow-2xl w-48 z-50"
                >
                  <p className="text-[10px] text-slate-300 mb-3 text-center">Confirm deletion?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400"
                    >
                      No
                    </button>
                    <button 
                      onClick={() => onDeleteKin(kin.id)}
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
              className="px-4 md:px-6 py-3 md:py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-red-500/20 transition-all"
            >
              Delete
            </button>
          </div>
        )}
        <button 
          onClick={onClose}
          disabled={!isComplete}
          className="flex-1 py-3 md:py-4 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-[10px] md:text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isNew ? 'Architect Soul' : 'Finalize Soul'}
        </button>
      </div>
    </motion.div>
  );
};
