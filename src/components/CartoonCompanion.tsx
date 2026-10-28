import React, { useState } from 'react';
import { Heart, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

interface Character {
  id: string;
  name: string;
  avatar: string;
  role: string;
  dialogues: string[];
}

export const CartoonCompanion: React.FC<{ recipientNickname: string }> = ({ recipientNickname }) => {
  const characters: Character[] = [
    {
      id: 'bunny',
      name: 'Mimi the Cozy Bunny 🐰',
      avatar: '🐰',
      role: 'Blanket & Hot Water Bag Expert',
      dialogues: [
        'Diyuuuu, aap thak gaye honge na? Aaiye mere paas warm blanket hai!',
        'Periods ka Day 5 hai, aap pait par gentle heat pad lagate ho na?',
        'Aap jab aaram karte ho, aapka sharir bohot thankful hota hai.',
        'Mimi aapko sabse bada aur warmest hug de raha hai! 🧸💜',
      ],
    },
    {
      id: 'bear',
      name: 'Bhalu Ji the Tea Master 🐻',
      avatar: '🐻',
      role: 'Adrak Chai Specialist',
      dialogues: [
        'Garam adrak aur elaichi wali chai ready hai aapke liye!',
        'Aap kitne pyare lagte ho jab bina kisi shor ke chai ka pehla sip lete ho.',
        'Har cloudy day ke baad meethi dhoop aati hai. No stress at all!',
        'Aap apne pace par aage badhte ho, wahi sabse best baat hai.',
      ],
    },
    {
      id: 'cat',
      name: 'Mew the Cloud Cat 🐱',
      avatar: '🐱',
      role: 'Nap & Purr Companion',
      dialogues: [
        'Purrrr... Main aapke paas so jata hoon taaki aapko bilkul akela na lage.',
        'Aap jab haste ho, lagta hai jaise baadal hat gaye hon.',
        'Phone thodi der side rakh dijiye, aankhein band kijiye aur rest karte ho.',
        'Aapko har waqt kaam karne ki zaroorat nahi hai. Naps are healthy!',
      ],
    },
  ];

  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);

  const char = characters[activeCharIndex];
  const dialogue = char.dialogues[dialogueIndex % char.dialogues.length];

  const handleNextDialogue = () => {
    setDialogueIndex((prev) => (prev + 1) % char.dialogues.length);
    soundManager.playComfortChime('star');
  };

  const handleSwitchCharacter = () => {
    setActiveCharIndex((prev) => (prev + 1) % characters.length);
    setDialogueIndex(0);
    soundManager.playComfortChime('click');
  };

  const handleSendHug = () => {
    setShowHeartBurst(true);
    soundManager.playComfortChime('heart');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setShowHeartBurst(false), 2000);
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-[#21162B] via-[#173B32] to-[#122A25] border-2 border-[#B8A8D9]/40 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
      {/* Cartoon Character Avatar */}
      <div className="relative shrink-0 text-center">
        <div
          onClick={handleSendHug}
          className="w-24 h-24 rounded-3xl bg-[#102A25] border-2 border-[#B8A8D9]/40 flex items-center justify-center text-5xl shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer select-none group"
          title="Click to get a warm hug!"
        >
          <span className="group-hover:animate-bounce">{char.avatar}</span>
        </div>

        {showHeartBurst && (
          <div className="absolute -top-3 -right-3 text-2xl animate-ping">
            💜
          </div>
        )}

        <button
          onClick={handleSwitchCharacter}
          className="mt-2 text-[11px] text-[#A7B7A0] hover:text-[#FFFDF8] flex items-center gap-1 mx-auto underline"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Switch Friend</span>
        </button>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 space-y-3 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-between gap-2">
          <div>
            <h4 className="font-serif-title text-xl font-bold text-[#FFFDF8]">
              {char.name}
            </h4>
            <span className="text-[11px] text-[#B8A8D9]">{char.role}</span>
          </div>

          <span className="hidden sm:inline-block text-xs text-[#E8B878] font-serif italic">
            Talking to {recipientNickname}
          </span>
        </div>

        {/* Bubble text */}
        <div className="p-4 rounded-2xl bg-[#102A25]/90 border border-[#B8A8D9]/25 text-xs sm:text-sm text-[#F6F1E8] font-body leading-relaxed shadow-inner">
          "{dialogue}"
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          <button
            onClick={handleNextDialogue}
            className="px-3.5 py-1.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs text-[#FFFDF8] hover:bg-[#102A25] transition-all flex items-center gap-1.5"
          >
            <MessageCircle className="w-3 h-3 text-[#B8A8D9]" />
            <span>Aur Kuch Bolo</span>
          </button>

          <button
            onClick={handleSendHug}
            className="px-4 py-1.5 rounded-xl bg-[#B8A8D9] text-[#102A25] text-xs font-bold hover:bg-[#D8CEEE] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Heart className="w-3 h-3 fill-current" />
            <span>Virtual Warm Hug Lijiye 🧸</span>
          </button>
        </div>
      </div>
    </div>
  );
};
