import React, { useState } from 'react';
import { Flower2, Droplets, RotateCcw, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';

interface PlantType {
  id: string;
  name: string;
  stages: string[];
  bloomMessage: string;
}

export const LittleGarden: React.FC = () => {
  const { logAction } = useTheme();
  const plants: PlantType[] = [
    {
      id: 'jasmine',
      name: 'White Jasmine (Mogra)',
      stages: ['🌰 (Beej)', '🌱 (Sprout)', '🌿 (Leaves)', '🌸 (Sweet Blooming Mogra)'],
      bloomMessage: 'Aapki presence is white mogra ki khushboo ki tarah hai—calm, pure, and soothing to everyone around.',
    },
    {
      id: 'bonsai',
      name: 'Peaceful Bonsai',
      stages: ['🌰 (Seed)', '🌱 (Tender Shoot)', '🪴 (Little Bonsai)', '🌳 (Flourishing Zen Tree)'],
      bloomMessage: 'Bonsai humein sikhata hai ki sabr aur dheeraj se hi sabse khoobsurat cheezein banti hain. Aap bohot achha kar rahi hain.',
    },
    {
      id: 'lavender',
      name: 'Cozy Lavender',
      stages: ['🌰 (Seed)', '🌱 (Tiny Sprout)', '🌿 (Lavender Stems)', '💜 (Fragrant Purple Blooms)'],
      bloomMessage: 'Lavender humesha sukoon aur achhi neend ka symbol hota hai. May your days be soft and peaceful.',
    },
  ];

  const [selectedPlantId, setSelectedPlantId] = useState<string>('lavender');
  const [stage, setStage] = useState<number>(0);
  const [isWatering, setIsWatering] = useState<boolean>(false);

  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const maxStage = currentPlant.stages.length - 1;
  const isBloomed = stage === maxStage;

  const handleWater = () => {
    if (isBloomed || isWatering) return;
    setIsWatering(true);
    soundManager.playComfortChime('star');

    setTimeout(() => {
      setStage((prev) => {
        const next = prev + 1;
        if (next === maxStage) {
          soundManager.playComfortChime('success');
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          logAction('game_play', 'Little Garden', `Bloomed ${currentPlant.name}`);
        }
        return next;
      });
      setIsWatering(false);
    }, 600);
  };

  const handleReset = () => {
    setStage(0);
    soundManager.playComfortChime('click');
  };

  return (
    <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/25 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8A8D9]/15 pb-4">
        <div>
          <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8] flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-emerald-400" />
            <span>Little Garden 🌱</span>
          </h2>
          <p className="text-xs text-[#A7B7A0]">
            Apna favourite podha chuniye, paani dijiye, aur usko bloom hote dekhiye.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-[#F6F1E8] flex items-center gap-1.5 hover:bg-[#1C453B]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Re-plant</span>
        </button>
      </div>

      {/* Plant Choice Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {plants.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedPlantId(p.id);
              setStage(0);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedPlantId === p.id
                ? 'bg-[#B8A8D9] text-[#102A25] border-[#B8A8D9] shadow-sm'
                : 'bg-[#102A25] text-[#A7B7A0] border-[#B8A8D9]/20 hover:text-[#FFFDF8]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Illustrated Garden Pot Scene */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0F2621] to-[#122E27] border border-[#B8A8D9]/20 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6">
        {/* Plant Growth Display */}
        <div className="relative">
          <div className="text-6xl sm:text-7xl transition-all duration-500 transform hover:scale-110 select-none">
            {stage === 0 && '🌰'}
            {stage === 1 && '🌱'}
            {stage === 2 && '🌿'}
            {stage === 3 && (selectedPlantId === 'lavender' ? '💜' : selectedPlantId === 'jasmine' ? '🌸' : '🌳')}
          </div>

          {isWatering && (
            <div className="absolute -top-4 right-0 text-2xl animate-bounce">
              💧
            </div>
          )}
        </div>

        {/* Growth Stage Meter */}
        <div className="w-full max-w-xs space-y-1.5">
          <div className="flex justify-between text-xs text-[#A7B7A0]">
            <span>Growth Stage</span>
            <span className="text-[#B8A8D9] font-medium">{currentPlant.stages[stage]}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#102A25] overflow-hidden border border-[#B8A8D9]/20">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#B8A8D9] transition-all duration-500"
              style={{ width: `${((stage + 1) / (maxStage + 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Button: Water Plant */}
        {!isBloomed ? (
          <button
            onClick={handleWater}
            disabled={isWatering}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-[#FFFDF8] font-semibold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
          >
            <Droplets className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>{isWatering ? 'Watering...' : 'Water the Plant 💧'}</span>
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in max-w-md">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Bloom Reached!</span>
            </div>
            <p className="text-sm sm:text-base text-[#F6F1E8] font-body italic leading-relaxed border-t border-[#B8A8D9]/20 pt-3">
              "{currentPlant.bloomMessage}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
