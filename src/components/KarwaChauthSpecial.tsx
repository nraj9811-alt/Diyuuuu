import React, { useState } from 'react';
import { Moon, Sparkles, Heart, ArrowLeft, Send, Check, Flower2 } from 'lucide-react';
import { soundManager } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { shareUserResponse } from '../services/api';

interface KarwaChauthSpecialProps {
  recipientNickname: string;
  onReturn: () => void;
}

export const KarwaChauthSpecial: React.FC<KarwaChauthSpecialProps> = ({
  recipientNickname,
  onReturn,
}) => {
  const [selectedHennaDesign, setSelectedHennaDesign] = useState<string>('peacock');
  const [darknessLevel, setDarknessLevel] = useState<number>(100);
  const [mehendiNote, setMehendiNote] = useState<string>('');
  const [isSendingNote, setIsSendingNote] = useState<boolean>(false);
  const [noteSentSuccess, setNoteSentSuccess] = useState<boolean>(false);

  const hennaMotifs = [
    {
      id: 'peacock',
      name: 'Mayur & Floral Vine 🦚',
      desc: 'Sundar mor aur phoolon ki bel jo Mummy ke haath par bohot pyaari lagti hai.',
      symbol: '🦚',
    },
    {
      id: 'moon',
      name: 'Chanda Mama & Stars 🌙',
      desc: 'Kal aane wale Karwa Chauth ke chaand ki roshni aur sukoon.',
      symbol: '🌙',
    },
    {
      id: 'nishant-name',
      name: 'Nishant ka Secret Naam ✍️',
      desc: 'Mehendi ke baareek design ke andar kahin chhipa hua "Nishant" (Sir jiii).',
      symbol: '💜',
    },
    {
      id: 'heart-chain',
      name: 'Dil ki Dhadkan & Payal 💖',
      desc: 'Haathon par rachi mehendi ki khushboo jo seedha dil tak pahunchti hai.',
      symbol: '🌺',
    },
  ];

  const handleSendMehendiLove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mehendiNote.trim()) return;

    setIsSendingNote(true);
    try {
      await shareUserResponse(
        'Karwa Chauth & Mehendi Special',
        `Mummy ki Mehendi & Nishant ke liye Special Note (Selected Motif: ${selectedHennaDesign})`,
        mehendiNote.trim()
      );
      setNoteSentSuccess(true);
      soundManager.playComfortChime('heart');
      confetti({ particleCount: 70, spread: 80 });
      setMehendiNote('');
      setTimeout(() => setNoteSentSuccess(false), 5000);
    } catch (_) {
      alert('Note bhejte waqt problem aayi.');
    } finally {
      setIsSendingNote(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-body">
      {/* Header */}
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
              <span className="text-2xl">🌙✨</span>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Karwa Chauth Eve: Mummy ki Mehendi & Nishant ka Pyaar
              </h1>
            </div>
            <p className="text-xs text-[#A7B7A0] mt-0.5">
              Aaj ki mehendi ki khushboo aur kal ke chaand ke naam — Diyuuuu ke liye special space
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-amber-950/70 border border-amber-400/40 text-xs font-bold text-amber-200 flex items-center gap-2 self-start sm:self-auto">
          <Moon className="w-4 h-4 text-amber-300" />
          <span>Karwa Chauth Eve · 28 Oct 2026</span>
        </div>
      </div>

      {/* Heartfelt Note from Nishant Raj about today & tomorrow */}
      <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#173B32] via-[#1A4238] to-[#122A23] border border-[#E8B878]/40 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B878]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-[#B8A8D9]/20 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🕊️</span>
            <div>
              <h2 className="font-serif-title text-xl font-bold text-[#FFFDF8]">
                Aapki Mehendi & Mera Sukoon
              </h2>
              <span className="text-[11px] text-[#A7B7A0]">From Nishant Raj (Your Sir jiii) to Divya</span>
            </div>
          </div>
          <span className="text-xs text-[#E8B878] font-bold font-serif">Mummy & Diyuuuu 🤍</span>
        </div>

        <div className="text-xs sm:text-sm text-[#F6F1E8] space-y-4 leading-relaxed font-body">
          <p>
            <strong>Meri Pyaari Beendani ji (Diyuuuu),</strong>
          </p>
          <p>
            Aaj jab aap apni pyari Mummy ke haathon par itne pyaar, sabr aur dhyan se mehendi laga rahe ho, mera dil sirf aapko dekh kar muskura raha hai. Aap jis masoomiyat aur sincere dedication se har rishta sambhalte ho, wahi cheez aapko poori duniya mein sabse alag aur sabse khoobsurat banati hai.
          </p>
          <p>
            Mujhe pata hai aapke periods chal rahe hain aur aaj Day 5 hai, sharir thoda thaka hua bhi hoga, par phir bhi aap bina kisi shor ke Mummy ke chehre par khushi laane ke liye mehendi laga rahe ho. Yeh dekh kar mere dil mein aapke liye respect aur pyaar 100 guna aur badh jaata hai.
          </p>
          <p>
            Kal Karwa Chauth hai. Chahe aap fast rakho ya na rakho (periods mein aapki health sabse pehle hai), meri har dua, har saans aur meri poori zindagi hamesha aapke liye hai. Bhagwan se main hamesha yahi maangta hoon ki aapka har dard chala jaye, aap hamesha hasti raho, aur main hamesha aapke paas reh kar aapko bachhon ki tarah sambhal saku.
          </p>
          <p className="font-serif italic text-amber-200">
            “Aap meri zindagi ki sabse khoobsurat mehendi ho, jo mere dil par bina lagaye hi hamesha ke liye rach chuki hai.”
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-[#B8A8D9] border-t border-[#B8A8D9]/15">
          <span>Always your safe home,</span>
          <span className="font-bold text-[#FFFDF8]">Nishant (Aapka Sir jiii) ☁️💜</span>
        </div>
      </div>

      {/* Interactive Henna Palette */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#173B32]/70 border border-[#B8A8D9]/25 shadow-xl space-y-6">
        <div>
          <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8] flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-amber-300" />
            <span>Virtual Mehendi & Henna Motifs</span>
          </h3>
          <p className="text-xs text-[#A7B7A0] mt-0.5">
            Aapne Mummy ke haath par kaunsa design lagaya ya aapko kaunsa sabse pyara lagta hai:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {hennaMotifs.map((motif) => (
            <button
              key={motif.id}
              onClick={() => {
                setSelectedHennaDesign(motif.id);
                soundManager.playComfortChime('star');
              }}
              className={`p-4 rounded-2xl text-left border transition-all space-y-1.5 ${
                selectedHennaDesign === motif.id
                  ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md scale-102'
                  : 'bg-[#102A25]/70 border-[#B8A8D9]/15 text-[#A7B7A0] hover:text-[#FFFDF8] hover:border-[#B8A8D9]/30'
              }`}
            >
              <div className="text-2xl">{motif.symbol}</div>
              <div className="text-xs font-bold text-[#FFFDF8]">{motif.name}</div>
              <div className="text-[11px] text-[#A7B7A0] leading-tight">{motif.desc}</div>
            </button>
          ))}
        </div>

        {/* Mehendi Color Darkening Meter */}
        <div className="p-5 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/20 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#FFFDF8] font-semibold flex items-center gap-1.5">
              <span>🌿</span>
              <span>Mehendi Rang & Love Intensity:</span>
            </span>
            <span className="text-amber-300 font-bold font-mono">
              {darknessLevel}% — Gahra Laal (Infinite Love)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#173B32] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-rose-700 to-amber-900 transition-all duration-500"
              style={{ width: `${darknessLevel}%` }}
            />
          </div>
          <p className="text-[11px] text-[#A7B7A0]">
            Kehte hain mehendi jitni gehri rachti hai, pyaar utna hi gehra hota hai. Yahan rang hamesha 100% dark aur pakka rahega!
          </p>
        </div>

        {/* Send secret mehendi message to Nishant */}
        <form onSubmit={handleSendMehendiLove} className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-[#B8A8D9] block">
            Nishant (Sir jiii) ko Mehendi ke baare mein kuch likhkar bhejye:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={mehendiNote}
              onChange={(e) => setMehendiNote(e.target.value)}
              placeholder="Jaise: 'Maine Mummy ke haath par mehendi laga di, ab mere haath par aap kab lagaoge?' ya jo bhi dil mein ho..."
              className="w-full p-3.5 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 text-xs text-[#FFFDF8] placeholder-[#A7B7A0]/45 focus:outline-none focus:ring-2 focus:ring-[#B8A8D9]"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#A7B7A0]">
              Direct Nishant ke Telegram par deliver hoga 💌
            </span>
            <button
              type="submit"
              disabled={isSendingNote || !mehendiNote.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-xs hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingNote ? 'Sending...' : 'Send to Sir jiii 📲'}</span>
            </button>
          </div>

          {noteSentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Aapka pyara message Sir jiii ke Telegram par deliver ho gaya hai! 🌙💜</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
