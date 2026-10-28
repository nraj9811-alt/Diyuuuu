import React, { useState } from 'react';
import { BookOpen, Mail, Calendar, Sparkles, Feather, ArrowLeft, Heart, Check, Copy } from 'lucide-react';
import { NoteItem, LetterItem } from '../types';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';

interface NotesAndLettersProps {
  notes?: NoteItem[];
  letters?: LetterItem[];
  recipientNickname: string;
  onReturn?: () => void;
}

const richDefaultNotes: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Jab pet mein dard ho (Day 5 Period Relief)',
    body: 'Aaj period ka 5th day hai. Thoda pet aur peeth mein dard ya thakan ho sakti hai. Aap garam paani pijiye, blanket lijiye aur aaram karte ho.',
    category: 'Period care',
    date: '2026-10-28',
    published: true,
    order: 1,
  },
  {
    id: 'note-2',
    title: 'Aapke chhote chhote nakhre',
    body: 'Jab aap kisi baat par naak sikodte ho ya chhotu sa pout banate ho, kasam se duniya ki saari cuteness ek taraf aur aapka chehra ek taraf.',
    category: 'Appreciation',
    date: '2026-10-28',
    published: true,
    order: 2,
  },
  {
    id: 'note-3',
    title: 'Cloudy days are gentle days',
    body: 'Baarish ka mausam sab kuch dho kar saaf kar deta hai. Waise hi cloudy days humein thoda rukne aur apni energy wapas paane ka mauka dete hain.',
    category: 'Cloudy-day notes',
    date: '2026-10-28',
    published: true,
    order: 3,
  },
  {
    id: 'note-4',
    title: 'Chai aur khamoshi',
    body: 'Shaam ko cup pakad kar baithna, bina kisi jaldbaazi ke, sabse bada sukoon hota hai jo aap khud ko dete ho.',
    category: 'Things worth remembering',
    date: '2026-10-28',
    published: true,
    order: 4,
  },
  {
    id: 'note-5',
    title: 'Sab kuch akele sambhalna zaroori nahi',
    body: 'Aap hamesha strong banne ki koshish karte ho. Par kabhi kabhi bas baith jana aur aaram karna hi sabse badi samajhdari hoti hai. Nishant sambhal lega.',
    category: 'Little reminders',
    date: '2026-10-28',
    published: true,
    order: 5,
  },
  {
    id: 'note-6',
    title: 'Bauni ji ki height aur attitude',
    body: 'Height chaho thodi si kam ho, par aapka hukm pure 6 feet ka chalta hai! Aur mujhe aapka yeh cute boss avatar bohot pasand hai.',
    category: 'Appreciation',
    date: '2026-10-28',
    published: true,
    order: 6,
  },
  {
    id: 'note-7',
    title: 'Gusse mein aap aur bhi pyare lagte ho',
    body: 'Jab aap bolte ho “main baat nahi karungi”, aur agle 2 minute mein khud hi dekh kar muskura dete ho... that is the sweetest thing ever.',
    category: 'Small memories',
    date: '2026-10-28',
    published: true,
    order: 7,
  },
  {
    id: 'note-8',
    title: 'Khaana time par khana zaroori hai',
    body: 'Khaaskar in dino jab periods chal rahe hain, empty stomach bilkul mat rahiye. Kuchh garam, halka aur tasty kha lijiye. Promise kijiye!',
    category: 'Period care',
    date: '2026-10-28',
    published: true,
    order: 8,
  },
  {
    id: 'note-9',
    title: 'Aapka sukoon mere liye sabse pehle hai',
    body: 'Duniya mein hazaron baatein hongi, par mera sabse favourite kaam yeh dekhna hai ki aap bina kisi chinta ke shaant aur khush sote ho.',
    category: 'Things worth remembering',
    date: '2026-10-28',
    published: true,
    order: 9,
  },
  {
    id: 'note-10',
    title: 'Pillow Cuddle Reminder',
    body: 'Abhi ke abhi ek soft pillow lijiye, usko pet ke paas lagakar thoda sa side mein letiye. Lower back ko bohot jaldi aaram milega.',
    category: 'Period care',
    date: '2026-10-28',
    published: true,
    order: 10,
  },
  {
    id: 'note-11',
    title: 'Late night calm talks',
    body: 'Jab duniya so jaati hai aur phone par dheere dheere aawaz mein baatein hoti hain, wahi din ka sabse sachha hissa lagta hai.',
    category: 'Small memories',
    date: '2026-10-28',
    published: true,
    order: 11,
  },
  {
    id: 'note-12',
    title: 'Aap jaise ho, waise perfect ho',
    body: 'Kabhi kisi ke liye khud ko badalne ki zaroorat nahi hai. Aapki saadgi, aapki masti aur aapka gussa sab kuch anmol hai.',
    category: 'Appreciation',
    date: '2026-10-28',
    published: true,
    order: 12,
  },
  {
    id: 'note-13',
    title: 'Bina wajah ki smile',
    body: 'Yeh note padhte waqt agar aapke hothon par halki si muskaan aayi hai, toh mera yeh note likhna 100% successful ho gaya.',
    category: 'Little reminders',
    date: '2026-10-28',
    published: true,
    order: 13,
  },
  {
    id: 'note-14',
    title: 'Warm Socks & Soft Blanket',
    body: 'Thande pair cramps ko badhate hain. Warm socks pehniye aur khud ko bilkul warm rakhiye. Body jaldi heal hoti hai.',
    category: 'Period care',
    date: '2026-10-28',
    published: true,
    order: 14,
  },
  {
    id: 'note-15',
    title: 'Baarish aur Nishant ki chai',
    body: 'Ek din main khud aapke liye elaichi aur adrak wali kadak chai bana kar launga. Aap bas khidki ke paas baith kar enjoy karte ho.',
    category: 'Things worth remembering',
    date: '2026-10-28',
    published: true,
    order: 15,
  },
  {
    id: 'note-16',
    title: 'Hamesha aapke paas',
    body: 'Aap jab bhi cloudy feel karte ho, yaad rakhiye Nishant Raj sirf ek call ya ek message ki doori par khada hai. You are never alone.',
    category: 'Little reminders',
    date: '2026-10-28',
    published: true,
    order: 16,
  },
];

