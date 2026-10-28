import React, { useState } from 'react';
import { Flower2, Sparkles, Coffee, Leaf, Star, X, Heart, Shield } from 'lucide-react';
import { MemoryItem } from '../types';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';

interface MemoryGardenProps {
  memories: MemoryItem[];
  recipientNickname: string;
}

export const MemoryGarden: React.FC<MemoryGardenProps> = ({
  memories,
  recipientNickname,
}) => {
  const { logAction } = useTheme();
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  const getSymbolIcon = (sym: string) => {
    switch (sym) {
      case 'leaf': return Leaf;
      case 'coffee': return Coffee;
      case 'star': return Star;
      case 'plant': return Flower2;
      case 'heart': return Heart;
      default: return Sparkles;
    }
  };

  const handleOpenMemory = (mem: MemoryItem) => {
    setSelectedMemory(mem);
    soundManager.playComfortChime('star');
    logAction('interaction_click', 'Memory Garden', `Opened memory: ${mem.title}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B8A8D9]">
          <Flower2 className="w-3.5 h-3.5" />
          <span>Interactive Sanctuary</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF8]">
          Memory Garden for {recipientNickname} 🌿
        </h1>
        <p className="text-sm sm:text-base text-[#A7B7A0] max-w-xl mx-auto font-body">
          Chhoti yaadein, shanti bhare pal aur khoobsurat moments jo pedon ki tarah hamesha zinda rehte hain.
          Kisi bhi token par tap karke memory padhiye.
        </p>
      </div>

      {/* Interactive Garden Canvas / Grid */}
      {memories.length === 0 ? (
        <div className="text-center py-16 bg-[#173B32]/30 rounded-3xl border border-[#B8A8D9]/15 p-8">
          <p className="text-[#A7B7A0] text-sm">Garden mein abhi koi tokens plant nahi kiye gaye hain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {memories.map((mem) => {
            const Icon = getSymbolIcon(mem.symbol);
            return (
              <button
                key={mem.id}
                onClick={() => handleOpenMemory(mem)}
                className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#173B32] to-[#122E27] border border-[#B8A8D9]/20 hover:border-[#B8A8D9]/60 hover:shadow-xl transition-all text-left flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/25 flex items-center justify-center text-[#B8A8D9] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-[#A7B7A0] font-body">{mem.date}</span>
                  </div>

                  <span className="text-[11px] font-medium text-[#B8A8D9] tracking-wider uppercase font-body">
                    {mem.category}
                  </span>

                  <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8] group-hover:text-[#B8A8D9] transition-colors leading-snug">
                    {mem.title}
                  </h3>

                  <p className="text-sm text-[#F6F1E8]/85 font-body line-clamp-2 leading-relaxed">
                    {mem.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#B8A8D9]/10 flex items-center justify-between text-xs text-[#A7B7A0]">
                  <span>Tap to view reflection</span>
                  <span className="text-[#B8A8D9] group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-lg w-full p-8 rounded-3xl bg-[#173B32] border border-[#B8A8D9]/40 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedMemory(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#102A25] transition-colors"
              aria-label="Close memory modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 flex items-center justify-center text-[#B8A8D9]">
                {React.createElement(getSymbolIcon(selectedMemory.symbol), { className: 'w-6 h-6' })}
              </div>
              <div>
                <span className="text-xs text-[#B8A8D9] uppercase font-body font-semibold tracking-wider">
                  {selectedMemory.category}
                </span>
                <p className="text-xs text-[#A7B7A0]">{selectedMemory.date}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                {selectedMemory.title}
              </h2>
              <p className="text-base text-[#F6F1E8]/90 font-body leading-relaxed whitespace-pre-line">
                {selectedMemory.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#B8A8D9]/20 flex items-center justify-between">
              <span className="text-xs text-[#A7B7A0]">Cherished token from Nishant</span>
              <button
                onClick={() => setSelectedMemory(null)}
                className="px-5 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] font-semibold text-xs hover:bg-[#D8CEEE] transition-colors"
              >
                Close Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
