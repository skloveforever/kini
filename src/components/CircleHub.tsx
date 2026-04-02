import React from 'react';
import { motion } from 'motion/react';
import { Settings, Trash2 } from 'lucide-react';
import { Kin } from '../types';
import { cn } from '../lib/utils';

interface CircleHubProps {
  kins: Kin[];
  onSelectKin: (kin: Kin) => void;
  onEditKin: (kin: Kin) => void;
  onDeleteKin: (id: string) => void;
}

export const CircleHub: React.FC<CircleHubProps> = ({ kins, onSelectKin, onEditKin, onDeleteKin }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const radius = Math.min(dimensions.width, dimensions.height) * 0.35;
  const orbitSize = radius * 2.2;
  const innerOrbitSize = radius * 1.4;

  return (
    <div ref={containerRef} className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="bg-teal-calm/5 rounded-full blur-[120px]" 
          style={{ width: orbitSize * 1.2, height: orbitSize * 1.2 }}
        />
      </div>

      {/* Orbit Rings */}
      <div 
        className="absolute border border-white/5 rounded-full" 
        style={{ width: orbitSize, height: orbitSize }}
      />
      <div 
        className="absolute border border-white/5 rounded-full" 
        style={{ width: innerOrbitSize, height: innerOrbitSize }}
      />

      {/* Kin Orbit */}
      <div className="relative w-full h-full flex items-center justify-center">
        {kins.map((kin, index) => {
          const angle = (index / kins.length) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={kin.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, x, y }}
              whileHover={{ scale: 1.1 }}
              onClick={() => onSelectKin(kin)}
              className="absolute group cursor-pointer"
            >
              <div className="relative">
                {/* Aura Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{ backgroundColor: kin.auraColor }}
                />
                
                {/* Avatar */}
                <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/10 glass p-1">
                  <img 
                    src={kin.avatar} 
                    alt={kin.name} 
                    className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Status Wave */}
                {kin.status !== 'idle' && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: kin.status === 'thinking' ? [4, 12, 4] : [4, 8, 4],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="w-1 bg-teal-calm/50 rounded-full"
                      />
                    ))}
                  </div>
                )}

                {/* Name Label */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  <span className="text-xs font-medium uppercase tracking-widest text-teal-calm bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-teal-calm/20">
                    {kin.name} • {kin.role}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="absolute -right-4 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditKin(kin);
                    }}
                    className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-teal-calm hover:border-teal-calm/30 transition-all"
                    title="Edit Kin"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete ${kin.name}?`)) {
                        onDeleteKin(kin.id);
                      }
                    }}
                    className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-all"
                    title="Delete Kin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Center: Aura Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center z-10"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-teal-calm rounded-full blur-3xl -m-10"
            />
            <div className="text-[10px] uppercase tracking-[0.3em] text-teal-calm/60 font-bold">
              Sanctuary Active
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
