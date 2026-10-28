import React, { useState } from 'react';
import {
  Flame,
  Coffee,
  Heart,
  Sparkles,
  Bed,
  Cookie,
  ArrowLeft,
  CheckCircle2,
  Smile,
  Shield,
  Activity,
} from 'lucide-react';
import { PeriodCareDay5Data } from '../types';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface PeriodCareDay5Props {
  data: PeriodCareDay5Data;
  recipientNickname: string;
  onReturn: () => void;
}

export const PeriodCareDay5: React.FC<PeriodCareDay5Props> = ({
  data,
  recipientNickname,
  onReturn,
}) => {
  const { logAction } = useTheme();

  // Interactive Heat Pad state
  const [heatPadActive, setHeatPadActive] = useState<boolean>(false);
  const [heatPadTemp, setHeatPadTemp] = useState<'mild' | 'warm' | 'toasty'>('warm');

  // Interactive Chai Brewer
  const [chaiBrewed, setChaiBrewed] = useState<boolean>(false);
  const [chaiIngredients, setChaiIngredients] = useState<string[]>([]);

  // Chocolate Treat Dispenser
  const [currentTreat, setCurrentTreat] = useState<string | null>(null);

  const treats = [
    '🍫 Silk Hazelnut Dark Chocolate: "Aapka mood instantly fresh ho jaye!"',
    '🍪 Warm Cinnamon Oat Cookie: "Pait ke liye gentle aur dil ke liye sweet."',
    '☕ Kadak Adrak Wali Chai: "Dard aur thakan dono door bhaag jayein."',
    '🍓 Fresh Strawberries & Cream: "Light and refreshing treat just for you."',
    '🍯 Hot Turmeric Milk with Honey: "Body recovery ke liye sabse best."',
  ];

  const handleToggleHeatPad = () => {
    const next = !heatPadActive;
    setHeatPadActive(next);
    soundManager.playComfortChime(next ? 'star' : 'click');
    logAction('interaction_click', 'Period Care', next ? 'Turned on Heating Pad' : 'Turned off Heating Pad');
  };

  const handleAddChaiIngredient = (item: string) => {
    if (!chaiIngredients.includes(item)) {
      setChaiIngredients([...chaiIngredients, item]);
      soundManager.playComfortChime('click');
    }
  };

  const handleBrewChai = () => {
    setChaiBrewed(true);
    soundManager.playComfortChime('success');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    logAction('interaction_click', 'Period Care', 'Brewed virtual hot chai');
  };

  const handleDispenseTreat = () => {
    const random = treats[Math.floor(Math.random() * treats.length)];
    setCurrentTreat(random);
    soundManager.playComfortChime('heart');
    confetti({ particleCount: 35, spread: 45, origin: { y: 0.6 } });
    logAction('interaction_click', 'Period Care', 'Dispensed sweet treat');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReturn}
          className="px-4 py-2 rounded-xl bg-[#173B32] border border-[#B8A8D9]/25 text-xs sm:text-sm font-semibold text-[#FFFDF8] hover:bg-[#102A25] flex items-center gap-2 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#B8A8D9]" />
          <span>Wapas Cozy Room Jayein</span>
        </button>

        <span className="text-xs text-[#E8B878] font-semibold bg-[#173B32] px-3 py-1.5 rounded-full border border-[#E8B878]/30">
          Day 5 Special Recovery Care 🌸
        </span>
      </div>

      {/* Hero Period Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#2D1A29] via-[#1D2B24] to-[#142620] border-2 border-[#F4BAC8]/30 p-8 sm:p-12 shadow-2xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F4BAC8] bg-[#3D2230] px-4 py-1.5 rounded-full border border-[#F4BAC8]/30">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Day 5 of Period · The Recovery Phase</span>
        </div>

        <h1 className="font-serif-title text-3xl sm:text-5xl font-bold text-[#FFFDF8] leading-tight">
          Special Period Comfort Corner for {recipientNickname} 🌸🩸
        </h1>

        <p className="text-sm sm:text-base text-[#F6F1E8]/90 max-w-2xl mx-auto font-body leading-relaxed">
          {data.subtitle}
        </p>

        <p className="text-xs sm:text-sm text-[#A7B7A0] max-w-xl mx-auto font-body">
          {data.summary}
        </p>
      </div>

      {/* Interactive Care Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INTERACTION 1: VIRTUAL HEATING PAD / HOT WATER BAG */}
        <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/30 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-950/70 border border-rose-500/30 flex items-center justify-center text-xl">
                  🔥
                </div>
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8]">
                    Virtual Heating Pad / Hot Water Bag
                  </h3>
                  <span className="text-[11px] text-[#A7B7A0]">Lower belly aur back cramps ke liye</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#F6F1E8]/80 leading-relaxed font-body">
              Garam bag se muscles relax ho jaate hain aur cramps bohot kam ho jaate hain. Aap is button ko press karke gentle warmth activate karte ho:
            </p>

            {/* Heating Pad Visualizer */}
            <div
              className={`p-6 rounded-2xl border text-center transition-all duration-700 space-y-3 ${
                heatPadActive
                  ? heatPadTemp === 'toasty'
                    ? 'bg-gradient-to-r from-rose-950 to-amber-950 border-rose-400 shadow-xl shadow-rose-900/30 animate-pulse'
                    : 'bg-gradient-to-r from-amber-950/80 to-[#102A25] border-amber-400 shadow-lg'
                  : 'bg-[#102A25] border-[#B8A8D9]/15'
              }`}
            >
              <div className="text-4xl">
                {heatPadActive ? '♨️🧸' : '🧸'}
              </div>
              <p className="text-xs font-semibold text-[#FFFDF8]">
                {heatPadActive
                  ? `Soothing Warmth Active (${heatPadTemp.toUpperCase()} HEAT)`
                  : 'Heating pad is off. Tap below to turn on.'}
              </p>
              {heatPadActive && (
                <p className="text-[11px] text-[#F4BAC8] italic">
                  "Pait par rakh kar aaram se deep breath lijiye. Aap relaxed mehsoos karte ho."
                </p>
              )}
            </div>

            {/* Heat Levels */}
            {heatPadActive && (
              <div className="flex items-center justify-center gap-2 pt-1 text-xs">
                {(['mild', 'warm', 'toasty'] as const).map((temp) => (
                  <button
                    key={temp}
                    onClick={() => setHeatPadTemp(temp)}
                    className={`px-3 py-1 rounded-xl capitalize border ${
                      heatPadTemp === temp
                        ? 'bg-[#E8B878] text-[#102A25] border-[#E8B878] font-bold'
                        : 'bg-[#102A25] text-[#A7B7A0] border-[#B8A8D9]/15'
                    }`}
                  >
                    {temp}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleToggleHeatPad}
            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              heatPadActive
                ? 'bg-rose-950/80 border border-rose-500/50 text-rose-200 hover:bg-rose-900'
                : 'bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] hover:scale-101'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{heatPadActive ? 'Turn Off Warmth' : 'Turn On Warm Heating Pad ♨️'}</span>
          </button>
        </div>

        {/* INTERACTION 2: BREW FRESH GINGER & ELAICHI CHAI */}
        <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/30 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-xl">
                ☕
              </div>
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8]">
                  Brew Diyuuuu's Recovery Chai
                </h3>
                <span className="text-[11px] text-[#A7B7A0]">Adrak, elaichi aur doodh wali garam chai</span>
              </div>
            </div>

            <p className="text-xs text-[#F6F1E8]/80 leading-relaxed font-body">
              Chai ke ingredients chun kar virtual garam cup brew kijiye:
            </p>

            {/* Ingredients Selector */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'adrak', label: 'Fresh Ginger (Adrak)' },
                { id: 'elaichi', label: 'Cardamom (Elaichi)' },
                { id: 'tulsi', label: 'Holy Basil (Tulsi)' },
              ].map((ing) => {
                const isAdded = chaiIngredients.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => handleAddChaiIngredient(ing.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isAdded
                        ? 'bg-[#E8B878] text-[#102A25] font-bold border-[#E8B878]'
                        : 'bg-[#102A25] text-[#A7B7A0] border-[#B8A8D9]/20 hover:text-white'
                    }`}
                  >
                    <span>{isAdded ? '✓ ' : '+ '}</span>
                    <span>{ing.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Brewed Cup Display */}
            {chaiBrewed ? (
              <div className="p-4 rounded-2xl bg-[#102A25] border border-amber-400/40 text-center space-y-2 animate-fade-in">
                <div className="text-4xl animate-bounce">☕✨</div>
                <h4 className="text-xs font-bold text-[#E8B878]">
                  Aapki Garam Adrak Chai Ready Hai!
                </h4>
                <p className="text-[11px] text-[#F6F1E8]/90 italic font-body">
                  "Sip by sip enjoy kijiye. Yeh chai aapke sharir ki sari thakan mita degi."
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#102A25]/40 border border-[#B8A8D9]/10 text-center text-xs text-[#A7B7A0]">
                Ingredients select karke 'Brew Chai' par click kijiye.
              </div>
            )}
          </div>

          <button
            onClick={handleBrewChai}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E8B878] to-[#C89B5E] text-[#102A25] font-bold text-xs sm:text-sm hover:scale-101 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Coffee className="w-4 h-4 text-[#102A25]" />
            <span>Brew Fresh Comfort Chai ☕</span>
          </button>
        </div>
      </div>

      {/* INTERACTION 3: SWEET CHOCOLATE & SNACK DISPENSER */}
      <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/30 p-6 sm:p-8 space-y-5 shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 mx-auto flex items-center justify-center text-3xl">
          🍫
        </div>

        <div className="space-y-1">
          <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
            Diyuuuu's Period Comfort Snack Dispenser
          </h3>
          <p className="text-xs text-[#A7B7A0] max-w-md mx-auto">
            Periods ke 5th day par meetha khana bilkul allowed hai! Tap below to dispense a sweet comfort treat.
          </p>
        </div>

        {currentTreat && (
          <div className="p-4 rounded-2xl bg-[#102A25] border border-[#F4BAC8]/40 max-w-lg mx-auto text-xs sm:text-sm text-[#FFFDF8] font-body leading-relaxed animate-scale-up">
            {currentTreat}
          </div>
        )}

        <button
          onClick={handleDispenseTreat}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F4BAC8] to-[#E29FB0] text-[#26121D] font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-md inline-flex items-center gap-2"
        >
          <Cookie className="w-4 h-4" />
          <span>Dispense Sweet Treat for Diyuuuu 🍫</span>
        </button>
      </div>

      {/* DAY 5 RECOVERY TIPS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
            Day 5 Gentle Care Guide
          </h3>
          <span className="text-xs text-[#A7B7A0]">Small tips for your body</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.comfortTips.map((tip) => (
            <div
              key={tip.id}
              className="p-5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20 space-y-2 hover:border-[#B8A8D9]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 flex items-center justify-center text-[#B8A8D9]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif-title text-lg font-bold text-[#FFFDF8]">{tip.title}</h4>
              <p className="text-xs text-[#F6F1E8]/80 font-body leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nishant's Warm Loving Note */}
      <div className="rounded-3xl bg-gradient-to-r from-[#211624] via-[#1A2D26] to-[#12221D] border border-[#B8A8D9]/40 p-8 text-center space-y-4 shadow-xl">
        <div className="text-3xl">🧸💜</div>
        <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
          "Aapne bohot himmat dikhayi hai"
        </h3>
        <p className="text-sm sm:text-base text-[#F6F1E8]/90 font-body max-w-2xl mx-auto leading-relaxed italic">
          "{data.reassuranceMessage}"
        </p>
        <span className="text-xs text-[#A7B7A0] block">
          ~ With immense love and care, Your Sir jiii
        </span>
      </div>
    </div>
  );
};
