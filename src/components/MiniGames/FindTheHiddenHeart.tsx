import React, { useState } from 'react';
import { Heart, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';

interface HiddenItem {
  id: string;
  name: string;
  icon: string;
  isHeart: boolean;
  hint: string;
}

export const FindTheHiddenHeart: React.FC = () => {
  const { logAction } = useTheme();
  const [items, setItems] = useState<HiddenItem[]>([
    { id: '1', name: 'Velvet Cushion', icon: '🛋️', isHeart: false, hint: 'Bas ek soft sa cushion mila... dil yahan nahi hai!' },
    { id: '2', name: 'Steaming Kettle', icon: '🫖', isHeart: false, hint: 'Chai ban rahi hai... but keep looking!' },
    { id: '3', name: 'Handwritten Diary', icon: '📔', isHeart: false, hint: 'Kuch pyare thoughts likhe hain... but not the heart!' },
    { id: '4', name: 'Ceramic Bonsai Pot', icon: '🪴', isHeart: true, hint: 'Aapne dhoondh liya! Dil hamesha yahin tha 💜' },
    { id: '5', name: 'Brass Desk Clock', icon: '⏰', isHeart: false, hint: 'Waqt thoda ruk gaya hai... check somewhere else!' },
    { id: '6', name: 'Rainy Windowpane', icon: '🪟', isHeart: false, hint: 'Baahar boonda-baandi ho rahi hai... try again!' },
    { id: '7', name: 'Lavender Lamp', icon: '🏮', isHeart: false, hint: 'Halki roshni hai... but no heart!' },
    { id: '8', name: 'Cozy Woolen Blanket', icon: '🧶', isHeart: false, hint: 'Warmth mili... but heart is hiding elsewhere!' },
  ]);

  const [tappedIds, setTappedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('Tap an object in the cozy room to inspect it...');
  const [found, setFound] = useState<boolean>(false);

  const handleTapItem = (item: HiddenItem) => {
    if (found) return;
    if (!tappedIds.includes(item.id)) {
      setTappedIds((prev) => [...prev, item.id]);
    }

    setFeedback(item.hint);

    if (item.isHeart) {
      setFound(true);
      soundManager.playComfortChime('heart');
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      logAction('game_play', 'Find The Hidden Heart', 'Successfully found the hidden heart');
    } else {
      soundManager.playComfortChime('click');
    }
  };

  const handleRestart = () => {
    // Shuffle the heart location
    const randomIndex = Math.floor(Math.random() * items.length);
    const updated = items.map((it, idx) => ({
      ...it,
      isHeart: idx === randomIndex,
      hint: idx === randomIndex ? 'Aapne dhoondh liya! Dil hamesha yahin tha 💜' : it.hint,
    }));
    setItems(updated);
    setTappedIds([]);
    setFound(false);
    setFeedback('The heart has hidden somewhere new! Tap an object to start looking.');
    soundManager.playComfortChime('star');
  };

  return (
    <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/25 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8A8D9]/15 pb-4">
        <div>
          <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#B8A8D9]" />
            <span>Find the Hidden Heart 💜</span>
          </h2>
          <p className="text-xs text-[#A7B7A0]">
            Is cozy kamre ki kisi ek cheez ke peeche ek pyara sa dil chhupa hai. Dhoondhiye!
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="px-3.5 py-1.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-[#F6F1E8] flex items-center gap-1.5 hover:bg-[#1C453B]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {/* Feedback Banner */}
      <div
        className={`p-3.5 rounded-2xl text-xs sm:text-sm font-body text-center transition-all ${
          found
            ? 'bg-purple-950/70 border border-purple-400/50 text-[#D8CEEE] font-semibold'
            : 'bg-[#102A25] text-[#F6F1E8]'
        }`}
      >
        {feedback}
      </div>

      {/* Illustrated Objects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((item) => {
          const isTapped = tappedIds.includes(item.id);
          const isWinner = found && item.isHeart;

          return (
            <button
              key={item.id}
              onClick={() => handleTapItem(item)}
              disabled={found && !item.isHeart}
              className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9] ${
                isWinner
                  ? 'bg-gradient-to-br from-purple-900/60 to-[#102A25] border-[#B8A8D9] scale-105 shadow-xl animate-bounce'
                  : isTapped
                  ? 'bg-[#102A25]/50 border-[#B8A8D9]/10 opacity-70'
                  : 'bg-[#102A25] border-[#B8A8D9]/20 hover:border-[#B8A8D9]/50 hover:scale-102 hover:shadow-md'
              }`}
            >
              <span className="text-3xl select-none">{isWinner ? '💜' : item.icon}</span>
              <span className="text-xs font-semibold text-[#F6F1E8]">{item.name}</span>
              {isTapped && !isWinner && (
                <span className="text-[10px] text-[#A7B7A0]">Checked</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Win Celebration Box */}
      {found && (
        <div className="rounded-2xl bg-gradient-to-r from-[#231A38] to-[#173B32] border border-[#B8A8D9]/40 p-6 text-center space-y-3 animate-fade-in">
          <Sparkles className="w-8 h-8 text-[#B8A8D9] mx-auto animate-pulse" />
          <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
            Dil Mil Gaya! 💜
          </h3>
          <p className="text-xs sm:text-sm text-[#F6F1E8]/90 max-w-md mx-auto font-body">
            Yeh dil humesha aapke sukoon aur muskaan ke liye dhadakta hai. Aap chahein toh dobara khel sakti hain!
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] text-xs font-bold hover:bg-[#D8CEEE] transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
