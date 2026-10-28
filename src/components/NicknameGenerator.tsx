import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Dices, ArrowLeft, Copy, Check, Heart, Trophy, Smile, RefreshCw } from 'lucide-react';
import { NicknameItem } from '../types';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface NicknameGeneratorProps {
  nicknames: NicknameItem[];
  currentActiveNickname: string;
  onSetNickname: (name: string) => void;
  onReturn: () => void;
}

// 30+ purely Divya nicknames (strictly nicknames Nishant calls Divya)
const defaultDivyaNicknames: NicknameItem[] = [
  { name: 'Beendani ji', meaning: 'Aapka dramatic aur royal avatar! Jab aap full attitude dikhate ho.' },
  { name: 'Madam Ji', meaning: 'Jab aap boss ban kar order dete ho aur sabko chup-chaap sunna padta hai!' },
  { name: 'bbg', meaning: 'The sweetest, coolest baby girl in the entire universe.' },
  { name: 'Babyyyyy', meaning: 'Pure softness, innocence aur endless cuteness with extra y\'s.' },
  { name: 'My gurllll', meaning: 'Nishant ka sabse bada pride, favourite insaan aur soulmate.' },
  { name: 'Diyuuuu', meaning: 'Aapki aatma ka sabse pyara, sachha aur sukoon bhara naam.' },
  { name: 'Bauni', meaning: 'Chhotu si height par 1000% badmashi aur cute nakhre!' },
  { name: 'Butki', meaning: 'Pocket-sized cute aafat jo gusse mein aur bhi pyare lagte ho.' },
  { name: 'Chhoti Si Jaan', meaning: 'Nishant ki poori duniya ek chhotu si cute jaan mein basi hai.' },
  { name: 'Chhotu Master', meaning: 'Sabko gyaan dene wale aur bossing karne wale cute teacher.' },
  { name: 'Drama Queen ji', meaning: 'Oscar-winning daily expressions, cute pout aur drama!' },
  { name: 'Golgappa Queen', meaning: 'Chhoti si baat par teekhe, par andar se bohot saare meethe.' },
  { name: 'Rasmalai', meaning: 'Ekdam soft, tender aur extra sweet personality.' },
  { name: 'Patakha Kudi', meaning: 'Full energy, sparkle aur explosive smile!' },
  { name: 'Teddy Bear', meaning: 'Duniya ki sabse cuddleable aur squishy insaan.' },
  { name: 'Nakhrewali', meaning: 'Jinke nakhre uthana sirf Nishant ka favourite kaam hai.' },
  { name: 'Mhari Beendani', meaning: 'Traditional Rajasthani warmth, prem aur royal haq.' },
  { name: 'Billi Ji', meaning: 'Pehle meow karke cuteness, fir bhookh lagte hi gussa!' },
  { name: 'Shona Babu', meaning: 'Bina kisi shart ke bohot saara pyaar aur laad.' },
  { name: 'Cutie Pie', meaning: 'Aisi muskaan jo cloudy se cloudy din ko roshan kar de.' },
  { name: 'Paglu', meaning: 'Cute pagalpanti jo sirf Nishant ke saamne aati hai.' },
  { name: 'Guddu', meaning: 'Small kid energy, innocent aankhein aur pyari baatein.' },
  { name: 'Laddoo', meaning: 'Gol-matol cute gaal jin par chumi lene ka mann kare.' },
  { name: 'Motu Ji', meaning: 'Pouty cheeks jab aap naraz hone ki koshish karte ho.' },
  { name: 'Pocket Dynamo', meaning: 'Chhoti si size mein unlimited power, energy aur pyaar.' },
  { name: 'Sunshine', meaning: 'Har badal ke peeche se nikalne wali khoobsurat roshni.' },
  { name: 'Meri Duniya', meaning: 'Jinke bina sab kuch aadha aur adhura lagta hai.' },
  { name: 'Pari', meaning: 'Aap sach mein asmaan se gira ek chamakta tara lagte ho.' },
  { name: 'Tikhi Mirchi', meaning: 'Gussa 2 second ka, par cute lagte ho 24 ghante.' },
  { name: 'Gudiya', meaning: 'Bohot delicate, keemti aur sambhal kar rakhne wali.' },
  { name: 'Haseena Ji', meaning: 'Royal treatment aur timeless khoobsurti.' },
  { name: 'Sweetu', meaning: 'Jinki ek muskaan se saari thakan door ho jati hai.' },
];

