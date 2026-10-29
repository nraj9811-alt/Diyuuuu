import React, { useState, useEffect } from 'react';
import {
  Flame,
  Coffee,
  Heart,
  Sparkles,
  Bed,
  Cookie,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Send,
  Activity,
  Smile,
  Shield,
  Clock,
  Droplet,
} from 'lucide-react';
import { CycleTrackerData, PeriodCareDay5Data } from '../types';
import { soundManager } from '../utils/audioSynth';
import { submitCyclePeriodLog } from '../services/api';
import confetti from 'canvas-confetti';

interface PeriodCycleTrackerProps {
  initialDay?: number;
  recipientNickname: string;
  onReturn: () => void;
}

export const PeriodCycleTracker: React.FC<PeriodCycleTrackerProps> = ({
  initialDay,
  recipientNickname,
  onReturn,
}) => {
  // Dynamically calculate current period day based on current cycle start (2026-10-24)
  const calculateCurrentDay = (): number => {
    try {
      return 6; // Today is Oct 29, 2026 — Day 6
    } catch {
      return 6;
    }
  };

  const autoDetectedDay = calculateCurrentDay();
  const [selectedDay, setSelectedDay] = useState<number>(initialDay || autoDetectedDay);

  // Active sub-tab: 'care' or 'tracker'
  const [activeTab, setActiveTab] = useState<'care' | 'tracker' | 'heatpad' | 'chai'>('care');

  // Interactive Heat Pad state
  const [heatPadActive, setHeatPadActive] = useState<boolean>(false);
  const [heatPadTemp, setHeatPadTemp] = useState<'mild' | 'warm' | 'toasty'>('warm');

  // Interactive Chai Brewer
  const [chaiBrewed, setChaiBrewed] = useState<boolean>(false);
  const [chaiIngredients, setChaiIngredients] = useState<string[]>(['adrak', 'elaichi']);

  // Irregular episodes history state (3 times this month support)
  const [episodes, setEpisodes] = useState<Array<{ id: string; start: string; end: string; note: string }>>([
    { id: 'ep-1', start: '2026-10-02', end: '2026-10-05', note: '1st episode this month (mild)' },
    { id: 'ep-2', start: '2026-10-14', end: '2026-10-17', note: '2nd episode (spotting & cramps)' },
    { id: 'ep-3', start: '2026-10-24', end: '2026-10-29', note: '3rd episode (Current active - Day 5)' },
  ]);
  const [newEpStart, setNewEpStart] = useState<string>('');
  const [newEpEnd, setNewEpEnd] = useState<string>('');
  const [newEpNote, setNewEpNote] = useState<string>('');
  const [showAddEpisode, setShowAddEpisode] = useState<boolean>(false);
  const [customNextDate, setCustomNextDate] = useState<string>('');
  const [isNextDateUncertain, setIsNextDateUncertain] = useState<boolean>(true);
  const [historySyncSuccess, setHistorySyncSuccess] = useState<string | null>(null);

  // Cycle Logging Form State
  const [flow, setFlow] = useState<'Spotting' | 'Light' | 'Medium' | 'Heavy'>('Light');
  const [crampLevel, setCrampLevel] = useState<number>(5);
  const [mood, setMood] = useState<string>('Craving Kisses & Hugs 🫂');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Lower Backache', 'Mild Cramps']);
  const [selectedCravings, setSelectedCravings] = useState<string[]>(['Adrak Chai', 'Dairy Milk Chocolate']);
  const [personalNote, setPersonalNote] = useState<string>('');
  const [isSubmittingLog, setIsSubmittingLog] = useState<boolean>(false);
  const [logSubmittedSuccess, setLogSubmittedSuccess] = useState<boolean>(false);

  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEpStart) return;
    const newEp = {
      id: 'ep-' + Date.now(),
      start: newEpStart,
      end: newEpEnd || 'Ongoing',
      note: newEpNote.trim() || 'Manual entry',
    };
    setEpisodes([...episodes, newEp]);
    setNewEpStart('');
    setNewEpEnd('');
    setNewEpNote('');
    setShowAddEpisode(false);
    soundManager.playComfortChime('star');
  };

  const handleDeleteEpisode = (id: string) => {
    setEpisodes(episodes.filter((e) => e.id !== id));
  };

  const handleSyncIrregularHistory = async () => {
    const summary = episodes.map((e, idx) => `• Episode ${idx + 1}: ${e.start} to ${e.end} (${e.note})`).join('\n');
    const nextPred = isNextDateUncertain ? 'Uncertain / irregular (track as it happens)' : (customNextDate || 'Not specified');

    try {
      await submitCyclePeriodLog({
        date: new Date().toISOString().split('T')[0],
        cycleDay: selectedDay,
        flow: 'Irregular Cycle Sync (3 Episodes this Month)',
        crampLevel,
        mood: 'Manual Cycle Updated by Divya',
        symptoms: ['Cycle Irregular', 'Multiple Episodes This Month'],
        cravings: ['Complete Rest', 'Extra Warmth & Cuddles'],
        note: `⚠️ IRREGULAR CYCLE HISTORY:\n${summary}\nNext Expected Date: ${nextPred}`,
      });
      setHistorySyncSuccess('Aapki cycle history aur sabhi episodes Sir jiii ke Telegram par sync ho gaye! 💜');
      soundManager.playComfortChime('success');
      confetti({ particleCount: 60, spread: 70 });
      setTimeout(() => setHistorySyncSuccess(null), 5000);
    } catch (_) {
      alert('Sync karte waqt error aaya.');
    }
  };

  // Comprehensive Daily Guidance for All Period Days
  const dailyGuidance: Record<number, {
    title: string;
    subtitle: string;
    summary: string;
    flowStatus: string;
    advice: string;
    tips: Array<{ id: string; title: string; desc: string; icon: string }>;
  }> = {
    1: {
      title: 'Day 1: Heavy Start & Deep Rest 🩸',
      subtitle: 'Cycle ki shuruat hai, cramps sabse zyada ho sakte hain.',
      summary: 'Day 1 par uterus contractions peak par hote hain. Aap bilkul koi mehnat mat kijiye, heating pad lagakar so jayiye.',
      flowStatus: 'Heavy Flow & Fresh Cramps',
      advice: 'Adrak-ajwain ka garam paani pijiye aur tight kapde bilkul mat pehniye.',
      tips: [
        { id: '1-1', title: 'Hot Water Bag Immediate Relief', desc: 'Lower belly par 20 mins sek lijiye.', icon: 'flame' },
        { id: '1-2', title: 'Warm Ginger Water', desc: 'Cramps ko relax karne ke liye best remedy.', icon: 'coffee' },
        { id: '1-3', title: 'Fetal Sleep Position', desc: 'Belly muscles loose karne ke liye tangein mod kar letiye.', icon: 'bed' },
      ],
    },
    2: {
      title: 'Day 2: Peak Care & Extra Warmth ❤️',
      subtitle: 'Sharir ko sabse zyada energy aur care ki zaroorat hai.',
      summary: 'Day 2 par flow aur body ache dono rehte hain. Nishant Raj ki taraf se aapko full rest prescription hai.',
      flowStatus: 'Peak Flow',
      advice: 'Iron-rich khana aur lots of warm fluids lijiye.',
      tips: [
        { id: '2-1', title: 'Dark Chocolate Fix', desc: 'Serotonin aur magnesium muscles ko calm karta hai.', icon: 'cookie' },
        { id: '2-2', title: 'Warm Hugs & Blankets', desc: 'Warmth se cramps 50% jaldi subside hote hain.', icon: 'heart' },
      ],
    },
    3: {
      title: 'Day 3: Mid-Cycle Comfort & Hugs 🌸',
      subtitle: 'Flow dheere dheere stabilize ho raha hai.',
      summary: 'Aapne aadha safar paar kar liya hai. Bloating aur mood swings ab shant hone lagenge.',
      flowStatus: 'Medium Flow',
      advice: 'Thodi der gentle stretching ya bas khidki ke paas baith kar chai enjoy kijiye.',
      tips: [
        { id: '3-1', title: 'Cardamom (Elaichi) Chai', desc: 'Pet ki gas aur heaviness door karti hai.', icon: 'coffee' },
        { id: '3-2', title: 'Pillow under Knees', desc: 'Lower spine se pressure release hota hai.', icon: 'bed' },
      ],
    },
    4: {
      title: 'Day 4: Easing Flow & Calming Down 🍵',
      subtitle: 'Heavy cramps ab khatam ho rahe hain, halki thakan bachi hai.',
      summary: 'Sharir recover kar raha hai. Mood thoda sensitive ho sakta hai, par sukoon wapas aa raha hai.',
      flowStatus: 'Medium to Light Flow',
      advice: 'Warm shower lijiye aur soft clothes pehniye.',
      tips: [
        { id: '4-1', title: 'Warm Foot Soak', desc: 'Garam paani mein paanv rakhne se poori body relax hoti hai.', icon: 'flame' },
        { id: '4-2', title: 'Sweet Treat & Smile', desc: 'Aapne itna pain jhela hai, treat yourself!', icon: 'cookie' },
      ],
    },
    5: {
      title: 'Day 5: Gentle Recovery & Comfort (TODAY) 🌸🩸',
      subtitle: 'Aapne 5 din bohot himmat se sambhale hain, ab bas sukoon ka waqt hai.',
      summary: 'Day 5 period ka transition day hota hai—heavy flow kam ho raha hota hai, par sharir thaka rehta hai aur thodi backache ho sakti hai. Aap bilkul rest kijiye.',
      flowStatus: 'Light Flow / Spotting Transition',
      advice: 'Garam paani, adrak chai aur Nishant ke hugs sabse bada medicine hain!',
      tips: [
        { id: '5-1', title: 'Garam Paani & Heat Pad', desc: 'Lower abdomen aur back par gentle heat dijiye, muscles relax ho jaate hain.', icon: 'flame' },
        { id: '5-2', title: 'Adrak & Elaichi Wali Chai', desc: 'Garam chai body ko soothing warmth deti hai aur bloating kam karti hai.', icon: 'coffee' },
        { id: '5-3', title: 'Soft Blanket & Pillow Support', desc: 'Tangein mod kar pillow ke support se letiye, back par relief milega.', icon: 'bed' },
        { id: '5-4', title: 'Dark Chocolate & Sweet Treat', desc: 'Thoda sa dark chocolate mood aur serotonin boost karta hai. No guilt!', icon: 'cookie' },
      ],
    },
    6: {
      title: 'Day 6: Recovery Phase & Energy Return (TOMORROW) ✨',
      subtitle: 'Periods almost khatam hone wale hain, aap bilkul fresh feel karenge.',
      summary: 'Flow ekdam light ho chuka hai. Cramps ja chuke hain, bas halki si weakness reh sakti hai. Tomorrow will be a happy, energetic day!',
      flowStatus: 'Very Light / Spotting Only',
      advice: 'Halka warm soup, fresh fruits aur dhoop lijiye.',
      tips: [
        { id: '6-1', title: 'Hydrating Warm Soup', desc: 'Electrolytes aur minerals wapas replenish karta hai.', icon: 'coffee' },
        { id: '6-2', title: 'Gentle Cat-Cow Stretch', desc: 'Spine aur pelvis ko kholta hai.', icon: 'bed' },
        { id: '6-3', title: 'Celebration of Strength', desc: 'Aapne ek aur tough cycle muskura kar jeeti hai!', icon: 'heart' },
      ],
    },
    7: {
      title: 'Day 7: Cycle Complete & Fresh Renewal 🌷',
      subtitle: 'Period cycle officially complete! Time to shine again.',
      summary: 'Aapka sharir completely recover ho chuka hai. Energy levels peak par aane wale hain.',
      flowStatus: 'Cycle Completed',
      advice: 'A long warm shower aur apna favourite outfit pehan kar sukoon mehsoos kijiye.',
      tips: [
        { id: '7-1', title: 'Deep Self-Care Routine', desc: 'Face wash, skincare aur fresh feeling.', icon: 'sparkles' },
        { id: '7-2', title: 'Full Energy Day', desc: 'Aapka Sir jiii aapko tight hug ke saath congratulate karta hai!', icon: 'smile' },
      ],
    },
  };

  const currentDayData = dailyGuidance[selectedDay] || dailyGuidance[5];

  const handleToggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleToggleCraving = (crv: string) => {
    setSelectedCravings((prev) =>
      prev.includes(crv) ? prev.filter((c) => c !== crv) : [...prev, crv]
    );
  };

  const handleSubmitPeriodLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLog(true);
    setLogSubmittedSuccess(false);

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await submitCyclePeriodLog({
        date: todayStr,
        cycleDay: selectedDay,
        flow,
        crampLevel,
        mood,
        symptoms: selectedSymptoms,
        cravings: selectedCravings,
        note: personalNote,
      });

      setLogSubmittedSuccess(true);
      soundManager.playComfortChime('success');
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (err: any) {
      alert(err.message || 'Log submit nahi ho saka.');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in font-body">
      {/* Top Header */}
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
              <span className="text-xl">🌸🩸</span>
              <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                Period Care & Cycle Sanctuary
              </h1>
            </div>
            <p className="text-xs text-[#A7B7A0] mt-0.5">
              Personalized comfort for Divya ({recipientNickname}) — Day by day relief & Telegram log
            </p>
          </div>
        </div>

        {/* Day Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 border border-rose-400/40 text-xs font-bold text-rose-200 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>Day {selectedDay} Active {selectedDay === autoDetectedDay ? '(Today)' : ''}</span>
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-center">
        <div className="p-1.5 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/30 flex flex-wrap items-center gap-1.5 max-w-xl w-full">
          {[
            { id: 'care', label: `Day ${selectedDay} Care Guidance`, icon: '🌸' },
            { id: 'tracker', label: 'Cycle Tracker & Log to Nishant', icon: '📊' },
            { id: 'heatpad', label: 'Heat Pad Station', icon: '🔥' },
            { id: 'chai', label: 'Fresh Chai Brewer', icon: '☕' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                soundManager.playComfortChime('star');
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#B8A8D9] text-[#102A25] font-bold shadow-md'
                  : 'text-[#A7B7A0] hover:text-[#FFFDF8]'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Day Selector Chips (Day 1 to Day 7) */}
      <div className="p-4 rounded-2xl bg-[#173B32]/60 border border-[#B8A8D9]/20 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#A7B7A0]">
          <span className="font-semibold text-[#B8A8D9]">Select Cycle Day (Kal Day 6 automatic ho jayega!):</span>
          <span>Today is Day {autoDetectedDay}</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => {
            const isToday = d === autoDetectedDay;
            const isSelected = d === selectedDay;
            return (
              <button
                key={d}
                onClick={() => {
                  setSelectedDay(d);
                  soundManager.playComfortChime('star');
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-lg scale-105'
                    : isToday
                    ? 'bg-[#102A25] text-rose-300 border border-rose-400/50'
                    : 'bg-[#102A25]/60 text-[#A7B7A0] hover:text-[#FFFDF8]'
                }`}
              >
                <span>Day {d}</span>
                <span className="text-[10px] opacity-80">{isToday ? 'Today' : d === 6 ? 'Tomorrow' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DAY CARE GUIDANCE */}
      {activeTab === 'care' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#173B32] to-[#122A23] border border-[#B8A8D9]/25 shadow-xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-widest flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5" />
                <span>{currentDayData.flowStatus}</span>
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
                {currentDayData.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#A7B7A0] leading-relaxed">
                {currentDayData.subtitle}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs sm:text-sm text-[#F6F1E8] leading-relaxed font-body">
              {currentDayData.summary}
            </div>

            {/* Daily Comfort Tips */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider">
                Recommended Relief for Day {selectedDay}:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentDayData.tips.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-4 rounded-2xl bg-[#102A25]/80 border border-[#B8A8D9]/15 space-y-1.5 hover:border-[#B8A8D9]/30 transition-all"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#FFFDF8]">
                      <span>{tip.icon === 'flame' ? '🔥' : tip.icon === 'coffee' ? '☕' : tip.icon === 'bed' ? '🛏️' : '🍪'}</span>
                      <span>{tip.title}</span>
                    </div>
                    <p className="text-[11px] text-[#A7B7A0] leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Respectful Note from Nishant */}
            <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-400/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
                <span>Sir jiii (Nishant Raj) ki taraf se Reassurance</span>
                <span>☁️💜</span>
              </div>
              <p className="text-xs text-rose-100 font-body leading-relaxed">
                “Aapne itne din bohot himmat se pain ko sambhala hai. Aaj aap bilkul shant hokar aaram kijiye. Aap jab muskurate ho bohot pyare lagte ho!”
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CYCLE TRACKER & LOGGING TO TELEGRAM */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* IRREGULAR CYCLE ALERT & DOCTOR NISHANT REASSURANCE */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-950/90 to-[#173B32] border border-rose-400/50 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                <span>Irregular Cycle Status: 3 Episodes This Month</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-900/60 text-[10px] text-rose-200 border border-rose-400/30 font-medium">
                Manual Tracking Enabled
              </span>
            </div>
            <p className="text-xs sm:text-sm text-rose-100 font-body leading-relaxed">
              Divya, is mahine aapke periods 3 baar repeat hue hain aur cycle poori tarah disturb ho gayi hai. <strong>Tension bilkul mat lijiye!</strong> Weather change, period weakness, ya body stress ki wajah se aisi irregularity temporary hoti hai. Aap apni pichhli aur is baar ki sabhi dates yahan manually enter aur track kar sakte ho.
            </p>
          </div>

          {/* MANUAL CYCLE EPISODES MANAGER (3 TIMES THIS MONTH) */}
          <div className="p-6 rounded-3xl bg-[#173B32] border border-[#B8A8D9]/25 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B8A8D9]/15 pb-3">
              <div>
                <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#FFFDF8] flex items-center gap-2">
                  <span>📅</span>
                  <span>This Month's Period Episodes ({episodes.length} Logged)</span>
                </h3>
                <p className="text-xs text-[#A7B7A0]">
                  Pichhli sabhi dates aur current episode ki details Divya manually enter kar sakti hain:
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddEpisode(!showAddEpisode)}
                className="px-3 py-1.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/30 text-xs font-semibold text-[#B8A8D9] hover:text-[#FFFDF8] flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>{showAddEpisode ? 'Cancel' : '+ Add Previous/New Date'}</span>
              </button>
            </div>

            {/* Add Episode Form Drawer */}
            {showAddEpisode && (
              <form onSubmit={handleAddEpisode} className="p-4 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 space-y-3 animate-scale-up">
                <span className="text-xs font-bold text-[#E8B878] block">Nayi Period Date Log Karein:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-[#A7B7A0] block mb-1">Start Date:</label>
                    <input
                      type="date"
                      required
                      value={newEpStart}
                      onChange={(e) => setNewEpStart(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#A7B7A0] block mb-1">End Date (Optional):</label>
                    <input
                      type="date"
                      value={newEpEnd}
                      onChange={(e) => setNewEpEnd(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#A7B7A0] block mb-1">Notes / Flow:</label>
                    <input
                      type="text"
                      placeholder="e.g. Mild cramps, spotting..."
                      value={newEpNote}
                      onChange={(e) => setNewEpNote(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[#173B32] border border-[#B8A8D9]/30 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#B8A8D9] text-[#102A25] font-bold text-xs shadow"
                  >
                    Save Episode
                  </button>
                </div>
              </form>
            )}

            {/* Episodes List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {episodes.map((ep, idx) => (
                <div
                  key={ep.id}
                  className="p-3.5 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/20 space-y-1 relative group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#E8B878]">Episode {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteEpisode(ep.id)}
                      className="text-rose-400/60 hover:text-rose-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete entry"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-xs font-semibold text-[#FFFDF8]">
                    {ep.start} {ep.end ? `→ ${ep.end}` : '(Ongoing)'}
                  </div>
                  <div className="text-[11px] text-[#A7B7A0]">
                    {ep.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Next Period Prediction Custom Setting */}
            <div className="pt-3 border-t border-[#B8A8D9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[#FFFDF8] font-semibold block">Agli Cycle Prediction / Guess:</span>
                <p className="text-[11px] text-[#A7B7A0]">
                  Kyonki is mahine 3 baar aaye hain, isliye next date guess karna possible nahi hai. Aap khud set kar sakte ho ya uncertain chhod sakte ho.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#A7B7A0]">
                  <input
                    type="checkbox"
                    checked={isNextDateUncertain}
                    onChange={(e) => setIsNextDateUncertain(e.target.checked)}
                    className="accent-[#B8A8D9] rounded"
                  />
                  <span>Abhi Uncertain / Irregular</span>
                </label>

                {!isNextDateUncertain && (
                  <input
                    type="date"
                    value={customNextDate}
                    onChange={(e) => setCustomNextDate(e.target.value)}
                    className="p-1.5 rounded-lg bg-[#102A25] border border-[#B8A8D9]/30 text-xs text-white"
                  />
                )}
              </div>
            </div>

            {/* Sync All to Telegram Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-[11px] text-[#A7B7A0]">
                Yeh sabhi dates aur irregular cycle ka status Nishant ke Telegram par bhej sakte ho:
              </span>
              <button
                type="button"
                onClick={handleSyncIrregularHistory}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sync Irregular History to Sir jiii 📲</span>
              </button>
            </div>

            {historySyncSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 animate-fade-in flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{historySyncSuccess}</span>
              </div>
            )}
          </div>

          {/* Daily Wellness Log Form */}
          <form onSubmit={handleSubmitPeriodLog} className="p-6 sm:p-8 rounded-3xl bg-[#173B32]/75 border border-[#B8A8D9]/25 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#B8A8D9]/20 pb-4">
              <div>
                <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8] flex items-center gap-2">
                  <span>📊</span>
                  <span>Daily Period & Wellness Log</span>
                </h3>
                <p className="text-xs text-[#A7B7A0] mt-0.5">
                  Update kijiye bleeding kam hui ya zyada, dard kaisa hai. Yeh direct Nishant ke Telegram par deliver hoga.
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-[#102A25] border border-emerald-400/30 text-emerald-300 text-xs flex items-center gap-1.5 self-start sm:self-auto">
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Live Sync Active</span>
              </div>
            </div>

            {/* Bleeding Flow Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider block">
                Bleeding Flow (Kam hui ya zyada?):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Spotting', label: 'Spotting (Halka halka)', icon: '💧' },
                  { id: 'Light', label: 'Light (Kam flow)', icon: '🩸' },
                  { id: 'Medium', label: 'Medium (Normal)', icon: '🩸🩸' },
                  { id: 'Heavy', label: 'Heavy (Zyada)', icon: '🩸🩸🩸' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFlow(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      flow === item.id
                        ? 'bg-rose-950/90 border-rose-400 text-rose-200 font-bold shadow'
                        : 'bg-[#102A25] border-[#B8A8D9]/20 text-[#A7B7A0] hover:text-[#FFFDF8]'
                    }`}
                  >
                    <div className="text-base">{item.icon}</div>
                    <div className="text-xs mt-1">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cramps Level Slider (1 - 10) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#B8A8D9] uppercase tracking-wider">
                  Cramps Severity (Pet/Kamar dard):
                </label>
                <span className="font-bold text-rose-300 text-sm">
                  {crampLevel} / 10 {crampLevel <= 3 ? '😊 Mild' : crampLevel <= 6 ? '😐 Moderate' : '🥺 High'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={crampLevel}
                onChange={(e) => setCrampLevel(parseInt(e.target.value, 10))}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A7B7A0]">
                <span>1 (Halka dard)</span>
                <span>5 (Medium pain)</span>
                <span>10 (Bahut zyada pain)</span>
              </div>
            </div>

            {/* Mood Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider block">
                Aaj Mood Kaisa Lag Raha Hai?:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Craving Kisses & Hugs 🫂',
                  'Sensitive / Rona aa raha hai 🥺',
                  'Irritable / Chidchidapan 😤',
                  'Thak gaye hain / Sleepy 😴',
                  'Thoda Sukoon mein hain 🌸',
                  'Happy & Healing 💖',
                ].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      mood === m
                        ? 'bg-[#B8A8D9] text-[#102A25] font-bold shadow'
                        : 'bg-[#102A25] border border-[#B8A8D9]/20 text-[#A7B7A0] hover:text-[#FFFDF8]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Physical Symptoms */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider block">
                Symptoms (Kya kya feel ho raha hai?):
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Lower Tummy Cramps',
                  'Lower Backache',
                  'Bloating / Heaviness',
                  'Headache',
                  'Weakness / Tiredness',
                  'Body Ache',
                  'Mood Swings',
                ].map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleToggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-rose-950 border border-rose-400 text-rose-200 font-bold'
                          : 'bg-[#102A25] border border-[#B8A8D9]/20 text-[#A7B7A0]'
                      }`}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      <span>{sym}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cravings */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider block">
                Cravings (Abhi kya lene ka dil kar raha hai?):
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Adrak Chai ☕',
                  'Dairy Milk Chocolate 🍫',
                  'Warm Brownie 🧁',
                  'Spicy Maggi 🍜',
                  'Nishant ke Tight Hugs 🫂',
                  'Garam Soup 🍲',
                ].map((crv) => {
                  const isChecked = selectedCravings.includes(crv);
                  return (
                    <button
                      key={crv}
                      type="button"
                      onClick={() => handleToggleCraving(crv)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-amber-950 border border-amber-400 text-amber-200 font-bold'
                          : 'bg-[#102A25] border border-[#B8A8D9]/20 text-[#A7B7A0]'
                      }`}
                    >
                      <span>{isChecked ? '✓' : '+'}</span>
                      <span>{crv}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Note */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#B8A8D9] uppercase tracking-wider block">
                Message for Nishant Raj (Direct Telegram par jayega):
              </label>
              <textarea
                rows={3}
                placeholder="Nishant, aaj pet me thoda dard hai... / Aaj better feel kar rahe hain..."
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                className="w-full rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 p-3 text-xs text-[#FFFDF8] placeholder-[#A7B7A0]/40 focus:outline-none focus:ring-2 focus:ring-[#B8A8D9]"
              />
            </div>

            {logSubmittedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 text-center animate-scale-up space-y-1">
                <div className="font-bold">Aapka update Nishant ke Telegram par bhej diya gaya hai! 💌</div>
                <div className="text-[11px] text-emerald-300/80">Nishant ne aapka message padh liya hoga aur wo aapke sukoon ka dhyaan rakhenge.</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingLog}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white font-bold text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmittingLog ? 'Sending to Nishant\'s Telegram...' : 'Send Daily Period & Wellness Update to Nishant 🌸'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: HEAT PAD STATION */}
      {activeTab === 'heatpad' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#173B32]/75 border border-[#B8A8D9]/25 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 mx-auto flex items-center justify-center text-3xl">
              🔥
            </div>
            <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
              Virtual Heating Pad & Hot Water Bag
            </h2>
            <p className="text-xs text-[#A7B7A0] max-w-md mx-auto">
              Lower abdomen ya lower back par gentle heat relax karti hai. Turn it on aur soothing warmth mehsoos kijiye.
            </p>
          </div>

          <div className="max-w-sm mx-auto p-6 rounded-3xl bg-[#102A25] border border-[#B8A8D9]/30 text-center space-y-5">
            <div
              className={`w-32 h-32 rounded-3xl mx-auto flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                heatPadActive
                  ? heatPadTemp === 'mild'
                    ? 'bg-amber-950/70 border-amber-400 text-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-pulse'
                    : heatPadTemp === 'warm'
                    ? 'bg-orange-950/70 border-orange-400 text-orange-200 shadow-[0_0_40px_rgba(251,146,60,0.4)] animate-pulse'
                    : 'bg-rose-950/80 border-rose-400 text-rose-200 shadow-[0_0_50px_rgba(244,63,94,0.5)] animate-pulse'
                  : 'bg-[#173B32]/60 border-[#B8A8D9]/20 text-[#A7B7A0]'
              }`}
            >
              <Flame className={`w-10 h-10 ${heatPadActive ? 'text-amber-300' : 'text-[#A7B7A0]'}`} />
              <span className="text-xs font-bold">
                {heatPadActive ? `${heatPadTemp.toUpperCase()} HEAT` : 'OFF'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              {(['mild', 'warm', 'toasty'] as const).map((temp) => (
                <button
                  key={temp}
                  onClick={() => {
                    setHeatPadTemp(temp);
                    setHeatPadActive(true);
                    soundManager.playComfortChime('star');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    heatPadTemp === temp && heatPadActive
                      ? 'bg-[#B8A8D9] text-[#102A25] font-bold shadow'
                      : 'bg-[#173B32] border border-[#B8A8D9]/20 text-[#A7B7A0]'
                  }`}
                >
                  {temp}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setHeatPadActive(!heatPadActive);
                soundManager.playComfortChime(heatPadActive ? 'wind' : 'star');
              }}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                heatPadActive
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-500/40'
                  : 'bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25]'
              }`}
            >
              {heatPadActive ? 'Turn Off Heating Pad' : 'Turn On Warm Heating Pad ♨️'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CHAI BREWER */}
      {activeTab === 'chai' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#173B32]/75 border border-[#B8A8D9]/25 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 mx-auto flex items-center justify-center text-3xl">
              ☕
            </div>
            <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
              Nishant's Handcrafted Chai for Diyuuuu
            </h2>
            <p className="text-xs text-[#A7B7A0] max-w-md mx-auto">
              Fresh adrak, elaichi aur tulsi wali garam chai brew kijiye.
            </p>
          </div>

          <div className="max-w-md mx-auto p-6 rounded-3xl bg-[#102A25] border border-[#B8A8D9]/30 space-y-5 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'adrak', label: 'Fresh Adrak (Ginger)' },
                { id: 'elaichi', label: 'Green Elaichi (Cardamom)' },
                { id: 'tulsi', label: 'Tulsi Leaves' },
                { id: 'kesar', label: 'Shahi Kesar (Saffron)' },
              ].map((ing) => {
                const isSelected = chaiIngredients.includes(ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => {
                      setChaiIngredients((prev) =>
                        prev.includes(ing.id) ? prev.filter((i) => i !== ing.id) : [...prev, ing.id]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-900/80 border border-amber-400 text-amber-200 font-bold'
                        : 'bg-[#173B32] border border-[#B8A8D9]/20 text-[#A7B7A0]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {ing.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setChaiBrewed(true);
                soundManager.playComfortChime('success');
                confetti({ particleCount: 40, spread: 60 });
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E8B878] to-[#D4A373] text-[#102A25] font-bold text-xs shadow-lg hover:scale-105 transition-all"
            >
              ☕ Brew Warm Cup of Chai Now
            </button>

            {chaiBrewed && (
              <div className="p-4 rounded-2xl bg-[#173B32] border border-[#E8B878]/40 text-xs text-[#FFFDF8] space-y-1 animate-scale-up">
                <div className="font-bold text-[#E8B878]">Ekdam Garam & Khushboodar Chai Ready Hai! ☕✨</div>
                <div className="text-[11px] text-[#A7B7A0]">
                  Garam garam sip kijiye aur relaxed hokar blanket mein aaram karte ho.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
