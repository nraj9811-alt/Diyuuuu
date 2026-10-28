import React, { useState } from 'react';
import { Heart, Sparkles, Eye, Smile, Shield, Coffee, RotateCcw } from 'lucide-react';
import { AppreciationCard } from '../types';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';

interface AppreciationCardsProps {
  cards: AppreciationCard[];
  recipientNickname: string;
}

export const AppreciationCards: React.FC<AppreciationCardsProps> = ({
  cards,
  recipientNickname,
}) => {
  const { logAction } = useTheme();
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});

  const getCardIcon = (iconName: string) => {
    switch (iconName) {
      case 'eye': return Eye;
      case 'smile': return Smile;
      case 'shield': return Shield;
      case 'sparkles': return Sparkles;
      case 'coffee': return Coffee;
      default: return Heart;
    }
  };

  const handleToggleFlip = (id: string, title: string) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    soundManager.playComfortChime('heart');
    logAction('interaction_click', 'Appreciation', `Flipped appreciation card: ${title}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B8A8D9]">
          <Heart className="w-3.5 h-3.5" />
          <span>Little Things I Appreciate</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF8]">
          Reasons Why You Are Cherished, {recipientNickname} 💜
        </h1>
        <p className="text-sm sm:text-base text-[#A7B7A0] max-w-xl mx-auto font-body">
          Woh chhoti chhoti khoobiyan jo aapko unique aur pyara banati hain. Kisi bhi card par click karke read kijiye.
        </p>
      </div>

      {/* Cards Grid with interactive flip/reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = getCardIcon(card.icon);
          const isFlipped = Boolean(flippedIds[card.id]);

          return (
            <div
              key={card.id}
              onClick={() => handleToggleFlip(card.id, card.title)}
              className="cursor-pointer group perspective-1000 min-h-[220px]"
            >
              <div
                className={`relative w-full h-full p-6 sm:p-7 rounded-3xl border transition-all duration-500 shadow-md flex flex-col justify-between ${
                  isFlipped
                    ? 'bg-gradient-to-br from-[#231A38] to-[#173B32] border-[#B8A8D9]/50 shadow-xl'
                    : 'bg-gradient-to-br from-[#173B32] to-[#122E27] border-[#B8A8D9]/20 hover:border-[#B8A8D9]/40 hover:shadow-lg'
                }`}
              >
                {/* Card Front vs Back content */}
                {!isFlipped ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/25 flex items-center justify-center text-[#B8A8D9] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8] group-hover:text-[#B8A8D9] transition-colors">
                      {card.title}
                    </h3>

                    <p className="text-xs text-[#A7B7A0] font-body">
                      Tap to reveal what your Sir jiii appreciates...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between text-xs text-[#B8A8D9]">
                      <span className="font-serif italic font-semibold">{card.title}</span>
                      <RotateCcw className="w-3.5 h-3.5 text-[#A7B7A0]" />
                    </div>

                    <p className="text-sm sm:text-base text-[#F6F1E8] font-body leading-relaxed italic">
                      "{card.message}"
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-[#B8A8D9]/15 flex items-center justify-between text-xs text-[#A7B7A0]">
                  <span>{isFlipped ? 'Tap to flip back' : 'Flip card'}</span>
                  <span className="text-[#B8A8D9]">{isFlipped ? '💜' : '✨'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
