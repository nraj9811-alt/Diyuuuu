import React, { useState } from 'react';
import { Heart, Sparkles, ArrowLeft, ArrowRight, Check, Send, Mail, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { shareUserResponse } from '../services/api';

interface DivyaHeartQuizProps {
  recipientNickname: string;
  onReturn: () => void;
}

interface QuestionItem {
  id: string;
  title: string;
  options: string[];
}

export const DivyaHeartQuiz: React.FC<DivyaHeartQuizProps> = ({
  recipientNickname,
  onReturn,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  // Final letter & Divya's secret reply state
  const [finalLetterOpen, setFinalLetterOpen] = useState<boolean>(false);
  const [finalReplyText, setFinalReplyText] = useState<string>('');
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);
  const [replySentSuccess, setReplySentSuccess] = useState<boolean>(false);

  const questions: QuestionItem[] = [
    {
      id: 'q1',
      title: 'Aapka mood aur tabiyat abhi kaisa chal raha hai?',
      options: [
        'Thoda thaka hua aur periods cramps hain, bohot saara aaram chahiye 🌸',
        'Sir jiii ki bohot zyada yaad aa rahi hai 🥺',
        'Mummy ke sath mehendi lagane mein busy aur khush hoon ✨',
        'Ekdam cozy, shant aur comfortable lag raha hai ☁️',
      ],
    },
    {
      id: 'q2',
      title: 'Nishant (Sir jiii) se abhi sabse zyada kya craving ho rahi hai?',
      options: [
        'Ekdam nonstop deep lips kiss aur tightest bear hug 💋',
        'Mere baalon ke sath khele aur forehead chumta rahe 🧸',
        'Garam adrak chai aur hot water bag lakar de ☕',
        'Bas chupchap mujhe apni baahon mein lekar so jaye 💤',
      ],
    },
    {
      id: 'q3',
      title: 'Mummy ke haath par mehendi lagate waqt aapke dimaag mein kya chal raha tha?',
      options: [
        'Mummy ke chehre ki khushi dekh kar bohot accha laga 🌿',
        'Soch rahi thi ki Nishant ka naam mehendi mein kahan chhupau 😉',
        'Kal ke Karwa Chauth ke chaand aur humare future ke baare mein soch rahi thi 🌙',
        'Haath thoda thak gaye par Mummy ke liye khushi bohot mili 🌺',
      ],
    },
    {
      id: 'q4',
      title: 'Jab hum dono akele milenge, toh pehle 5 minute mein aap kya karoge?',
      options: [
        'Bina kuch bole aakar ekdam zor se chipak jaungi 🫂',
        'Sir jiii ko dekhti rahungi aur sharma kar muskuraungi 🙈',
        'Direct unke honthon par nonstop deep kiss karungi 💋',
        'Unke kandhe par sar rakh kar saara sukoon mehsoos karungi 🕊️',
      ],
    },
    {
      id: 'q5',
      title: 'Nishant Raj (Sir jiii) ki kaunsi cheez aapke dil ko sabse zyada touch karti hai?',
      options: [
        'Jis tarah wo meri har chhoti baat aur periods care ka dhyaan rakhte hain 💖',
        'Unka mujhe full respect ke sath aur pyare nicknames se bulana 👑',
        'Unka mere bina bole meri aankhon se sab samajh jaana 🤍',
        'Unka mujh par jaan chhidakna aur unconditionally pyaar karna 🥰',
      ],
    },
  ];

  const currentQ = questions[currentStep];

  const handleSelectOption = (opt: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
    soundManager.playComfortChime('star');
  };

  const handleNextStep = async () => {
    const chosen = selectedAnswers[currentQ.id] || customAnswers[currentQ.id] || 'Option not selected';
    const finalAnswer = customAnswers[currentQ.id]?.trim()
      ? `${chosen} (Additional: ${customAnswers[currentQ.id].trim()})`
      : chosen;

    setIsSubmitting(true);
    try {
      await shareUserResponse(
        `Step-by-Step Heart Q&A (Question ${currentStep + 1})`,
        currentQ.title,
        finalAnswer
      );
      setSubmittedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
      soundManager.playComfortChime('success');
      confetti({ particleCount: 40, spread: 60 });
    } catch (_) {}
    finally {
      setIsSubmitting(false);
      setCurrentStep((s) => s + 1);
    }
  };

  const handleSendFinalReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalReplyText.trim()) return;

    setIsSendingReply(true);
    try {
      await shareUserResponse(
        'FINAL SECRET MESSAGE FROM DIYUUUU',
        'Divya ka Nishant ke liye Aakhri Secret Letter 💌',
        finalReplyText.trim()
      );
      setReplySentSuccess(true);
      soundManager.playComfortChime('heart');
      confetti({ particleCount: 100, spread: 100 });
      setFinalReplyText('');
    } catch (_) {
      alert('Message bhejne mein problem aayi.');
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-body">
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
              <span className="text-2xl">💌✨</span>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Divya's Heart Check-In & Q&A
              </h1>
            </div>
            <p className="text-xs text-[#A7B7A0] mt-0.5">
              5 pyare sawal, Nishant ka final khat, aur aapka aakhri secret reply jo sidha Telegram par jayega.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs font-semibold text-[#B8A8D9] self-start sm:self-auto">
          {currentStep < questions.length
            ? `Question ${currentStep + 1} of ${questions.length}`
            : 'Final Message Journey ✨'}
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentStep
                ? 'w-8 bg-[#E8B878]'
                : idx < currentStep
                ? 'w-4 bg-emerald-400'
                : 'w-2 bg-[#173B32] border border-[#B8A8D9]/30'
            }`}
          />
        ))}
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            currentStep >= questions.length ? 'w-8 bg-purple-400' : 'w-2 bg-[#173B32] border border-[#B8A8D9]/30'
          }`}
        />
      </div>

      {/* STEP 1 TO 5: QUESTIONS */}
      {currentStep < questions.length && (
        <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#173B32] to-[#122A23] border border-[#B8A8D9]/30 shadow-2xl space-y-6 animate-scale-up">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#E8B878] uppercase tracking-wider">
              Question {currentStep + 1} of {questions.length}
            </span>
            <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#FFFDF8]">
              {currentQ.title}
            </h2>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedAnswers[currentQ.id] === opt;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-rose-950/90 border-rose-400 text-rose-100 shadow-md scale-101'
                      : 'bg-[#102A25]/80 border-[#B8A8D9]/20 text-[#A7B7A0] hover:text-[#FFFDF8] hover:border-[#B8A8D9]/40'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                    isSelected ? 'bg-rose-500 border-rose-300 text-white' : 'border-[#B8A8D9]/40 text-[#A7B7A0]'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Write-in Field */}
          <div className="space-y-1.5 pt-2 border-t border-[#B8A8D9]/15">
            <label className="text-xs text-[#A7B7A0] block">
              Ya apne shabdon mein kuch aur likhna chahein (Optional):
            </label>
            <input
              type="text"
              value={customAnswers[currentQ.id] || ''}
              onChange={(e) =>
                setCustomAnswers({ ...customAnswers, [currentQ.id]: e.target.value })
              }
              placeholder="Apna custom answer yahan likh sakte ho..."
              className="w-full p-3 rounded-xl bg-[#102A25] border border-[#B8A8D9]/25 text-xs text-[#FFFDF8] placeholder-[#A7B7A0]/40 focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
            />
          </div>

          {/* Next Button */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-[#A7B7A0]">
              Answer select karke aage badhiye ☁️💜
            </span>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting || (!selectedAnswers[currentQ.id] && !customAnswers[currentQ.id]?.trim())}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
            >
              <span>{isSubmitting ? 'Saving...' : currentStep === questions.length - 1 ? 'Finish & Open Final Letter →' : 'Next Question →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FINAL STAGE: NISHANT'S FINAL LETTER & DIVYA'S SECRET REPLY */}
      {currentStep >= questions.length && (
        <div className="space-y-8 animate-fade-in">
          {/* Nishant's Final Letter */}
          <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#173B32] via-[#1A4238] to-[#122A23] border border-[#E8B878]/50 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#B8A8D9]/20 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📜</span>
                <div>
                  <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#FFFDF8]">
                    Nishant Raj's Final Letter to Diyuuuu
                  </h2>
                  <span className="text-[11px] text-[#A7B7A0]">A message from his heart on a cloudy day</span>
                </div>
              </div>
              <button
                onClick={() => setFinalLetterOpen(!finalLetterOpen)}
                className="px-3.5 py-1.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 text-xs text-[#B8A8D9] hover:text-[#FFFDF8]"
              >
                {finalLetterOpen ? 'Fold Letter' : 'Unfold Letter 💌'}
              </button>
            </div>

            <div className="text-xs sm:text-sm text-[#F6F1E8] space-y-4 leading-relaxed font-body">
              <p><strong>Dearest Divya (My Little World),</strong></p>
              <p>
                Yeh website sirf ek page nahi hai, yeh ek aisi jagah hai jahan aap hamesha sukoon paate ho. Chahe aapke periods chal rahe hon, mood heavy ho, ya duniya mein bohot shor ho — aapko kabhi kisi se ladne ya khud par sakht hone ki zaroorat nahi hai.
              </p>
              <p>
                Main aapse kitna pyaar karta hoon, yeh kisi ek word ya message mein bayan nahi ho sakta. Main bas itna chahta hoon ki aap hamesha hasti raho, khush raho, aur yeh yaad rakho ki Nishant aapka sabse bada protector, best friend aur safe corner hai.
              </p>
              <p className="font-serif italic text-amber-200">
                “Aap jaise ho, waise hi mere liye perfect ho. With endless kisses on your forehead, cheeks and lips... forever yours.”
              </p>
              <p className="text-right font-serif text-[#B8A8D9]">
                — Nishant Raj (Aapka Sir jiii) ☁️💜
              </p>
            </div>
          </div>

          {/* Divya's Final Secret Message Box */}
          <div className="p-6 sm:p-9 rounded-3xl bg-[#173B32]/75 border border-[#B8A8D9]/30 shadow-2xl space-y-5">
            <div className="space-y-1">
              <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8] flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-300" />
                <span>Divya ka Nishant ke liye Final Secret Reply 💌</span>
              </h3>
              <p className="text-xs text-[#A7B7A0]">
                Aapke mann mein jo bhi baat ho, jo aap Nishant se kehna chahte ho — bina kisi jhijhak ke yahan likhiye. Yeh sidha unke personal Telegram par deliver hoga.
              </p>
            </div>

            <form onSubmit={handleSendFinalReply} className="space-y-4">
              <textarea
                rows={5}
                required
                value={finalReplyText}
                onChange={(e) => setFinalReplyText(e.target.value)}
                placeholder="Nishant, mujhe aapse yeh kehna hai..."
                className="w-full p-4 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 text-xs sm:text-sm text-[#FFFDF8] placeholder-[#A7B7A0]/45 focus:outline-none focus:ring-2 focus:ring-[#B8A8D9] leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-[#A7B7A0]">
                  🔒 Strictly private: Directly forwarded to Sir jiii's Telegram
                </span>

                <button
                  type="submit"
                  disabled={isSendingReply || !finalReplyText.trim()}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-rose-500 text-white font-bold text-xs sm:text-sm hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingReply ? 'Sending to Sir jiii...' : 'Send Secretly to Nishant 📲'}</span>
                </button>
              </div>

              {replySentSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs sm:text-sm text-emerald-200 flex items-center gap-2.5 animate-fade-in shadow-inner">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Aapka aakhri secret message Nishant Raj (Sir jiii) ke paas Telegram par deliver ho gaya hai! ☁️💜</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
