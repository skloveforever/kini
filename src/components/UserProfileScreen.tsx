import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, MapPin, Heart, Target, Save, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface UserProfileScreenProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ profile, onUpdate, onClose }) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [likesInput, setLikesInput] = useState(profile.likes.join(', '));
  const [dislikesInput, setDislikesInput] = useState(profile.dislikes.join(', '));

  const handleSave = () => {
    onUpdate({
      ...editedProfile,
      likes: likesInput.split(',').map(s => s.trim()).filter(Boolean),
      dislikes: dislikesInput.split(',').map(s => s.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-obsidian flex items-center justify-center p-0 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full h-full md:h-auto md:max-w-2xl glass-dark border-0 md:border md:border-white/10 rounded-none md:rounded-[40px] overflow-hidden flex flex-col md:max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 md:p-8 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-teal-calm/10">
              <User className="w-5 h-5 md:w-6 md:h-6 text-teal-calm" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white/90">Your Sanctuary Profile</h2>
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500">Personal Identity & Context</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 md:space-y-10 custom-scrollbar">
          {/* Basic Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-teal-calm" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Basic Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Full Name</label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Age</label>
                <input
                  type="number"
                  value={editedProfile.age || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-teal-calm" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Location Context</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">City</label>
                <input
                  type="text"
                  value={editedProfile.city}
                  onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">State</label>
                <input
                  type="text"
                  value={editedProfile.state}
                  onChange={(e) => setEditedProfile({ ...editedProfile, state: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Country</label>
                <input
                  type="text"
                  value={editedProfile.country}
                  onChange={(e) => setEditedProfile({ ...editedProfile, country: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Likes & Dislikes */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-teal-calm" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Preferences</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Likes (Comma separated)</label>
                <input
                  type="text"
                  value={likesInput}
                  onChange={(e) => setLikesInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Dislikes (Comma separated)</label>
                <input
                  type="text"
                  value={dislikesInput}
                  onChange={(e) => setDislikesInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Life Stage */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-teal-calm" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Life Context</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Current Life Stage</label>
                <input
                  type="text"
                  value={editedProfile.lifeStage}
                  onChange={(e) => setEditedProfile({ ...editedProfile, lifeStage: e.target.value })}
                  placeholder="e.g. Student, Working Professional, Parent..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Current Emotional State</label>
                <input
                  type="text"
                  value={editedProfile.emotionalState}
                  onChange={(e) => setEditedProfile({ ...editedProfile, emotionalState: e.target.value })}
                  placeholder="e.g. Stressed, Happy, Reflective..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-calm/30 transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-8 glass-dark border-t border-white/10 flex gap-3 md:gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 md:py-4 rounded-2xl bg-white/5 text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 md:py-4 rounded-2xl bg-teal-calm text-black font-bold uppercase tracking-widest text-[10px] md:text-xs hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
