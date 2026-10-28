import React, { useState } from 'react';
import { Sparkles, Dices, Send, Check } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';
import { shareUserResponse } from '../../services/api';

export const RomanticWheelOfWishes: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [sentToTg, setSentToTg] = useState<boolean>(false);

  const prizes = [
    { label: '100 Forehead Kisses 💋', color: '#FF4D6D', text: '#FFF' },
    { label: 'Unlimited Tight Cuddles 🫂', color: '#7209B7', text: '#FFF' },
    { label: 'Special Adrak Chai by Nishant ☕', color: '#E8B878', text: '#102A25' },
    { label: 'Whatever Diyuuuu Orders Today 👑', color: '#F72585', text: '#FFF' },
    { label: 'Head & Foot Massage 💆‍♀️', color: '#4CC9F0', text: '#102A25' },
    { label: 'Midnight Ice Cream 🍦', color: '#B8A8D9', text: '#102A25' },
    { label: 'Nonstop Kisses on Lips 💋', color: '#FF0054', text: '#FFF' },
    { label: "Sir jiii's Heart Forever 💖", color: '#FFB703', text: '#102A25' },
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setSentToTg(false);
    soundManager.playComfortChime('star');

    // Random extra spins (5 to 8 full rotations + slice offset)
    const sliceAngle = 360 / prizes.length;
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const targetRotation = rotation + extraSpins + (360 - (randomIndex * sliceAngle) - sliceAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonPrize = prizes[randomIndex].label;
      setWinner(wonPrize);
      soundManager.playComfortChime('success');
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });
    }, 4000);
  };

  const handleClaimWish = async () => {
    if (!winner) return;
    try {
      setSentToTg(true);
      await shareUserResponse(
        'ROMANTIC WHEEL OF WISHES',
        'Divya won a romantic wish on the Wheel:',
        `Divya spun the Romantic Wheel and won: "${winner}"! She is claiming this wish from you now! 🎡💜`
      );
      soundManager.playComfortChime('star');
    } catch (_) {
      setSentToTg(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#173B32] via-[#1A4238] to-[#122A23] border border-[#B8A8D9]/30 shadow-2xl space-y-6 text-center animate-fade-in font-body">
      <div className="space-y-1">
        <span className="text-xs font-bold text-[#E8B878] uppercase tracking-wider flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Romantic Wheel of Wishes</span>
        </span>
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
          Spin the Wheel of Love 🎡✨
        </h2>
        <p className="text-xs text-[#A7B7A0] max-w-md mx-auto">
          Divya, chakkar ghumaiye aur dekhiye Nishant Raj (Sir jiii) ki taraf se aaj aapko kaunsa special romantic prize milta hai!
        </p>
      </div>

      {/* The Spinning Wheel Canvas / SVG */}
      <div className="relative py-6 flex flex-col items-center justify-center">
        {/* Pointer Arrow on top */}
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 z-20 drop-shadow-md -mb-3" />

        {/* The Wheel */}
        <div
          className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#E8B878] shadow-[0_0_35px_rgba(232,184,120,0.3)] relative overflow-hidden flex items-center justify-center transition-transform duration-[4000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {prizes.map((p, idx) => {
            const angle = (360 / prizes.length) * idx;
            return (
              <div
                key={idx}
                className="absolute top-0 left-0 w-full h-full flex items-start justify-center pt-3"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '50% 50%',
                }}
              >
                <div
                  className="text-[10px] sm:text-xs font-bold tracking-tight px-1 py-0.5 rounded shadow-sm text-center"
                  style={{ color: p.text, backgroundColor: p.color }}
                >
                  {p.label}
                </div>
              </div>
            );
          })}

          {/* Center Hub */}
          <div className="w-16 h-16 rounded-full bg-[#102A25] border-4 border-[#E8B878] flex flex-col items-center justify-center shadow-2xl z-10">
            <span className="text-lg">💖</span>
            <span className="text-[8px] font-bold text-[#E8B878]">SPIN</span>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <div>
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#E8B878] to-[#FFB703] text-[#102A25] font-bold text-sm shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Spinning Wheel of Love...' : 'Spin the Wheel Now! 🎡'}</span>
        </button>
      </div>

      {/* Winner Display & Claim */}
      {winner && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/90 to-purple-950/90 border border-[#E8B878]/60 text-center space-y-3 max-w-md mx-auto shadow-xl animate-scale-up">
          <div className="text-xs font-bold text-[#E8B878] uppercase tracking-wider">
            🎉 Congratulations Diyuuuu! You Won:
          </div>
          <div className="font-serif-title text-xl font-bold text-white">
            {winner}
          </div>
          <p className="text-xs text-rose-200">
            Nishant Raj ko yeh prize har haal mein poora karna hoga! Claim button dabakar unke Telegram par order bhej dijiye:
          </p>

          <button
            type="button"
            onClick={handleClaimWish}
            disabled={sentToTg}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-all"
          >
            {sentToTg ? <Check className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4" />}
            <span>{sentToTg ? 'Order sent to Sir jiii on Telegram! ✅' : 'Claim from Sir jiii on Telegram 📲'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