export const NotesAndLetters: React.FC<NotesAndLettersProps> = ({
  notes: propNotes,
  letters: propLetters,
  recipientNickname,
  onReturn,
}) => {
  const { logAction } = useTheme();
  const [activeTab, setActiveTab] = useState<'notes' | 'letter'>('notes');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  const notesList = (propNotes && propNotes.length >= 8) ? propNotes : richDefaultNotes;

  const categories = [
    'All',
    'Period care',
    'Little reminders',
    'Things worth remembering',
    'Cloudy-day notes',
    'Appreciation',
    'Small memories',
  ];

  const filteredNotes = selectedCategory === 'All'
    ? notesList
    : notesList.filter((n) => n.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    soundManager.playComfortChime('star');
    setTimeout(() => setCopiedNoteId(null), 2000);
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
              <span className="text-xl">📖✍️</span>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Notes & Letters for {recipientNickname}
              </h1>
            </div>
            <p className="text-xs text-[#A7B7A0] mt-0.5">
              16+ Handwritten sticky notes & heartfelt letters crafted by Nishant Raj
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs text-[#B8A8D9] flex items-center gap-2 self-start sm:self-auto">
          <span>Total Sticky Notes:</span>
          <span className="font-bold text-[#FFFDF8]">{notesList.length}</span>
        </div>
      </div>

      {/* Primary Section Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/20">
          <button
            onClick={() => {
              setActiveTab('notes');
              logAction('section_view', 'Notes', 'Viewed Notes list');
            }}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'notes'
                ? 'bg-[#B8A8D9] text-[#102A25] shadow-sm'
                : 'text-[#A7B7A0] hover:text-[#FFFDF8]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sticky Notes Desk ({notesList.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('letter');
              logAction('section_view', 'Letter', 'Viewed Main Letter');
            }}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'letter'
                ? 'bg-[#B8A8D9] text-[#102A25] shadow-sm'
                : 'text-[#A7B7A0] hover:text-[#FFFDF8]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Grand Letter from Nishant 💌</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: STICKY NOTES DESK */}
      {/* ============================================================ */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  soundManager.playComfortChime('star');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-[#B8A8D9] text-[#102A25] font-bold shadow-sm'
                    : 'bg-[#173B32] text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#122A23] border border-[#B8A8D9]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note, index) => {
              // Alternate warm pastel sticky note styling with washi tape
              const tapeStyles = ['bg-rose-400/40', 'bg-amber-400/40', 'bg-purple-400/40', 'bg-emerald-400/40'];
              const tapeColor = tapeStyles[index % tapeStyles.length];

              return (
                <div
                  key={note.id}
                  className="group relative rounded-2xl bg-[#FFFDF8] text-[#1F2937] p-6 shadow-lg border border-[#E5E0D8] space-y-3 transition-transform hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Washi Tape Header */}
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 ${tapeColor} rounded-xs shadow-xs rotate-[-1deg] pointer-events-none`}
                  />

                  {/* Note Header */}
                  <div className="flex items-center justify-between text-xs text-[#8B7E74] pt-2 border-b border-[#F0EBE3] pb-2">
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-[#F3EFEA] text-[10px] text-[#5C5346]">
                      {note.category}
                    </span>
                    <button
                      onClick={() => handleCopyNote(note.id, `${note.title}\n\n${note.body}`)}
                      className="p-1 rounded text-[#8B7E74] hover:text-[#1F2937]"
                      title="Copy note text"
                    >
                      {copiedNoteId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#2C241D] leading-snug">
                    {note.title}
                  </h3>

                  {/* Body Text */}
                  <p className="font-serif text-sm text-[#4A3E3D] leading-relaxed whitespace-pre-line selection:bg-[#B8A8D9]/40">
                    {note.body}
                  </p>

                  {/* Footer with Pin & Date */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#A89F91]">
                    <span>From Nishant Raj</span>
                    <span>{note.date || 'Handwritten'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: GRAND LETTER */}
      {/* ============================================================ */}
      {activeTab === 'letter' && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-[#FFFDF8] text-[#1F2937] p-8 sm:p-12 shadow-2xl border border-[#B8A8D9]/40 space-y-6 animate-scale-up">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
            <div className="flex items-center gap-2 text-xs font-serif text-[#8B7E74]">
              <Feather className="w-4 h-4 text-[#B8A8D9]" />
              <span className="font-semibold">Nishant Raj (Sir jiii)</span>
            </div>
            <span className="text-xs text-[#A89F91]">Personal Sanctuary Letter</span>
          </div>

          <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed text-[#2C241D] whitespace-pre-line">
            {`Dear Diyuuuu (Beendani ji / Madam Ji),\n
Aap jab bhi yeh letter padhte ho, chahe din kaisa bhi raha ho, I hope yeh chhota sa corner aapko thoda sukoon aur warmth de sake.\n
Yeh website maine isliye banayi taaki aapke paas hamesha ek aisi jagah ho jahan koi shor na ho, koi expectation na ho, aur na hi koi pressure ho. Jab baahar cloudy lage ya sharir thoda thaka hua ho (khaaskar in dino periods ke dauraan), toh aap yahan aakar baarish ki awaaz sunte ho, soft music chalate ho, ya bas shaant pal bitate ho.\n
Aap jaise ho, bohot genuine aur special lagte ho. Har din perfect nahi hota, par aapka sukoon hamesha zaroori hai.\n
Aap jab chahein, apne pace par explore karte ho. Yeh chhota sa world hamesha yahin rahega, aapke liye.`}
          </div>

          <div className="pt-6 border-t border-[#E5E0D8] flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-serif text-sm text-[#4A3E3D]">
            <div className="whitespace-pre-line font-bold text-[#1F2937]">
              Always wishing you peace & warm hugs,\n
              Nishant Raj (Your Sir jiii)
            </div>
            <div className="text-xs text-[#A89F91]">
              October 2026 · Specially for Divya
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
