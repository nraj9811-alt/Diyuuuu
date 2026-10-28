import React, { useState } from 'react';
import {
  Sparkles,
  CloudRain,
  BookOpen,
  Coffee,
  Music,
  Flower2,
  Library,
  Mail,
  Lamp,
  Heart,
  Calendar,
  Gamepad2,
  ChevronRight,
  X,
  Volume2,
  Flame,
  Dices,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ActiveSection } from './Navigation';
import { soundManager } from '../utils/audioSynth';
import { CartoonCompanion } from './CartoonCompanion';

interface MainCozyRoomProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenEnvelope: () => void;
  recipientNickname: string;
}

export const MainCozyRoom: React.FC<MainCozyRoomProps> = ({
  onNavigate,
  onOpenEnvelope,
  recipientNickname,
}) => {
  const { lampGlow, toggleLampGlow, rainSoundActive, toggleRainSound, logAction } = useTheme();
  const [activeMessage, setActiveMessage] = useState<{ title: string; text: string; icon: string } | null>(null);

  const triggerChai = () => {
    soundManager.playComfortChime('star');
    logAction('interaction_click', 'Cozy Room', 'Interacted with Steaming Chai');
    setActiveMessage({
      title: 'A Warm Cup of Chai ☕',
      text: 'Ek cup garam adrak chai, thodi si shanti aur apne liye kuch minutes. Aap araam se saans lete ho, koi jaldi nahi hai.',
      icon: '☕',
    });
  };

  const triggerPlant = () => {
    soundManager.playComfortChime('heart');
    logAction('interaction_click', 'Cozy Room', 'Interacted with Bonsai Plant');
    setActiveMessage({
      title: 'Gentle Growth 🌱',
      text: 'Aap jis tarah har roz bina shor machaye aage badhte ho, woh sach mein beautiful lagta hai. Chhoti si progress bhi ek real progress hoti hai.',
      icon: '🌱',
    });
  };

  const interactiveObjects = [
    {
      id: 'cuddle',
      title: 'Kiss & Hug Sanctuary 💋🫂',
      subtitle: 'Forehead kisses, tight bear hugs & heartbeat cuddles',
      icon: Heart,
      color: 'from-rose-950/80 to-purple-950/80',
      action: () => {
        logAction('section_view', 'Cuddle Sanctuary', 'Opened from Cozy Room');
        onNavigate('cuddle');
      },
      special: true,
    },
    {
      id: 'period',
      title: 'Period Care & Cycle Tracker 🌸',
      subtitle: 'Day 5/6 relief, irregular cycle tracker & Telegram sync',
      icon: Flame,
      color: 'from-rose-900/40 to-[#173B32]',
      action: () => {
        logAction('section_view', 'Period Care', 'Opened from Cozy Room');
        onNavigate('period');
      },
      special: true,
    },
    {
      id: 'karwa',
      title: 'Karwa Chauth & Mummy ki Mehendi 🌙✨',
      subtitle: 'Kal Karwa Chauth hai! Mehendi designs & Nishant ka pyar',
      icon: Sparkles,
      color: 'from-amber-950/80 to-rose-950/80',
      action: () => {
        logAction('section_view', 'Karwa Chauth Special', 'Opened from Cozy Room');
        onNavigate('karwa');
      },
      special: true,
    },
    {
      id: 'quiz',
      title: "Divya's Heart Q&A & Final Msg 💌",
      subtitle: '5-step heartfelt questions, Nishant ki chitthi & secret message',
      icon: Heart,
      color: 'from-purple-950/80 to-rose-950/80',
      action: () => {
        logAction('section_view', 'Heart Q&A Quiz', 'Opened from Cozy Room');
        onNavigate('quiz');
      },
      special: true,
    },
    {
      id: 'nicknames',
      title: 'Nickname Generator 🎰',
      subtitle: 'Beendani ji, Madam ji, bbg & 30+ non-repeating names',
      icon: Dices,
      color: 'from-amber-900/40 to-[#173B32]',
      action: () => {
        logAction('section_view', 'Nickname Generator', 'Opened from Cozy Room');
        onNavigate('nicknames');
      },
    },
    {
      id: 'window',
      title: 'Rainy Window',
      subtitle: 'Watch raindrops slide on misty glass',
      icon: CloudRain,
      color: 'from-blue-900/40 to-[#173B32]',
      action: () => {
        logAction('section_view', 'Rainy Window', 'Opened from Cozy Room');
        onNavigate('window');
      },
    },
    {
      id: 'notebook',
      title: 'Handwritten Notes',
      subtitle: 'Reminders, cloudy-day thoughts & letters',
      icon: BookOpen,
      color: 'from-amber-900/30 to-[#173B32]',
      action: () => {
        logAction('section_view', 'Notes', 'Opened from Cozy Room');
        onNavigate('notes');
      },
    },
    {
      id: 'envelope',
      title: 'Surprise Envelope 💌',
      subtitle: 'A folded paper letter just for Diyuuuu',
      icon: Mail,
      color: 'from-purple-900/40 to-[#173B32]',
      action: onOpenEnvelope,
    },
    {
      id: 'music',
      title: 'Cozy Turntable',
      subtitle: '10 soothing tracks & relaxing lofi notes',
      icon: Music,
      color: 'from-emerald-900/40 to-[#173B32]',
      action: () => {
        logAction('section_view', 'Music Player', 'Opened from Cozy Room');
        onNavigate('music');
      },
    },
    {
      id: 'bookshelf',
      title: 'Memory Garden',
      subtitle: 'Leaves, stars & peaceful moments',
      icon: Library,
      color: 'from-indigo-900/30 to-[#173B32]',
      action: () => {
        logAction('section_view', 'Memory Garden', 'Opened from Cozy Room');
        onNavigate('garden');
      },
    },
    {
      id: 'games',
      title: 'Mini-Games Corner',
      subtitle: 'Catch stars, mood clouds & memory match',
      icon: Gamepad2,
      color: 'from-violet-900/40 to-[#173B32]',
      action: () => {
        logAction('section_view', 'Mini-Games', 'Opened from Cozy Room');
        onNavigate('games');
      },
    },
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173B32] via-[#1C453B] to-[#173B32] border border-[#B8A8D9]/20 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B8A8D9]">
              <span>Cozy Sanctuary</span>
              <span aria-hidden="true">·</span>
              <span>Made with immense care for {recipientNickname}</span>
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF8]">
              Welcome to Your Cozy Room, {recipientNickname} ☁️
            </h1>
            <p className="text-[#F6F1E8]/85 text-sm sm:text-base max-w-2xl font-body">
              Baahar chahe kitni bhi baarish ya shor ho, yahan hamesha sukoon aur warmth hai.
              Aaj period ka Day 5 hai, aap pait par heat pad lagate ho, garam chai peete ho aur bilkul relax karte ho.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('cuddle')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg"
            >
              <span>💋</span>
              <span>Kiss & Hug Sanctuary 🫂</span>
            </button>

            <button
              onClick={() => onNavigate('period')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-950 to-pink-950 border border-rose-400/40 text-rose-200 text-xs sm:text-sm font-semibold flex items-center gap-2 hover:scale-[1.02] transition-all shadow-md"
            >
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Period & Cycle Care 🌸</span>
            </button>

            <button
              onClick={() => onNavigate('karwa')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-orange-600 to-rose-700 text-amber-100 text-xs sm:text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-all shadow-md border border-amber-300/30"
            >
              <span>🌙</span>
              <span>Karwa Chauth & Mehendi ✨</span>
            </button>

            <button
              onClick={() => onNavigate('quiz')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:scale-[1.02] transition-all shadow-md border border-pink-300/30"
            >
              <span>💌</span>
              <span>Heart Q&A & Secret Msg</span>
            </button>

            <button
              onClick={toggleRainSound}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2 transition-all ${
                rainSoundActive
                  ? 'bg-[#102A25] border-[#B8A8D9]/50 text-[#B8A8D9] shadow-sm'
                  : 'bg-[#173B32]/60 border-[#B8A8D9]/20 text-[#A7B7A0] hover:text-[#F6F1E8]'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${rainSoundActive ? 'text-[#B8A8D9] animate-pulse' : ''}`} />
              <span>{rainSoundActive ? 'Rain Playing' : 'Play Rain Sound'}</span>
            </button>

            <button
              onClick={onOpenEnvelope}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Surprise Letter</span>
            </button>
          </div>
        </div>

        {lampGlow && (
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#E8B878]/15 blur-3xl pointer-events-none" />
        )}
      </div>

      {/* CUTE CARTOON COMPANION SECTION */}
      <CartoonCompanion recipientNickname={recipientNickname} />

      {/* Illustrated Cozy Room Hotspots Canvas / Interactive Hub */}
      <div className="relative rounded-3xl bg-[#0F2621] border border-[#B8A8D9]/25 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-6 border-b border-[#B8A8D9]/15">
          <div className="flex items-center gap-2 text-sm text-[#A7B7A0]">
            <Sparkles className="w-4 h-4 text-[#B8A8D9]" />
            <span>Interactive Room Items · Tap any object to interact</span>
          </div>

          <button
            onClick={toggleLampGlow}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
              lampGlow
                ? 'bg-[#E8B878]/15 border-[#E8B878]/40 text-[#E8B878]'
                : 'bg-[#173B32]/40 border-[#B8A8D9]/20 text-[#A7B7A0]'
            }`}
          >
            <Lamp className="w-3.5 h-3.5" />
            <span>{lampGlow ? 'Lamp Lit' : 'Lamp Off'}</span>
          </button>
        </div>

        {/* Room Illustration Hotspots Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Object 1: Day 5 Period Care */}
          <button
            onClick={() => onNavigate('period')}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 to-[#122E27] border border-rose-400/30 text-left hover:border-rose-400/60 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-950/70 border border-rose-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              🌸
            </div>
            <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] group-hover:text-rose-300 transition-colors">
              Day 5 Period Care
            </h3>
            <p className="text-xs text-[#A7B7A0] mt-1 font-body">Heat pad, chai & sweet treat</p>
          </button>

          {/* Object 2: Nicknames Slot */}
          <button
            onClick={() => onNavigate('nicknames')}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 to-[#122E27] border border-amber-400/30 text-left hover:border-amber-400/60 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              🎰
            </div>
            <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] group-hover:text-amber-300 transition-colors">
              Nicknames Generator
            </h3>
            <p className="text-xs text-[#A7B7A0] mt-1 font-body">Beendani ji, bbg, Madam ji</p>
          </button>

          {/* Object 3: Steaming Chai */}
          <button
            onClick={triggerChai}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-[#173B32] to-[#122E27] border border-[#B8A8D9]/20 text-left hover:border-[#E8B878]/50 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B878]"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-900/30 border border-amber-400/20 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              ☕
            </div>
            <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] group-hover:text-[#E8B878] transition-colors">
              Cup of Chai
            </h3>
            <p className="text-xs text-[#A7B7A0] mt-1 font-body">Tap for a comforting chai message</p>
          </button>

          {/* Object 4: Rainy Window */}
          <button
            onClick={() => onNavigate('window')}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-[#173B32] to-[#122E27] border border-[#B8A8D9]/20 text-left hover:border-[#B8A8D9]/50 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9]"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-900/30 border border-blue-400/20 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              🌧️
            </div>
            <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] group-hover:text-[#B8A8D9] transition-colors">
              Rainy Window
            </h3>
            <p className="text-xs text-[#A7B7A0] mt-1 font-body">Rain droplets & blurred dark forest</p>
          </button>

          {/* Object 5: Handwritten Notebook */}
          <button
            onClick={() => onNavigate('notes')}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-[#173B32] to-[#122E27] border border-[#B8A8D9]/20 text-left hover:border-[#B8A8D9]/50 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-900/30 border border-purple-400/20 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              📖
            </div>
            <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] group-hover:text-[#B8A8D9] transition-colors">
              Notebook & Letters
            </h3>
            <p className="text-xs text-[#A7B7A0] mt-1 font-body">Personal thoughts & unfoldable letters</p>
          </button>

          {/* Object 6: Music Player */}
          <button
            onClick={() => onNavigate('music')}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-[#173B32] to-[#122E27] border border-[#B8A8D9]/20 text-left hover:border-[#B8A8D9]/50 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9]"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-900/30 border border-emerald-400/20 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              🎵
            </div>
            <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] group-hover:text-[#B8A8D9] transition-colors">
              Music Player
            </h3>
            <p className="text-xs text-[#A7B7A0] mt-1 font-body">10 comforting tracks & lofi chill</p>
          </button>

          {/* Object 7: House Plant */}
          <button
            onClick={triggerPlant}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-[#173B32] to-[#122E27] border border-[#B8A8D9]/20 text-left hover:border-emerald-400/50 hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-900/30 border border-emerald-400/20 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              🌿
            </div>
            <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] group-hover:text-emerald-300 transition-colors">
              Little Plant
            </h3>
            <p className="text-xs text-[#A7B7A0] mt-1 font-body">Tap for a peaceful growth reminder</p>
          </button>

          {/* Object 8: Surprise Envelope */}
          <button
            onClick={onOpenEnvelope}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-[#231A38] to-[#173B32] border border-[#B8A8D9]/40 text-left hover:border-[#B8A8D9] hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9]"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-[#B8A8D9]/30 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              ✉️
            </div>
            <h3 className="font-serif-title text-lg font-semibold text-[#D8CEEE] group-hover:text-[#FFFDF8] transition-colors">
              Surprise Envelope
            </h3>
            <p className="text-xs text-[#B8A8D9]/90 mt-1 font-body">Click to unfold handwritten letter</p>
          </button>
        </div>
      </div>

      {/* Pop-up Comfort Thought Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#173B32] border border-[#B8A8D9]/30 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setActiveMessage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#102A25] transition-colors"
              aria-label="Close message"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/20 mx-auto flex items-center justify-center text-3xl">
              {activeMessage.icon}
            </div>
            <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">{activeMessage.title}</h3>
            <p className="text-[#F6F1E8]/90 font-body text-sm leading-relaxed">{activeMessage.text}</p>
            <div className="pt-2">
              <button
                onClick={() => setActiveMessage(null)}
                className="px-6 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] font-medium text-sm hover:bg-[#D8CEEE] transition-colors"
              >
                Sukoon Mila 💜
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explore Section Feature Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">Explore Your Little World</h2>
          <span className="text-xs text-[#A7B7A0]">Click any section below</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {interactiveObjects.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="group relative p-5 rounded-2xl bg-[#173B32]/70 border border-[#B8A8D9]/15 hover:border-[#B8A8D9]/40 hover:bg-[#173B32] transition-all text-left flex items-start justify-between shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9]"
              >
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 flex items-center justify-center text-[#B8A8D9] group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] pt-1 group-hover:text-[#B8A8D9] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#A7B7A0] leading-snug font-body line-clamp-2">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A7B7A0] group-hover:text-[#FFFDF8] group-hover:translate-x-1 transition-all mt-2" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