export const NicknameGenerator: React.FC<NicknameGeneratorProps> = ({
  nicknames: propNicknames,
  currentActiveNickname,
  onSetNickname,
  onReturn,
}) => {
  const { logAction } = useTheme();

  // Combine prop nicknames and extensive default Divya nicknames ensuring all are Divya-oriented
  const fullList = propNicknames && propNicknames.length > 5
    ? defaultDivyaNicknames
    : defaultDivyaNicknames;

  // Non-repeating index pool (Fisher-Yates shuffle queue)
  const remainingPoolRef = useRef<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);
  const [history, setHistory] = useState<NicknameItem[]>([]);

  // Initialize pool
  useEffect(() => {
    resetAndShufflePool();
  }, [fullList.length]);

  const resetAndShufflePool = () => {
    const indices = Array.from({ length: fullList.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    remainingPoolRef.current = indices;
  };

  const getNextNonRepeatingIndex = (): number => {
    if (remainingPoolRef.current.length === 0) {
      resetAndShufflePool();
    }
    const nextIdx = remainingPoolRef.current.pop() ?? 0;
    return nextIdx;
  };

  const activeNick = fullList[selectedIndex] || fullList[0];

  const handleRollNickname = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setCopied(false);
    setApplied(false);
    soundManager.playComfortChime('star');

    // Rapid shuffle animation before landing on guaranteed non-repeated target
    const targetIndex = getNextNonRepeatingIndex();

    let count = 0;
    const interval = setInterval(() => {
      setSelectedIndex(Math.floor(Math.random() * fullList.length));
      count++;
      if (count > 12) {
        clearInterval(interval);
        setSelectedIndex(targetIndex);
        setIsSpinning(false);
        soundManager.playComfortChime('success');
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });

        const landed = fullList[targetIndex];
        setHistory((prev) => [landed, ...prev.filter((item) => item.name !== landed.name)].slice(0, 8));
        logAction('nickname_roll', landed.name, 'Rolled non-repeating nickname');
      }
    }, 70);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNick.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyAsActive = () => {
    onSetNickname(activeNick.name);
    setApplied(true);
    soundManager.playComfortChime('star');
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-body">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8A8D9]/20 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturn}
            className="p-2.5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/30 text-[#FFFDF8] hover:bg-[#122A23] transition-colors"
            title="Wapas Room Jayein"
          >
            <ArrowLeft className="w-5 h-5 text-[#B8A8D9]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎰✨</span>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Diyuuuu Nickname Slot Machine
              </h1>
            </div>
            <p className="text-xs text-[#A7B7A0] mt-0.5">
              30+ sweet, teasing & royal nicknames strictly for Divya (guaranteed non-repeating rolls)
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs text-[#B8A8D9] flex items-center gap-2 self-start sm:self-auto">
          <span>Active Name on Site:</span>
          <span className="font-bold text-[#FFFDF8]">{currentActiveNickname}</span>
        </div>
      </div>

      {/* Main Slot Machine Box */}
      <div className="relative max-w-xl mx-auto rounded-3xl bg-gradient-to-b from-[#173B32] to-[#102A25] border-2 border-[#B8A8D9]/40 p-7 sm:p-10 shadow-2xl space-y-6 text-center overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#E8B878]/15 blur-2xl pointer-events-none" />

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-[#E8B878] uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guaranteed Non-Repeating Generator</span>
          </span>
          <p className="text-xs text-[#A7B7A0]">
            Roll kijiye taaki har baar ek naya Divya ka nickname unlock ho:
          </p>
        </div>

        {/* Slot Display Box */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-[#0E221E] border border-[#B8A8D9]/30 shadow-inner flex flex-col items-center justify-center min-h-[160px] transition-all">
          <div
            className={`font-serif-title text-3xl sm:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF8] via-[#E8B878] to-[#B8A8D9] ${
              isSpinning ? 'blur-xs scale-95 opacity-70' : 'scale-100 opacity-100 animate-scale-up'
            }`}
          >
            "{activeNick.name}"
          </div>

          <p
            className={`text-xs sm:text-sm text-[#A7B7A0] max-w-md mx-auto mt-3 font-body leading-relaxed ${
              isSpinning ? 'opacity-30' : 'opacity-100'
            }`}
          >
            {activeNick.meaning}
          </p>

          <span className="absolute bottom-2 right-3 text-[10px] text-[#A7B7A0]/60">
            Pool: {fullList.length} unique names
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRollNickname}
            disabled={isSpinning}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-sm shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Dices className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning Names...' : 'Spin New Nickname 🎰'}</span>
          </button>

          <button
            onClick={handleApplyAsActive}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/40 text-xs sm:text-sm font-semibold text-[#FFFDF8] hover:bg-[#122A23] transition-all flex items-center justify-center gap-2"
          >
            {applied ? <Check className="w-4 h-4 text-emerald-400" /> : <Heart className="w-4 h-4 text-rose-300" />}
            <span>{applied ? 'Active on site! ✅' : 'Set as Active Name on Site'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/40 text-xs text-[#A7B7A0] hover:text-[#FFFDF8] transition-all flex items-center justify-center gap-1.5"
            title="Copy nickname text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Recently Unlocked Nicknames Drawer */}
      {history.length > 0 && (
        <div className="p-5 rounded-3xl bg-[#173B32]/60 border border-[#B8A8D9]/20 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#B8A8D9] font-semibold">
            <span>Recently Rolled for Divya:</span>
            <span className="text-[11px] text-[#A7B7A0]">Click any to make active</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((nick) => (
              <button
                key={nick.name}
                onClick={() => {
                  const idx = fullList.findIndex((n) => n.name === nick.name);
                  if (idx !== -1) setSelectedIndex(idx);
                  onSetNickname(nick.name);
                  soundManager.playComfortChime('star');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                  currentActiveNickname === nick.name
                    ? 'bg-[#B8A8D9] text-[#102A25] font-bold shadow'
                    : 'bg-[#102A25] border border-[#B8A8D9]/20 text-[#F6F1E8] hover:border-[#B8A8D9]/50'
                }`}
              >
                <span>✨</span>
                <span>{nick.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
