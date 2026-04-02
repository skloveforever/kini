import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { Sparkles, ArrowRight, Heart, Brain, Target, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [likesInput, setLikesInput] = useState('');
  const [dislikesInput, setDislikesInput] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    gender: '',
    age: undefined,
    city: '',
    state: '',
    country: '',
    lifeStage: '',
    emotionalState: '',
    likes: [],
    dislikes: [],
    preferences: [],
    dailyWins: 0,
    goals: [],
    personality: '',
    onboardingCompleted: false,
  });

  const nextStep = () => {
    if (step === 4) {
      setProfile(prev => ({
        ...prev,
        likes: likesInput.split(',').map(s => s.trim()).filter(Boolean),
        dislikes: dislikesInput.split(',').map(s => s.trim()).filter(Boolean)
      }));
    }
    setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  const handleComplete = () => {
    onComplete({ ...profile, onboardingCompleted: true });
  };

  const togglePreference = (pref: string) => {
    setProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  const toggleGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-obsidian overflow-y-auto custom-scrollbar">
      <div className="min-h-full flex items-center justify-center p-4 md:p-6 py-8 md:py-12">
        <div className="w-full max-w-xl">
          {/* Progress Indicator & Back Button */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <button
              onClick={prevStep}
              className={cn(
                "p-2 rounded-full hover:bg-white/5 transition-all",
                step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <ArrowRight className="w-5 h-5 rotate-180 text-slate-400" />
            </button>
            <div className="flex gap-2 justify-center flex-1">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    step >= s ? "w-6 md:w-8 bg-teal-calm" : "w-3 md:w-4 bg-white/10"
                  )}
                />
              ))}
            </div>
            <div className="w-9" /> {/* Spacer for symmetry */}
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
              <div className="w-20 h-20 bg-teal-calm/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-teal-calm" />
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-white mb-4">Welcome to Comiway.ai</h1>
              <p className="text-xs text-slate-500 mb-6 italic">Please enter true details for the best experience.</p>
              <p className="text-slate-400 mb-8 md:mb-12 leading-relaxed text-sm md:text-base">
                Let's architect your digital sanctuary. First, what should we call you?
              </p>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 md:px-8 py-4 md:py-6 text-lg md:text-xl text-white outline-none focus:border-teal-calm/30 transition-all text-center mb-8 md:mb-12"
              />
              <button
                disabled={!profile.name}
                onClick={nextStep}
                className="w-full py-4 md:py-6 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <User className="w-6 h-6 text-teal-calm" />
                <h2 className="text-xl md:text-2xl font-medium text-white">Tell us a bit about yourself</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 italic">Please enter true details for the best experience.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 md:mb-12">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">Gender</label>
                  <select
                    value={profile.gender || ''}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-obsidian">Select Gender</option>
                    <option value="Male" className="bg-obsidian">Male</option>
                    <option value="Female" className="bg-obsidian">Female</option>
                    <option value="Non-binary" className="bg-obsidian">Non-binary</option>
                    <option value="Other" className="bg-obsidian">Other</option>
                    <option value="Prefer not to say" className="bg-obsidian">Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">Age</label>
                  <input
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                    placeholder="e.g. 25"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">State</label>
                  <input
                    type="text"
                    value={profile.state || ''}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">Country</label>
                  <input
                    type="text"
                    value={profile.country || ''}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    placeholder="e.g. India"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                  />
                </div>
              </div>
              <button
                disabled={!profile.age || !profile.city || !profile.state || !profile.country || !profile.gender}
                onClick={nextStep}
                className="w-full py-4 md:py-6 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <Brain className="w-6 h-6 text-teal-calm" />
                <h2 className="text-xl md:text-2xl font-medium text-white">Your Current Context</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 italic">Please enter true details for the best experience.</p>
              <div className="space-y-6 mb-8 md:mb-12">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">Life Stage</label>
                  <select
                    value={profile.lifeStage || ''}
                    onChange={(e) => setProfile({ ...profile, lifeStage: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-obsidian">Select your stage</option>
                    <option value="Student" className="bg-obsidian">Student</option>
                    <option value="Early Career" className="bg-obsidian">Early Career Professional</option>
                    <option value="Mid-Career" className="bg-obsidian">Mid-Career Professional</option>
                    <option value="Entrepreneur" className="bg-obsidian">Entrepreneur / Freelancer</option>
                    <option value="Homemaker" className="bg-obsidian">Homemaker</option>
                    <option value="Retired" className="bg-obsidian">Retired</option>
                    <option value="Other" className="bg-obsidian">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">Current Emotional State</label>
                  <textarea
                    value={profile.emotionalState || ''}
                    onChange={(e) => setProfile({ ...profile, emotionalState: e.target.value })}
                    placeholder="How are you feeling lately? (e.g. Stressed about work, feeling lonely, excited for new beginnings...)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all h-32 resize-none"
                  />
                </div>
              </div>
              <button
                disabled={!profile.lifeStage || !profile.emotionalState}
                onClick={nextStep}
                className="w-full py-4 md:py-6 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <Heart className="w-6 h-6 text-teal-calm" />
                <h2 className="text-xl md:text-2xl font-medium text-white">Likes & Dislikes</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 italic">Please enter true details for the best experience.</p>
              <div className="space-y-6 mb-8 md:mb-12">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">What do you love? (Comma separated)</label>
                  <input
                    type="text"
                    value={likesInput}
                    onChange={(e) => setLikesInput(e.target.value)}
                    placeholder="e.g. Coffee, Rain, Sci-fi movies, Deep conversations"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-widest">What do you dislike? (Comma separated)</label>
                  <input
                    type="text"
                    value={dislikesInput}
                    onChange={(e) => setDislikesInput(e.target.value)}
                    placeholder="e.g. Crowds, Loud noises, Injustice, Small talk"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                  />
                </div>
              </div>
              <button
                disabled={!likesInput.trim() || !dislikesInput.trim()}
                onClick={nextStep}
                className="w-full py-4 md:py-6 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <Heart className="w-6 h-6 text-teal-calm" />
                <h2 className="text-xl md:text-2xl font-medium text-white">What do you need most right now?</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 italic">Please enter true details for the best experience.</p>
              <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8 md:mb-12">
                {[
                  { id: 'motivation', label: 'Motivation & Drive', desc: 'I need someone to push me to my limits.' },
                  { id: 'peace', label: 'Emotional Support', desc: 'I need a safe space to vent and heal.' },
                  { id: 'fun', label: 'Chill & Fun', desc: 'I just want to relax and have a good laugh.' },
                  { id: 'wisdom', label: 'Wisdom & Guidance', desc: 'I need perspective on life\'s big questions.' }
                ].map(pref => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.label)}
                    className={cn(
                      "p-4 md:p-6 rounded-2xl border text-left transition-all",
                      profile.preferences.includes(pref.label)
                        ? "bg-teal-calm/20 border-teal-calm text-teal-calm"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                    )}
                  >
                    <div className="font-bold mb-1 text-sm md:text-base">{pref.label}</div>
                    <div className="text-[10px] md:text-xs opacity-60">{pref.desc}</div>
                  </button>
                ))}
              </div>
              <button
                disabled={profile.preferences.length === 0}
                onClick={nextStep}
                className="w-full py-4 md:py-6 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <Target className="w-6 h-6 text-teal-calm" />
                <h2 className="text-xl md:text-2xl font-medium text-white">What are your long-term goals?</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 italic">Please enter true details for the best experience.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-8 md:mb-12">
                {['Career Growth', 'Mental Peace', 'Better Habits', 'Social Skills', 'Physical Health', 'Creativity'].map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      "p-3 md:p-6 rounded-2xl border text-left transition-all text-sm md:text-base",
                      profile.goals.includes(goal)
                        ? "bg-teal-calm/20 border-teal-calm text-teal-calm"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <button
                disabled={profile.goals.length === 0}
                onClick={nextStep}
                className="w-full py-4 md:py-6 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                Next Step <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <User className="w-6 h-6 text-teal-calm" />
                <h2 className="text-xl md:text-2xl font-medium text-white">How would you describe yourself?</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6 italic">Please enter true details for the best experience.</p>
              <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8 md:mb-12">
                {[
                  { id: 'ambitious', label: 'Ambitious & Driven', desc: 'I want to reach the top of my game.' },
                  { id: 'creative', label: 'Creative & Curious', desc: 'I love exploring new ideas and concepts.' },
                  { id: 'calm', label: 'Calm & Reflective', desc: 'I value peace and deep understanding.' },
                  { id: 'social', label: 'Social & Energetic', desc: 'I thrive on connection and activity.' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProfile({ ...profile, personality: p.label })}
                    className={cn(
                      "p-4 md:p-6 rounded-2xl border text-left transition-all",
                      profile.personality === p.label
                        ? "bg-teal-calm/20 border-teal-calm text-teal-calm"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                    )}
                  >
                    <div className="font-bold mb-1 text-sm md:text-base">{p.label}</div>
                    <div className="text-[10px] md:text-xs opacity-60">{p.desc}</div>
                  </button>
                ))}
              </div>
              <button
                disabled={!profile.personality}
                onClick={handleComplete}
                className="w-full py-4 md:py-6 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-xs md:text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                Finalize Profile <Sparkles className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
};
