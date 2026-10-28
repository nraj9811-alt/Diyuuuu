import React, { useState } from 'react';
import { Cloud, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import { useTheme } from '../../context/ThemeContext';

interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  color: string;
  thought: string;
  practicalAdvice: string;
}

export const MoodCloud: React.FC = () => {
  const { logAction } = useTheme();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);

  const moods: MoodOption[] = [
    {
      id: 'calm',
      label: 'Calm & Peaceful',
      emoji: '☁️',
      color: 'from-emerald-900/40 to-teal-900/30 border-teal-500/30',
      thought: 'Sukoon ek bohot badi blessing hai. Is shaant pal ko enjoy kijiye aur bas enjoy each breath.',
      practicalAdvice: 'Ek cup adrak chai lijiye aur khidki ke paas thodi der baithiye.',
    },
    {
      id: 'rainy',
      label: 'Rainy & Melancholic',
      emoji: '🌧️',
      color: 'from-blue-900/40 to-indigo-900/30 border-blue-500/30',
      thought: 'Baadal aasmaan ko dho kar saaf karte hain. Aaj agar thoda cloudy lag raha hai, toh it is completely okay.',
      practicalAdvice: 'Soft music chalayiye, warm blanket lijiye, aur khud par bilkul pressure mat daaliye.',
    },
    {
      id: 'sunny',
      label: 'Sunny & Hopeful',
      emoji: '🌤️',
      color: 'from-amber-900/40 to-yellow-900/30 border-amber-500/30',
      thought: 'Aapki positivity aur muskaan aas-paas ke sabhi logon ko khush karti hai.',
      practicalAdvice: 'Apne kisi favourite task ko smile ke saath shuru kijiye!',
    },
    {
      id: 'sleepy',
      label: 'Sleepy & Tired',
      emoji: '🌙',
      color: 'from-purple-900/40 to-indigo-950/40 border-purple-500/30',
      thought: 'Neend aur aaram koi luxury nahi, aapki body aur mind ki zaroorat hai. Rest is productive too.',
      practicalAdvice: 'Screen thodi der ke liye band kar dijiye aur aankhein band karke relax kijiye.',
    },
    {
      id: 'dreamy',
      label: 'Dreamy & Thoughtful',
      emoji: '🌌',
      color: 'from-violet-900/40 to-fuchsia-950/30 border-violet-500/30',
      thought: 'Aapka imagination aur thought process bohot sundar hai. Khwaab dekhna zinda dilli ki nishani hai.',
      practicalAdvice: 'Agar mann ho toh kuch chhota sa likhiye ya bas khule aasmaan ko dekhiye.',
    },
    {
      id: 'chaotic',
      label: 'A Little Overwhelmed',
      emoji: '🌪️',
      color: 'from-rose-950/40 to-orange-950/30 border-rose-500/30',
      thought: 'Jab dimaag mein bohot saare thoughts ek saath chalein, toh saari baatein ek saath solve nahi karni hoti.',
      practicalAdvice: 'Bas ek deep breath lijiye: 4 seconds inhale, 4 seconds hold, 4 seconds release. You are safe.',
    },
  ];

  const handleSelectMood = (m: MoodOption) => {
    setSelectedMood(m);
    soundManager.playComfortChime('star');
    logAction('interaction_click', 'Mood Cloud', `Selected mood: ${m.label}`);
  };

  return (
    <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/25 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8] flex items-center justify-center gap-2">
          <span>Mood Cloud ☁️💜</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#A7B7A0] max-w-md mx-auto font-body">
          Aaj aapke dil ka mausam kaisa lag raha hai? Kisi ek cloud par tap karke gentle thought padhiye.
        </p>
      </div>

      {/* Cloud Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {moods.map((m) => {
          const isSelected = selectedMood?.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSelectMood(m)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9] ${
                isSelected
                  ? 'bg-gradient-to-br from-[#102A25] to-[#1C453B] border-[#B8A8D9] shadow-md scale-102'
                  : 'bg-[#102A25]/60 border-[#B8A8D9]/15 hover:border-[#B8A8D9]/40 hover:bg-[#102A25]'
              }`}
            >
              <span className="text-3xl select-none">{m.emoji}</span>
              <span className="text-xs font-semibold text-[#F6F1E8]">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Mood Thought Banner */}
      {selectedMood && (
        <div className="rounded-2xl bg-gradient-to-br from-[#102A25] to-[#173B32] border border-[#B8A8D9]/30 p-6 space-y-4 animate-fade-in shadow-inner">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedMood.emoji}</span>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8]">
                For Your {selectedMood.label} Mind
              </h3>
              <p className="text-[11px] text-[#A7B7A0]">A gentle note from Nishant</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#F6F1E8]/90 font-body leading-relaxed italic border-l-2 border-[#B8A8D9] pl-4">
            "{selectedMood.thought}"
          </p>

          <div className="pt-2 text-xs text-[#E8B878] flex items-center gap-2">
            <span>✨ Chhota sa suggestion:</span>
            <span className="text-[#F6F1E8]">{selectedMood.practicalAdvice}</span>
          </div>
        </div>
      )}
    </div>
  );
};
