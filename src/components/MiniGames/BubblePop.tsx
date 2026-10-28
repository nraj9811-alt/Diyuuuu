import React, { useState } from 'react';
import { Sparkles, RotateCcw, Heart, Smile } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

interface Bubble {
  id: number;
  popped: boolean;
  secretEmoji: string;
}

const cuteEmojis = ['💖', '🌸', '✨', '☕', '🍫', '🧸', '🐰', '☁️', '🍓', '🍯'];

export const BubblePop: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>(() => generateBubbles());
  const [totalPopped, setTotalPopped] = useState<number>(0);
  const [streakMessage, setStreakMessage] = useState<string | null>(null);

  function generateBubbles(): Bubble[] {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      popped: false,
      secretEmoji: cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)],
    }));
  }

  const handlePop = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => {
        if (b.id === id && !b.popped) {
          soundManager.playComfortChime('star');
          const nextCount = totalPopped + 1;
          setTotalPopped(nextCount);

          if (nextCount % 10 === 0) {
            confetti({ particleCount: 30, spread: 50 });
            setStreakMessage('Stress disappearing... Nishant loves your smile! 💜');
          }
          return { ...b, popped: true };
        }
        return b;
      })
    );
  };

  const handleResetSheet = () => {
    setBubbles(generateBubbles());
    setStreakMessage(null);
    soundManager.playComfortChime('wind');
  };

  const poppedCount = bubbles.filter((b) => b.popped).length;

  return (
    <div className="space-y-5 max-w-xl mx-auto font-body text-center">
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-[#A7B7A0]">
        <div className="flex items-center gap-1.5">
          <span>Bubbles Popped:</span>
          <span className="font-bold text-[#FFFDF8] font-serif-title text-base">{totalPopped}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Sheet Progress: {poppedCount} / 30</span>
          <button
            onClick={handleResetSheet}
            className="p-1.5 rounded-lg bg-[#173B32] text-[#FFFDF8] hover:bg-[#122A23] transition-colors flex items-center gap-1"
            title="Fresh bubble wrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Sheet</span>
          </button>
        </div>
      </div>

      {streakMessage && (
        <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-400/40 text-xs text-purple-200 animate-scale-up">
          {streakMessage}
        </div>
      )}

      {/* Bubble Wrap Grid */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#173B32] to-[#102A25] border-2 border-[#B8A8D9]/30 shadow-2xl">
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 sm:gap-4">
          {bubbles.map((b) => (
            <button
              key={b.id}
              onClick={() => handlePop(b.id)}
              disabled={b.popped}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all select-none cursor-pointer ${
                b.popped
                  ? 'bg-[#102A25]/90 border border-[#B8A8D9]/20 shadow-inner scale-90 opacity-60'
                  : 'bg-gradient-to-br from-[#B8A8D9]/40 via-[#8C76B2]/40 to-[#173B32] border-2 border-[#B8A8D9]/60 shadow-[0_4px_10px_rgba(184,168,217,0.2)] hover:scale-105 active:scale-95'
              }`}
            >
              {b.popped ? (
                <span className="text-base animate-scale-up">{b.secretEmoji}</span>
              ) : (
                <span className="w-3 h-3 rounded-full bg-white/20" />
              )}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[#A7B7A0]">
        Tap each bubble to pop stress and release calming pops! 🌸
      </p>
    </div>
  );
};
