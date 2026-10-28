import React from 'react';
import {
  Home,
  CloudRain,
  Heart,
  BookOpen,
  Flower2,
  Gamepad2,
  Music,
  Calendar,
  Sparkles,
  Settings,
  Volume2,
  VolumeX,
  Lamp,
  Flame,
  Dices,
  ArrowLeft,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type ActiveSection =
  | 'room'
  | 'cuddle'
  | 'period'
  | 'karwa'
  | 'quiz'
  | 'nicknames'
  | 'comfort'
  | 'window'
  | 'notes'
  | 'garden'
  | 'appreciation'
  | 'games'
  | 'music'
  | 'today'
  | 'calendar'
  | 'reflection'
  | 'envelope';

interface NavigationProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  onBack?: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  recipientNickname: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  onBack,
  onOpenSettings,
  onOpenAdmin,
  recipientNickname,
}) => {
  const { rainSoundActive, toggleRainSound, lampGlow, toggleLampGlow } = useTheme();

  const navItems = [
    { id: 'room' as ActiveSection, label: 'Cozy Room', icon: Home },
    { id: 'cuddle' as ActiveSection, label: 'Kiss & Hugs 💋🫂', icon: Heart, special: true },
    { id: 'period' as ActiveSection, label: 'Period Care & Cycle 🌸', icon: Flame, special: true },
    { id: 'karwa' as ActiveSection, label: 'Karwa Chauth & Mehendi 🌙', icon: Sparkles, special: true },
    { id: 'quiz' as ActiveSection, label: "Heart Q&A & Final Msg 💌", icon: Heart, special: true },
    { id: 'nicknames' as ActiveSection, label: 'Nicknames 🎰', icon: Dices },
    { id: 'notes' as ActiveSection, label: 'Handwritten Notes 📖', icon: BookOpen },
    { id: 'games' as ActiveSection, label: 'Mini-Games 🎮', icon: Gamepad2 },
    { id: 'music' as ActiveSection, label: 'Music Player 🎵', icon: Music },
    { id: 'comfort' as ActiveSection, label: 'Comfort Corner', icon: CloudRain },
    { id: 'window' as ActiveSection, label: 'Rainy Window', icon: Sparkles },
    { id: 'garden' as ActiveSection, label: 'Memory Garden', icon: Flower2 },
    { id: 'appreciation' as ActiveSection, label: 'Appreciation', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#102A25]/90 border-b border-[#B8A8D9]/15 transition-colors font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & One-Click Return */}
          <div className="flex items-center gap-3">
            {activeSection !== 'room' && (
              <button
                onClick={onBack ? onBack : () => onNavigate('room')}
                className="px-3 py-1.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs font-semibold text-[#FFFDF8] hover:bg-[#122A23] flex items-center gap-1.5 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9] cursor-pointer"
                title="Wapas Pehle Wale Screen Par Jayein"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#B8A8D9]" />
                <span className="hidden sm:inline">← Wapas / Back</span>
                <span className="sm:hidden">Back</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('room')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9] rounded-lg p-1"
              title="Return to Cozy Room"
            >
              <span className="w-8 h-8 rounded-full bg-[#173B32] border border-[#B8A8D9]/30 flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                ☁️
              </span>
              <div className="flex flex-col">
                <span className="font-serif-title text-xl font-bold tracking-wide text-[#F6F1E8] group-hover:text-[#B8A8D9] transition-colors leading-none">
                  {recipientNickname || 'Diyuuuu'}
                </span>
                <span className="text-[10px] text-[#A7B7A0] tracking-wider uppercase font-body mt-0.5">
                  For Your Cloudy Days
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9] ${
                    isActive
                      ? item.special
                        ? 'bg-rose-950/80 text-rose-200 border border-rose-400/50 shadow-sm'
                        : 'bg-[#173B32] text-[#F6F1E8] border border-[#B8A8D9]/40 shadow-sm'
                      : item.special
                      ? 'text-[#F4BAC8] hover:text-[#FFFDF8] hover:bg-rose-950/40'
                      : 'text-[#A7B7A0] hover:text-[#F6F1E8] hover:bg-[#173B32]/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Rain Audio, Lamp, Settings, Admin Portal) */}
          <div className="flex items-center gap-2">
            {/* Ambient Rain Audio Toggle */}
            <button
              onClick={toggleRainSound}
              aria-label={rainSoundActive ? 'Mute ambient rain sounds' : 'Play peaceful rain sounds'}
              className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9] ${
                rainSoundActive
                  ? 'bg-[#B8A8D9]/20 border-[#B8A8D9]/50 text-[#B8A8D9]'
                  : 'bg-[#173B32]/30 border-[#B8A8D9]/15 text-[#A7B7A0] hover:text-[#F6F1E8]'
              }`}
              title={rainSoundActive ? 'Rain sound is playing' : 'Turn on peaceful rain sounds'}
            >
              {rainSoundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Cozy Warm Lamp Glow Toggle */}
            <button
              onClick={toggleLampGlow}
              aria-label={lampGlow ? 'Turn off lamp glow' : 'Turn on warm lamp glow'}
              className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B878] ${
                lampGlow
                  ? 'bg-[#E8B878]/15 border-[#E8B878]/50 text-[#E8B878]'
                  : 'bg-[#173B32]/30 border-[#B8A8D9]/15 text-[#A7B7A0] hover:text-[#F6F1E8]'
              }`}
              title={lampGlow ? 'Warm lamp lit' : 'Warm lamp off'}
            >
              <Lamp className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              aria-label="Open Settings"
              className="p-2 rounded-lg border border-[#B8A8D9]/15 bg-[#173B32]/30 text-[#A7B7A0] hover:text-[#F6F1E8] hover:bg-[#173B32] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9]"
              title="Site Settings & 7 Color Themes"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Discrete Secret Admin Entry Point */}
            <button
              onClick={onOpenAdmin}
              aria-label="Admin Portal"
              className="p-1.5 opacity-30 hover:opacity-100 hover:text-[#B8A8D9] transition-opacity text-xs rounded"
              title="Comfort Space Management"
            >
              ✨
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Navigation for all screen sizes below 2xl */}
      <div className="2xl:hidden overflow-x-auto scrollbar-none border-t border-[#B8A8D9]/10 bg-[#102A25]/95 px-3 py-2">
        <div className="flex items-center space-x-1.5 w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? item.special
                      ? 'bg-rose-950/90 text-rose-200 border border-rose-400/50 shadow-sm'
                      : 'bg-[#173B32] text-[#F6F1E8] border border-[#B8A8D9]/40 shadow-sm'
                    : item.special
                    ? 'text-[#F4BAC8] bg-rose-950/30 border border-rose-400/20'
                    : 'text-[#A7B7A0] hover:text-[#F6F1E8] bg-[#173B32]/20'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B8A8D9]' : item.special ? 'text-[#F4BAC8]' : 'text-[#A7B7A0]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
