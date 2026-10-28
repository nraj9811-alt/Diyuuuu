import React, { useState } from 'react';
import { Gamepad2, Star, Heart, Cloud, Sparkles, Flower2, ArrowLeft } from 'lucide-react';
import { RomanticWheelOfWishes } from './RomanticWheelOfWishes';
import { SweetCatcher } from './SweetCatcher';
import { BubblePop } from './BubblePop';
import { CatchTheStars } from './CatchTheStars';
import { FindTheHiddenHeart } from './FindTheHiddenHeart';
import { MoodCloud } from './MoodCloud';
import { MemoryMatch } from './MemoryMatch';
import { LittleGarden } from './LittleGarden';
import { MiniGameConfig } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MiniGamesHubProps {
  gameConfigs?: Record<string, MiniGameConfig>;
  recipientNickname: string;
  onReturn?: () => void;
}

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({
  gameConfigs = {},
  recipientNickname,
  onReturn,
}) => {
  const { logAction } = useTheme();
  const [activeGame, setActiveGame] = useState<string>('wheel');

  const games = [
    {
      id: 'wheel',
      title: 'Wheel of Wishes 🎡',
      subtitle: 'Spin & Win Kisses',
      icon: Sparkles,
      special: true,
    },
    {
      id: 'catcher',
      title: 'Sweet Catcher 🍫',
      subtitle: 'Catch Chocolates & Chai',
      icon: Sparkles,
      special: true,
    },
    {
      id: 'bubble',
      title: 'Bubble Wrap Pop 🫧',
      subtitle: 'Tactile Stress Buster',
      icon: Heart,
      special: true,
    },
    {
      id: 'stars',
      title: 'Catch the Stars ⭐',
      subtitle: 'Peaceful night sky stars',
      icon: Star,
    },
    {
      id: 'memory',
      title: 'Memory Match 🃏',
      subtitle: 'Match cozy romantic pairs',
      icon: Sparkles,
    },
    {
      id: 'heart',
      title: 'Hidden Heart 💖',
      subtitle: 'Find hidden love item',
      icon: Heart,
    },
    {
      id: 'mood',
      title: 'Mood Weather ☁️',
      subtitle: 'Gentle advice clouds',
      icon: Cloud,
    },
    {
      id: 'garden',
      title: 'Bonsai Garden 🌸',
      subtitle: 'Water & bloom flowers',
      icon: Flower2,
    },
  ];

  const handleSelectGame = (id: string, name: string) => {
    setActiveGame(id);
    logAction('section_view', 'Mini-Games', `Switched to game: ${name}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-body">
      {/* Top Header with Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8A8D9]/20 pb-5">
        <div className="flex items-center gap-3">
          {onReturn && (
            <button
              onClick={onReturn}
              className="p-2.5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/30 text-[#FFFDF8] hover:bg-[#122A23] transition-colors"
              title="Wapas Room Jayein"
            >
              <ArrowLeft className="w-5 h-5 text-[#B8A8D9]" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎮✨</span>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Playful Mini-Games for {recipientNickname}
              </h1>
            </div>
            <p className="text-xs text-[#A7B7A0] mt-0.5">
              Sweet, fun & tactile arcade games to lift your mood on cloudy days
            </p>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {games.map((g) => {
          const Icon = g.icon;
          const isSelected = activeGame === g.id;

          return (
            <button
              key={g.id}
              onClick={() => handleSelectGame(g.id, g.title)}
              className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 focus:outline-none ${
                isSelected
                  ? 'bg-[#B8A8D9] text-[#102A25] font-bold border-[#B8A8D9] shadow-md scale-105'
                  : g.special
                  ? 'bg-rose-950/60 border-rose-400/40 text-rose-200 hover:bg-rose-900/60'
                  : 'bg-[#173B32]/40 border-[#B8A8D9]/15 text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#173B32]/70'
              }`}
            >
              <span className="text-base">{g.id === 'catcher' ? '🍫' : g.id === 'bubble' ? '🫧' : g.id === 'stars' ? '⭐' : g.id === 'memory' ? '🃏' : g.id === 'heart' ? '💖' : g.id === 'mood' ? '☁️' : '🌸'}</span>
              <span className="text-xs font-semibold leading-tight">{g.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Game Interface */}
      <div className="pt-2">
        {activeGame === 'wheel' && <RomanticWheelOfWishes />}
        {activeGame === 'catcher' && <SweetCatcher />}
        {activeGame === 'bubble' && <BubblePop />}
        {activeGame === 'stars' && <CatchTheStars />}
        {activeGame === 'memory' && <MemoryMatch />}
        {activeGame === 'heart' && <FindTheHiddenHeart />}
        {activeGame === 'mood' && <MoodCloud />}
        {activeGame === 'garden' && <LittleGarden />}
      </div>
    </div>
  );
};
