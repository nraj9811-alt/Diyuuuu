import React, { useState } from 'react';
import { Mail, Sparkles, X, Heart, Feather, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { SurpriseEnvelopeItem } from '../types';
import { soundManager } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

interface SurpriseEnvelopeProps {
  envelopeData?: any;
  isOpen: boolean;
  onClose: () => void;
  recipientNickname: string;
}

const defaultEnvelopes: SurpriseEnvelopeItem[] = [
  {
    id: 'env-1',
    title: 'Letter 1: For When Your Tummy Hurts (Day 5 Period Care)',
    previewTitle: 'A Letter for Period Relief 🩸',
    sealColor: 'rose',
    hint: 'Garam paani aur adrak chai ke saath kholiye...',
    letterContent: `Dear Diyuuuu (Beendani ji),\n\nAaj period ka 5th day hai. Mujhe pata hai pichhle 4 dino mein aapne kitna dard, mood swings aur uncomfortable feeling jheli hai.\n\nAapko lag sakta hai ki aap chidchide lagte ho ya weak lagte ho, par sach yeh hai ki aap bohot zyada strong aur brave ho. Jab aap thak kar lette ho aur so jaate ho, toh lagta hai saare dard aapse door ho jayein.\n\nAaj bas blanket odh kar aaram kijiye. Koi guilt nahi, koi kaam nahi. Nishant Raj hamesha aapke saath khada hai.\n\nTake deep breaths. You are safe, loved, and deeply cared for. ☁️💜`,
    signature: 'With endless love & warm hugs,\nNishant Raj (Sir jiii)',
    category: 'Period Care',
  },
  {
    id: 'env-2',
    title: 'Letter 2: Open When You Miss My Hugs & Voice',
    previewTitle: 'When You Miss Me 🫂',
    sealColor: 'amber',
    hint: 'Aankhein band karke dil se mehsoos kijiye...',
    letterContent: `Meri Diyuuuu,\n\nJab bhi distance zyada lage ya lag raha ho ki koi paas nahi hai, bas apni aankhein band kijiye aur sochiye ki main aapke bilkul saamne khada hoon.\n\nMere dono haath aapki kamar par hain, aapka sar meri chest par hai, aur aap meri heartbeat sun rahe ho. Main aapke baal sehla raha hoon aur dheere se keh raha hoon:\n\n“Aapko kisi baat ki chinta karne ki zaroorat nahi hai. Main yahin hoon, hamesha aapke paas.”\n\nYeh sukoon kabhi khatam nahi hoga.`,
    signature: 'Aapka apna,\nNishant Raj',
    category: 'Intimacy & Hugs',
  },
  {
    id: 'env-3',
    title: 'Letter 3: A Reminder of How Precious & Cute You Are',
    previewTitle: 'Why You Are So Precious 🌸',
    sealColor: 'lavender',
    hint: 'Aapki muskaan ke naam...',
    letterContent: `Dear Madam Ji / bbg,\n\nKabhi kabhi aap mirror mein dekh kar shayad khud ko criticize karte ho, par aapko meri aankhon se dekhna chahiye.\n\nAapke woh chhote chhote nakhre, aapka gusse mein pout banana, aapki chhotu si height par bauni ban kar order dena—yeh sab milkar aapko duniya ki sabse pyari ladki banata hai.\n\nAap jab khilkhilakar haste ho, toh lagta hai aasmaan ke saare kaale baadal chhat gaye. Never ever doubt your worth. You are my most precious treasure.`,
    signature: 'Your #1 Admirer,\nNishant (Sir jiii)',
    category: 'Affirmation',
  },
  {
    id: 'env-4',
    title: 'Letter 4: Our Little Future Dreams & Late Night Chai',
    previewTitle: 'Future Chai Dates ☕',
    sealColor: 'emerald',
    hint: 'Ek pyara sa sapna jo sach hoga...',
    letterContent: `Diyuuuu,\n\nMaine socha hai ek din shaam ko halki baarish ho rahi hogi. Balkani mein do warm chairs hongi, dheere se purana music baj raha hoga aur hamare haathon mein adrak-elaichi ki garam chai hogi.\n\nKoi phone nahi, koi shor nahi. Bas aap mere kandhe par sar rakh kar baithte ho aur hum bina kuch bole ghanton tak baarish dekhte hain.\n\nYeh chhota sa sapna mere dil ke bohot kareeb hai. Aur yeh ek din sach hoga.`,
    signature: 'Forever promising this,\nNishant Raj',
    category: 'Future Dreams',
  },
  {
    id: 'env-5',
    title: 'Letter 5: Open When You Feel Like Crying or Overthinking',
    previewTitle: 'Safe Haven to Cry 🌧️',
    sealColor: 'gold',
    hint: 'Aapko strong banne ki zaroorat nahi hai...',
    letterContent: `Chhoti Si Jaan,\n\nAapko har waqt sab kuch handle karne ki zaroorat nahi hai. Agar aaj rona aa raha hai, toh ro lijiye. Rona kamzori nahi hoti, bas dil thoda halka hota hai.\n\nAapka overthinking mind kabhi kabhi bohot baatein sochta hai, par yaad rakhiye: jo kuch bhi ho, chahe kitna bhi cloudy lage, main hamesha aapka haath pakad kar chalunga.\n\nAap bilkul theek ho aur sab kuch settle ho jayega. Put on warm socks, drink a sip of water, and rest now.`,
    signature: 'Always here to protect you,\nYour Sir jiii (Nishant)',
    category: 'Emotional Sukoon',
  },
];

export const SurpriseEnvelope: React.FC<SurpriseEnvelopeProps> = ({
  envelopeData,
  isOpen,
  onClose,
  recipientNickname,
}) => {
  const { logAction } = useTheme();
  const [selectedEnvIndex, setSelectedEnvIndex] = useState<number>(0);
  const [unfolded, setUnfolded] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentEnv = defaultEnvelopes[selectedEnvIndex];

  const handleOpenEnvelope = () => {
    setUnfolded(true);
    soundManager.playComfortChime('star');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    logAction('interaction_click', 'Surprise Envelope', `Unfolded ${currentEnv.title}`);
  };

  const handleClose = () => {
    setUnfolded(false);
    onClose();
  };

  const sealColorsMap: Record<string, { bg: string; border: string; text: string }> = {
    rose: { bg: 'from-[#932738] to-[#5C1320]', border: 'border-rose-400/60', text: 'text-rose-200' },
    amber: { bg: 'from-[#B45309] to-[#78350F]', border: 'border-amber-400/60', text: 'text-amber-200' },
    lavender: { bg: 'from-[#6B21A8] to-[#4C1D95]', border: 'border-purple-400/60', text: 'text-purple-200' },
    emerald: { bg: 'from-[#065F46] to-[#064E3B]', border: 'border-emerald-400/60', text: 'text-emerald-200' },
    gold: { bg: 'from-[#CA8A04] to-[#854D0E]', border: 'border-yellow-400/60', text: 'text-yellow-200' },
  };

  const sealStyle = sealColorsMap[currentEnv.sealColor] || sealColorsMap.rose;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-body">
      <div className="relative max-w-xl w-full">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 p-2 rounded-full text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#173B32] transition-colors"
          aria-label="Close envelope"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Top Shelf Carousel between 5 Envelopes */}
        <div className="flex items-center justify-between pb-3 text-xs text-[#B8A8D9]">
          <div className="flex items-center gap-2">
            <span>💌</span>
            <span className="font-semibold">Letter {selectedEnvIndex + 1} of 5</span>
          </div>

          <div className="flex items-center gap-1.5">
            {defaultEnvelopes.map((env, idx) => (
              <button
                key={env.id}
                onClick={() => {
                  setSelectedEnvIndex(idx);
                  setUnfolded(false);
                  soundManager.playComfortChime('star');
                }}
                className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                  selectedEnvIndex === idx
                    ? 'bg-[#B8A8D9] text-[#102A25] scale-110 shadow'
                    : 'bg-[#173B32] text-[#A7B7A0] hover:text-[#FFFDF8]'
                }`}
                title={env.title}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {!unfolded ? (
          /* Sealed Envelope Card */
          <div
            onClick={handleOpenEnvelope}
            className="cursor-pointer group relative rounded-3xl bg-gradient-to-br from-[#1E2E28] via-[#14231E] to-[#0D1814] border-2 border-[#B8A8D9]/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl hover:scale-[1.02] transition-all select-none"
          >
            {/* Wax Seal */}
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${sealStyle.bg} border-2 ${sealStyle.border} mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
            >
              <span className={`font-serif-title text-2xl font-bold ${sealStyle.text}`}>
                {recipientNickname.slice(0, 1)}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#102A25] border border-[#B8A8D9]/20 text-[#B8A8D9] font-medium">
                {currentEnv.category}
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                {currentEnv.previewTitle}
              </h2>
              <p className="text-xs text-[#A7B7A0] max-w-sm mx-auto leading-relaxed">
                {currentEnv.hint}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-[#E8B878] group-hover:underline">
              <Sparkles className="w-4 h-4 text-[#E8B878]" />
              <span>Tap wax seal to break & unfold letter</span>
            </div>

            {/* Switch arrows */}
            <div className="pt-4 flex items-center justify-between border-t border-[#B8A8D9]/15 text-[11px] text-[#A7B7A0]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEnvIndex((prev) => (prev > 0 ? prev - 1 : defaultEnvelopes.length - 1));
                  setUnfolded(false);
                }}
                className="hover:text-[#FFFDF8] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Letter</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEnvIndex((prev) => (prev < defaultEnvelopes.length - 1 ? prev + 1 : 0));
                  setUnfolded(false);
                }}
                className="hover:text-[#FFFDF8] flex items-center gap-1"
              >
                <span>Next Letter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Unfolded Handwritten Letter */
          <div className="relative rounded-3xl bg-[#FFFDF8] text-[#1F2937] p-8 sm:p-12 shadow-2xl space-y-6 border border-[#B8A8D9]/50 animate-scale-up max-h-[85vh] overflow-y-auto">
            {/* Header Stamp */}
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div className="flex items-center gap-2 text-xs font-serif text-[#8B7E74]">
                <Feather className="w-4 h-4 text-[#B8A8D9]" />
                <span className="font-semibold">Nishant Raj ke Dil se · Letter {selectedEnvIndex + 1}/5</span>
              </div>
              <span className="text-[11px] text-[#A89F91]">
                {currentEnv.category}
              </span>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 font-serif-title text-base sm:text-lg leading-relaxed text-[#2C241D] whitespace-pre-line selection:bg-[#B8A8D9]/30">
              {currentEnv.letterContent}
            </div>

            {/* Signature */}
            <div className="pt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-serif text-sm text-[#4A3E3D]">
              <div className="whitespace-pre-line font-bold text-[#1F2937]">
                {currentEnv.signature}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedEnvIndex((prev) => (prev < defaultEnvelopes.length - 1 ? prev + 1 : 0));
                    setUnfolded(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#173B32] text-[#FFFDF8] text-xs font-sans font-semibold hover:bg-[#122A23] transition-colors"
                >
                  Read Next Letter →
                </button>
                <button
                  onClick={() => setUnfolded(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#D5CEC5] text-xs font-sans hover:bg-[#F3EFEA] transition-colors"
                >
                  Fold back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
