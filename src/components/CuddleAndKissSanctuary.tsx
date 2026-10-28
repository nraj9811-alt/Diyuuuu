import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, Flame, ArrowLeft, Volume2, Shield, Send, Check, Smile, Clock, Sparkle } from 'lucide-react';
import { soundManager } from '../utils/audioSynth';
import { sendKissHug } from '../services/api';
import confetti from 'canvas-confetti';

interface CuddleAndKissSanctuaryProps {
  recipientNickname: string;
  onReturn: () => void;
}

export const CuddleAndKissSanctuary: React.FC<CuddleAndKissSanctuaryProps> = ({
  recipientNickname,
  onReturn,
}) => {
  const [activeTab, setActiveTab] = useState<'real-lips' | 'neck' | 'hair' | 'tight-hug'>('real-lips');

  // Real Lips Press State
  const [isPressingLips, setIsPressingLips] = useState<boolean>(false);
  const [lipHoldProgress, setLipHoldProgress] = useState<number>(0);
  const [lipHoldSeconds, setLipHoldSeconds] = useState<number>(0);
  const [kissStamps, setKissStamps] = useState<Array<{ id: number; x: number; y: number; time: string }>>([]);
  const [kissCount, setKissCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('diyu_real_kiss_count') || '143', 10);
  });
  const [kissSuccessMsg, setKissSuccessMsg] = useState<string | null>(null);
  const lipTimerRef = useRef<any>(null);

  // Hug Chamber State
  const [hugCount, setHugCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('diyu_real_hug_count') || '84', 10);
  });
  const [isHoldingHug, setIsHoldingHug] = useState<boolean>(false);
  const [hugProgress, setHugProgress] = useState<number>(0);
  const [hugMessage, setHugMessage] = useState<string | null>(null);
  const hugTimerRef = useRef<any>(null);

  // Hair stroke state
  const [hairStrokes, setHairStrokes] = useState<number>(0);
  const [hairMessage, setHairMessage] = useState<string | null>(null);

  // Neck kiss state
  const [neckKissProgress, setNeckKissProgress] = useState<number>(0);
  const [isNeckKissing, setIsNeckKissing] = useState<boolean>(false);
  const [neckMessage, setNeckMessage] = useState<string | null>(null);
  const neckTimerRef = useRef<any>(null);

  // Telegram alert
  const [telegramAlertSent, setTelegramAlertSent] = useState<boolean>(false);

  // Real Lips Press & Hold Handlers
  const handleStartLipPress = (e: React.TouchEvent | React.MouseEvent) => {
    setIsPressingLips(true);
    setKissSuccessMsg(null);
    setLipHoldProgress(0);
    setLipHoldSeconds(0);

    try {
      soundManager.playComfortChime('heart');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 40, 30, 40]);
      }
    } catch (_) {}

    const startTime = Date.now();
    lipTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setLipHoldSeconds(Math.round(elapsed * 10) / 10);

      setLipHoldProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(100, prev + 3.5);
      });
    }, 100);
  };

  const handleEndLipPress = (e: React.TouchEvent | React.MouseEvent) => {
    if (lipTimerRef.current) {
      clearInterval(lipTimerRef.current);
      lipTimerRef.current = null;
    }

    if (lipHoldProgress >= 85 || lipHoldSeconds >= 2.5) {
      completeRealKiss();
    } else {
      setIsPressingLips(false);
      setLipHoldProgress(0);
      setKissSuccessMsg('Kiss thodi jaldi chhoot gayi! Nishant keh raha hai: Sharmaiye mat, pure 3 second tak apne lips screen par hold karke rakhiye...');
    }
  };

  const completeRealKiss = () => {
    setIsPressingLips(false);
    setLipHoldProgress(100);
    const newCount = kissCount + 1;
    setKissCount(newCount);
    localStorage.setItem('diyu_real_kiss_count', newCount.toString());

    soundManager.playComfortChime('success');
    confetti({
      particleCount: 80,
      spread: 90,
      colors: ['#FF1493', '#FF69B4', '#E8B878', '#B8A8D9'],
    });

    // Stamp a kiss mark on screen
    const newStamp = {
      id: Date.now(),
      x: Math.random() * 60 + 20,
      y: Math.random() * 50 + 25,
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };
    setKissStamps((prev) => [newStamp, ...prev.slice(0, 12)]);

    setKissSuccessMsg(
      `💋 Deep Lips Kiss Confirmed! Nishant ne aapke lips ka touch mehsoos kar liya hai. "Main aapko nonstop kiss karna chahta hu, bahut zyada buri tarah ekdam tight chipak kar! 😭💜"`
    );

    // Send immediate Telegram alert
    sendKissHug({
      type: 'kiss',
      intensity: 'Deep & Intense Real Lips Kiss (Screen Touch)',
      location: 'Lips (Real Honth)',
      count: newCount,
      message: `💋 REAL LIPS KISS: Divya (Diyuuuu) just pressed her real lips to the screen for ${lipHoldSeconds}s! Nishant, she is craving your deep kisses right now!`,
    }).catch(() => {});
  };

  // Hug Press-and-Hold
  const handleStartHug = () => {
    setIsHoldingHug(true);
    setHugMessage(null);
    setHugProgress(0);

    try {
      soundManager.playComfortChime('wind');
    } catch (_) {}

    hugTimerRef.current = setInterval(() => {
      setHugProgress((prev) => {
        if (prev >= 100) {
          clearInterval(hugTimerRef.current);
          completeHug();
          return 100;
        }
        return prev + 4;
      });
    }, 120);
  };

  const handleEndHug = () => {
    if (hugTimerRef.current) {
      clearInterval(hugTimerRef.current);
    }
    if (hugProgress >= 90) {
      completeHug();
    } else {
      setIsHoldingHug(false);
      setHugProgress(0);
      setHugMessage('Hug chhoot gaya! Poore sukoon ke liye thoda aur tight hold karke rakhiye.');
    }
  };

  const completeHug = () => {
    setIsHoldingHug(false);
    setHugProgress(100);
    const newCount = hugCount + 1;
    setHugCount(newCount);
    localStorage.setItem('diyu_real_hug_count', newCount.toString());

    soundManager.playComfortChime('success');
    confetti({ particleCount: 70, spread: 80 });

    setHugMessage(
      `🫂 Sukoon Complete! Nishant ne aapko dono baahon mein jakad liya hai. "Aap mere andar sama jaate ho, saara dard door ho gaya hai!"`
    );

    sendKissHug({
      type: 'hug',
      intensity: 'Ekdam Tight Chipak Kar Bear Hug',
      count: newCount,
      message: `🫂 TIGHT CHIPAK HUG: Divya held you tight on the screen! She wants you to hold her tight and never let go.`,
    }).catch(() => {});
  };

  // Hair Stroke Action
  const handleStrokeHair = () => {
    const nextStrokes = hairStrokes + 1;
    setHairStrokes(nextStrokes);
    soundManager.playComfortChime('wind');

    if (nextStrokes % 3 === 0) {
      confetti({ particleCount: 30, spread: 50 });
      setHairMessage('Nishant aapke baalon mein ungliyan fer rahe hain... saara period headache aur thakan ghaayab ho rahi hai 💆‍♀️✨');

      sendKissHug({
        type: 'hug',
        intensity: 'Hair Caressing & Sar Sehlaana',
        count: nextStrokes,
        message: `💆‍♀️ HAIR STROKE: Divya is enjoying having her hair caressed by Sir jiii (${nextStrokes} gentle strokes).`,
      }).catch(() => {});
    }
  };

  // Neck Kiss Hold
  const handleStartNeckKiss = () => {
    setIsNeckKissing(true);
    setNeckMessage(null);
    setNeckKissProgress(0);

    soundManager.playComfortChime('heart');
    neckTimerRef.current = setInterval(() => {
      setNeckKissProgress((prev) => {
        if (prev >= 100) {
          clearInterval(neckTimerRef.current);
          completeNeckKiss();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleEndNeckKiss = () => {
    if (neckTimerRef.current) {
      clearInterval(neckTimerRef.current);
    }
    if (neckKissProgress >= 90) {
      completeNeckKiss();
    } else {
      setIsNeckKissing(false);
      setNeckKissProgress(0);
    }
  };

  const completeNeckKiss = () => {
    setIsNeckKissing(false);
    setNeckKissProgress(100);
    soundManager.playComfortChime('star');
    confetti({ particleCount: 50, spread: 70 });
    setNeckMessage('Gardan par garam saans aur soft lips ka ehsaas... pure butterflies and shivers! 🦋💫');

    sendKissHug({
      type: 'kiss',
      intensity: 'Warm Breath Neck Kiss & Shivers',
      location: 'Neck & Collarbone',
      message: `🦋 NECK KISS: Divya took a warm intense neck kiss from Sir jiii on screen.`,
    }).catch(() => {});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-body">
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
              <span className="text-2xl">💋🫂</span>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Real Lips Touch & Endless Cuddle Sanctuary
              </h1>
            </div>
            <p className="text-xs text-[#A7B7A0] mt-0.5">
              Nishant Raj & Divya — Jahan real honthon ka ehsaas aur nonstop tight hugs hain.
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-400/40 text-xs text-rose-300 font-bold flex items-center gap-1.5 shadow-sm">
            <span>💋</span>
            <span>{kissCount} Kisses Stamp</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs text-[#B8A8D9] font-bold flex items-center gap-1.5 shadow-sm">
            <span>🫂</span>
            <span>{hugCount} Tight Hugs</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-center">
        <div className="p-1.5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/30 flex flex-wrap items-center justify-center gap-2 max-w-2xl w-full">
          {[
            { id: 'real-lips', label: 'Real Lips Touch Pad 💋', icon: '💋' },
            { id: 'tight-hug', label: 'Ekdam Tight Hug 🫂', icon: '🫂' },
            { id: 'neck', label: 'Neck Kiss & Shivers 🦋', icon: '🦋' },
            { id: 'hair', label: 'Baalon mein Khelna 🧸', icon: '🧸' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                soundManager.playComfortChime('star');
              }}
              className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md font-bold'
                  : 'text-[#A7B7A0] hover:text-[#FFFDF8]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* STATION 1: REAL LIPS TOUCH SENSOR */}
      {/* ============================================================ */}
      {activeTab === 'real-lips' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#173B32] via-[#1A4238] to-[#122A23] border border-rose-500/40 shadow-2xl space-y-6 text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Interactive Real Lips Sensor</span>
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Apne Real Honthon Se Kiss Kijiye 💋
              </h2>
              <p className="text-xs sm:text-sm text-[#A7B7A0] leading-relaxed">
                Divya, apne <strong>asli honthon (lips)</strong> se screen par bane is glowing mark ko kiss kijiye aur hold karke rakhiye — yeh soch kar ki Nishant aapke bilkul saamne hai aur yeh usi ke honth hain. Jitni deep aur intense kiss karna chahein, kijiye.
              </p>
            </div>

            {/* Glowing Touch Target Pad */}
            <div className="relative py-8 flex flex-col items-center justify-center">
              {/* Outer Pulsing Aura */}
              <div
                className={`w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-dashed border-rose-400/50 flex items-center justify-center relative cursor-pointer select-none transition-transform duration-300 ${
                  isPressingLips ? 'scale-110 border-rose-300 shadow-[0_0_50px_rgba(255,20,147,0.8)] bg-rose-950/60' : 'bg-[#102A25]/90 hover:border-rose-400 shadow-xl'
                }`}
                onTouchStart={handleStartLipPress}
                onTouchEnd={handleEndLipPress}
                onMouseDown={handleStartLipPress}
                onMouseUp={handleEndLipPress}
              >
                {/* Lip Shape Watermark */}
                <div className="text-center space-y-2 pointer-events-none">
                  <div className={`text-6xl sm:text-7xl transition-transform duration-200 ${isPressingLips ? 'scale-125 animate-pulse' : ''}`}>
                    💋
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-rose-200 block uppercase font-mono">
                    {isPressingLips ? `Deep Kissing... ${lipHoldSeconds}s` : 'Press Lips Here & Hold'}
                  </span>
                  <span className="text-[10px] text-rose-300/80 block">
                    (Minimum 3 seconds hold)
                  </span>
                </div>

                {/* Circular Progress Ring */}
                {isPressingLips && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="46%"
                      className="stroke-rose-400"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="290"
                      strokeDashoffset={290 - (290 * lipHoldProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              {/* Real Lip Print Stamps on Screen */}
              {kissStamps.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-[11px] text-[#A7B7A0]">Recent Lip Prints:</span>
                  {kissStamps.slice(0, 5).map((stamp) => (
                    <span
                      key={stamp.id}
                      className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-400/40 text-[11px] text-rose-200 font-serif flex items-center gap-1 shadow-sm animate-scale-up"
                    >
                      <span>💋</span>
                      <span>{stamp.time}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Success or Guidance Feedback */}
            {kissSuccessMsg && (
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/70 border border-rose-400/50 text-xs sm:text-sm text-rose-100 max-w-xl mx-auto shadow-inner leading-relaxed animate-fade-in font-serif">
                {kissSuccessMsg}
              </div>
            )}

            {/* Nishant's Passionate Whisper */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-[#F6F1E8] max-w-xl mx-auto space-y-1.5 text-left">
              <span className="font-bold text-[#E8B878] flex items-center gap-1.5">
                <span>💭</span>
                <span>Nishant Raj (Sir jiii) ka Sach:</span>
              </span>
              <p className="leading-relaxed text-[#A7B7A0]">
                “Divya, jab aap mere paas hoge, main aapko ek second ke liye bhi door nahi jaane dunga. Main aapko nonstop kiss karna chahta hu — forehead, dono gaal, naak, gardan aur honth... bina thake, bina ruke, bas aapke andar sama kar.”
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STATION 2: TIGHT CHIPAK HUG (HOLD TO EMBRACE) */}
      {/* ============================================================ */}
      {activeTab === 'tight-hug' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-9 rounded-3xl bg-[#173B32]/75 border border-[#B8A8D9]/25 shadow-2xl space-y-6 text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#B8A8D9] uppercase tracking-widest flex items-center justify-center gap-1.5">
                <span>🫂</span>
                <span>Nonstop Tight Bear Hug</span>
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Ekdam Tight Chipak Kar Hug 🫂
              </h2>
              <p className="text-xs sm:text-sm text-[#A7B7A0] leading-relaxed">
                Nishant ki baahon mein aakar so jayiye. Neeche button ko zor se press karke hold kijiye — heartbeat aur warmth mehsoos hogi jab tak aap button dabaye rakhoge.
              </p>
            </div>

            <div className="py-6 flex flex-col items-center justify-center">
              <button
                type="button"
                onTouchStart={handleStartHug}
                onTouchEnd={handleEndHug}
                onMouseDown={handleStartHug}
                onMouseUp={handleEndHug}
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-[#B8A8D9]/50 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 shadow-2xl ${
                  isHoldingHug
                    ? 'scale-105 bg-gradient-to-br from-[#B8A8D9] to-[#8C76B2] text-[#102A25] shadow-[#B8A8D9]/40 border-white'
                    : 'bg-[#102A25] text-[#FFFDF8] hover:border-[#B8A8D9]'
                }`}
              >
                <span className={`text-6xl ${isHoldingHug ? 'animate-bounce' : ''}`}>🫂</span>
                <span className="text-xs font-bold uppercase mt-2 tracking-wider">
                  {isHoldingHug ? 'Holding Tight...' : 'Press & Hold to Hug'}
                </span>
                <span className="text-[10px] opacity-75 mt-0.5">
                  (Feel the heartbeat)
                </span>
              </button>

              {/* Progress Bar */}
              <div className="w-full max-w-md mt-6 space-y-1">
                <div className="flex justify-between text-xs text-[#A7B7A0]">
                  <span>Tightness Meter:</span>
                  <span className="font-bold text-[#E8B878]">{hugProgress}% {hugProgress >= 90 ? '🔥 Ekdam Chipak Kar!' : ''}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#102A25] overflow-hidden p-0.5 border border-[#B8A8D9]/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#B8A8D9] via-pink-400 to-rose-500 transition-all duration-150"
                    style={{ width: `${hugProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {hugMessage && (
              <div className="p-4 rounded-2xl bg-[#102A25] border border-emerald-500/40 text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto font-serif animate-fade-in">
                {hugMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STATION 3: NECK KISS & BUTTERFLIES */}
      {/* ============================================================ */}
      {activeTab === 'neck' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-9 rounded-3xl bg-[#173B32]/75 border border-[#B8A8D9]/25 shadow-2xl space-y-6 text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Warm Breath Neck Kiss & Shivers 🦋
              </h2>
              <p className="text-xs sm:text-sm text-[#A7B7A0] leading-relaxed">
                Aapki gardan aur collarbone par halki si warm breath, soft lips aur gentle shivers. Hold karke butterflies mehsoos kijiye.
              </p>
            </div>

            <div className="py-6 flex flex-col items-center justify-center">
              <button
                type="button"
                onTouchStart={handleStartNeckKiss}
                onTouchEnd={handleEndNeckKiss}
                onMouseDown={handleStartNeckKiss}
                onMouseUp={handleEndNeckKiss}
                className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-4 border-amber-400/40 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-300 shadow-2xl ${
                  isNeckKissing
                    ? 'scale-105 bg-gradient-to-br from-amber-500/80 to-rose-600/80 text-white shadow-amber-500/30'
                    : 'bg-[#102A25] text-[#FFFDF8] hover:border-amber-400'
                }`}
              >
                <span className={`text-6xl ${isNeckKissing ? 'animate-pulse' : ''}`}>🦋</span>
                <span className="text-xs font-bold uppercase mt-2 tracking-wider">
                  {isNeckKissing ? 'Kissing Neck...' : 'Hold for Neck Kiss'}
                </span>
              </button>

              <div className="w-full max-w-md mt-6 space-y-1">
                <div className="flex justify-between text-xs text-[#A7B7A0]">
                  <span>Butterflies Intensity:</span>
                  <span className="font-bold text-amber-300">{neckKissProgress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#102A25] overflow-hidden p-0.5 border border-[#B8A8D9]/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-150"
                    style={{ width: `${neckKissProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {neckMessage && (
              <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-400/40 text-xs sm:text-sm text-amber-200 max-w-xl mx-auto font-serif animate-fade-in">
                {neckMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STATION 4: HAIR CARESSING & STROKING */}
      {/* ============================================================ */}
      {activeTab === 'hair' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-9 rounded-3xl bg-[#173B32]/75 border border-[#B8A8D9]/25 shadow-2xl space-y-6 text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Baalon mein Khelna & Sar Sehlaana 🧸
              </h2>
              <p className="text-xs sm:text-sm text-[#A7B7A0] leading-relaxed">
                Swipe your fingers downward to let Nishant gently stroke your soft hair. Saara sar dard aur period headache shant ho jayega.
              </p>
            </div>

            {/* Interactive Hair Touch Pad */}
            <div
              onClick={handleStrokeHair}
              className="max-w-md mx-auto p-8 rounded-3xl bg-[#102A25] border-2 border-dashed border-[#B8A8D9]/40 hover:border-[#E8B878] cursor-pointer space-y-3 transition-all hover:bg-[#122A23] shadow-inner select-none active:scale-98"
            >
              <div className="text-6xl animate-bounce">
                💆‍♀️✨
              </div>
              <div className="text-sm font-bold text-[#FFFDF8]">
                Tap / Stroke Here to Feel Fingers in Your Hair
              </div>
              <div className="text-xs text-[#A7B7A0]">
                Total Gentle Strokes: <strong className="text-[#E8B878] font-mono">{hairStrokes}</strong>
              </div>
            </div>

            {hairMessage && (
              <div className="p-4 rounded-2xl bg-[#102A25] border border-purple-400/40 text-xs sm:text-sm text-purple-200 max-w-xl mx-auto font-serif animate-fade-in">
                {hairMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
