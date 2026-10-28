import React from 'react';
import { X, Moon, Sun, Sparkles, Volume2, Shield, Trash2, Download, Eye, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nicknames: string[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, nicknames }) => {
  const {
    theme,
    setTheme,
    animationsEnabled,
    setAnimationsEnabled,
    reducedMotion,
    setReducedMotion,
    rainSoundActive,
    toggleRainSound,
    rainVolume,
    setRainVolume,
    showNicknames,
    setShowNicknames,
  } = useTheme();

  if (!isOpen) return null;

  const themes: Array<{ id: ThemeMode; label: string; desc: string; preview: string }> = [
    {
      id: 'forest',
      label: 'Deep Forest',
      desc: 'Emerald greenery, misty rain & warm amber light',
      preview: 'bg-[#102A25] border-[#173B32]',
    },
    {
      id: 'lavender',
      label: 'Lavender Twilight',
      desc: 'Soft plum shadows, lilac stars & serene quiet',
      preview: 'bg-[#151324] border-[#2D2644]',
    },
    {
      id: 'warm-cream',
      label: 'Warm Cream & Chai',
      desc: 'Toasted chai tones, roasted amber & vintage paper',
      preview: 'bg-[#1F1914] border-[#3D3228]',
    },
    {
      id: 'midnight',
      label: 'Midnight Rain',
      desc: 'Cool starlit night, deep blue rain & quiet stillness',
      preview: 'bg-[#0B131B] border-[#1B2F42]',
    },
    {
      id: 'sakura',
      label: 'Sakura Blossom 🌸',
      desc: 'Soft pastel rose, warm plum & floral comfort',
      preview: 'bg-[#211219] border-[#452434]',
    },
    {
      id: 'matcha',
      label: 'Matcha & Bamboo 🍵',
      desc: 'Zen green tea tones, serene bamboo & fresh leaves',
      preview: 'bg-[#111A14] border-[#263A2D]',
    },
    {
      id: 'cinnamon',
      label: 'Cinnamon & Honey 🍯',
      desc: 'Toasted cinnamon bakery warmth & amber comfort',
      preview: 'bg-[#21150F] border-[#472D21]',
    },
  ];

  const handleClearLocalData = () => {
    if (confirm('Are you sure you want to clear your saved favorite thoughts and calendar entries on this browser?')) {
      localStorage.removeItem('diyu_fav_comfort');
      localStorage.removeItem('diyu_plan_done');
      localStorage.removeItem('diyu_cal_entries');
      localStorage.removeItem('diyu_stars_high');
      alert('Local browser data cleared.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#173B32] border border-[#B8A8D9]/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#B8A8D9]/15 pb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#B8A8D9]" />
            <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
              Personal Comfort Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#102A25] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: 7 Expanded Themes */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B8A8D9]">
            Visual Atmosphere & 7 Color Themes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {themes.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'bg-[#102A25] border-[#B8A8D9] shadow-md scale-102'
                      : 'bg-[#102A25]/50 border-[#B8A8D9]/15 hover:border-[#B8A8D9]/40'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg ${t.preview} shrink-0 border mt-0.5`} />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${isSelected ? 'text-[#B8A8D9]' : 'text-[#FFFDF8]'}`}>
                      {t.label}
                    </p>
                    <p className="text-[10px] text-[#A7B7A0] leading-snug mt-0.5">{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Audio & Rain Sound */}
        <div className="space-y-3 pt-2 border-t border-[#B8A8D9]/15">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B8A8D9]">
            Sound & Ambient Rain
          </h3>
          <div className="p-4 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#FFFDF8]">Ambient Rain Audio</p>
                <p className="text-[11px] text-[#A7B7A0]">Soft raindrops pattering outside</p>
              </div>
              <button
                onClick={toggleRainSound}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  rainSoundActive
                    ? 'bg-[#B8A8D9] text-[#102A25] border-[#B8A8D9]'
                    : 'bg-[#173B32] text-[#A7B7A0] border-[#B8A8D9]/20'
                }`}
              >
                {rainSoundActive ? 'Playing 🌧️' : 'Muted'}
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-[#A7B7A0]">
                <span>Rain Volume</span>
                <span>{Math.round(rainVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={rainVolume}
                onChange={(e) => setRainVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#173B32] accent-[#B8A8D9] rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Motion & Animation */}
        <div className="space-y-3 pt-2 border-t border-[#B8A8D9]/15">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B8A8D9]">
            Animation & Accessibility
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/15 cursor-pointer">
              <span className="text-xs text-[#FFFDF8]">Visual Falling Raindrops & Star Animations</span>
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#B8A8D9] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/15 cursor-pointer">
              <span className="text-xs text-[#FFFDF8]">Reduced Motion (Faster transitions)</span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-[#B8A8D9] rounded"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Privacy & Local Data */}
        <div className="space-y-3 pt-2 border-t border-[#B8A8D9]/15">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#B8A8D9]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B8A8D9]">
              Privacy & Local Storage
            </h3>
          </div>
          <p className="text-xs text-[#A7B7A0] leading-relaxed">
            Your private journal entries and calendar notes are strictly saved in your local browser and are never uploaded without your explicit button click.
          </p>

          <button
            onClick={handleClearLocalData}
            className="w-full py-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-medium hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved Local Browser Data</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#B8A8D9] text-[#102A25] font-semibold text-xs hover:bg-[#D8CEEE] transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
