import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Phone, X, ExternalLink } from 'lucide-react';

interface GuardianProtocolProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuardianProtocol: React.FC<GuardianProtocolProps> = ({ isOpen, onClose }) => {
  const resources = [
    { name: 'Vandrevala Foundation', phone: '9999666555', link: 'https://www.vandrevalafoundation.com/' },
    { name: 'iCall (TISS)', phone: '9152987821', link: 'http://icallhelpline.org/' },
    { name: 'Aasra', phone: '9820466726', link: 'http://www.aasra.info/' },
    { name: 'Kiran (National)', phone: '18005990019', link: '#' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md max-h-[95vh] md:max-h-[90vh] overflow-y-auto glass-dark rounded-3xl p-5 md:p-8 border-teal-calm/30 shadow-2xl shadow-teal-calm/10 custom-scrollbar relative z-10"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-teal-calm/20">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-teal-calm" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-teal-calm">Guardian Protocol</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <p className="text-slate-400 mb-8 leading-relaxed">
              You are not alone. If you're feeling overwhelmed, these specialized Indian resources are here to support you 24/7.
            </p>

            <div className="space-y-4 mb-8">
              {resources.map((res) => (
                <div key={res.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div>
                    <h3 className="font-medium text-slate-200">{res.name}</h3>
                    <p className="text-sm text-teal-calm/70">{res.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${res.phone}`} className="p-2 bg-teal-calm/20 rounded-xl hover:bg-teal-calm/30 transition-colors">
                      <Phone className="w-4 h-4 text-teal-calm" />
                    </a>
                    <a href={res.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-muted/20 border border-amber-muted/30 hover:bg-amber-muted/30 transition-colors">
                <span className="text-2xl font-bold text-amber-muted">112</span>
                <span className="text-xs uppercase tracking-widest text-amber-muted/70 mt-1">National</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-muted/20 border border-amber-muted/30 hover:bg-amber-muted/30 transition-colors">
                <span className="text-2xl font-bold text-amber-muted">102</span>
                <span className="text-xs uppercase tracking-widest text-amber-muted/70 mt-1">Ambulance</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Close Protocol
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
