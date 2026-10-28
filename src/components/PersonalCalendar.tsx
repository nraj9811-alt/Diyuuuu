import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Lock, Trash2, Download, Plus, Heart, AlertCircle, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';

interface CalendarEntry {
  date: string; // YYYY-MM-DD
  note?: string;
  isPeriodStart?: boolean;
  isPeriodEnd?: boolean;
  symptoms?: string[];
}

export const PersonalCalendar: React.FC<{ recipientNickname: string }> = ({ recipientNickname }) => {
  const { logAction } = useTheme();
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('diyu_cal_enabled') === 'true';
  });

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<Record<string, CalendarEntry>>(() => {
    try {
      return JSON.parse(localStorage.getItem('diyu_cal_entries') || '{}');
    } catch {
      return {};
    }
  });

  const [cycleEnabled, setCycleEnabled] = useState<boolean>(() => {
    return localStorage.getItem('diyu_cycle_enabled') === 'true';
  });

  const [noteInput, setNoteInput] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const enableCalendar = () => {
    setIsEnabled(true);
    localStorage.setItem('diyu_cal_enabled', 'true');
    soundManager.playComfortChime('star');
    logAction('interaction_click', 'Calendar', 'Enabled private calendar');
  };

  const saveDayEntry = () => {
    const updated = {
      ...entries,
      [selectedDate]: {
        date: selectedDate,
        note: noteInput.trim() || undefined,
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
        isPeriodStart: entries[selectedDate]?.isPeriodStart,
        isPeriodEnd: entries[selectedDate]?.isPeriodEnd,
      },
    };
    setEntries(updated);
    localStorage.setItem('diyu_cal_entries', JSON.stringify(updated));
    soundManager.playComfortChime('success');
  };

  const togglePeriodStart = () => {
    const current = entries[selectedDate] || { date: selectedDate };
    const updated = {
      ...entries,
      [selectedDate]: {
        ...current,
        isPeriodStart: !current.isPeriodStart,
      },
    };
    setEntries(updated);
    localStorage.setItem('diyu_cal_entries', JSON.stringify(updated));
    soundManager.playComfortChime('heart');
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `diyuuuu_private_calendar_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete all private calendar entries from this browser?')) {
      setEntries({});
      localStorage.removeItem('diyu_cal_entries');
      soundManager.playComfortChime('click');
    }
  };

  // Month navigation helpers
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // If calendar not enabled yet: show gentle privacy-first opt-in gate
  if (!isEnabled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#173B32] border border-[#B8A8D9]/30 mx-auto flex items-center justify-center text-3xl">
          🗓️
        </div>
        <div className="space-y-2">
          <h2 className="font-serif-title text-3xl font-bold text-[#FFFDF8]">
            Optional Private Calendar
          </h2>
          <p className="text-sm text-[#A7B7A0] font-body max-w-md mx-auto leading-relaxed">
            This space is completely private and optional. All notes, calendar dates, and cycle estimates remain securely in your local browser and are never shared automatically.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#173B32]/40 border border-[#B8A8D9]/20 text-xs text-[#F6F1E8]/80 text-left space-y-2">
          <div className="flex items-center gap-2 text-[#E8B878] font-semibold">
            <Lock className="w-4 h-4" />
            <span>Strict Privacy Guarantee</span>
          </div>
          <p>
            Your health and private notes are for your eyes only. You can disable this feature or delete your data anytime with one click.
          </p>
        </div>

        <button
          onClick={enableCalendar}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-semibold text-sm hover:scale-105 transition-all shadow-lg"
        >
          Enable Private Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8A8D9]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B8A8D9]">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Browser Calendar</span>
          </div>
          <h1 className="font-serif-title text-3xl font-bold text-[#FFFDF8]">
            Personal Space for {recipientNickname} 🗓️
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              const next = !cycleEnabled;
              setCycleEnabled(next);
              localStorage.setItem('diyu_cycle_enabled', String(next));
            }}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              cycleEnabled ? 'bg-[#173B32] border-[#B8A8D9] text-[#B8A8D9]' : 'bg-[#102A25] border-[#B8A8D9]/20 text-[#A7B7A0]'
            }`}
          >
            {cycleEnabled ? 'Cycle Tracking On' : 'Enable Cycle Log'}
          </button>

          <button
            onClick={handleExport}
            className="p-2 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-[#A7B7A0] hover:text-[#FFFDF8]"
            title="Export data as JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleDeleteAll}
            className="p-2 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-rose-400 hover:text-rose-300"
            title="Delete all calendar data"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-[#173B32] border border-[#B8A8D9]/25 p-6 space-y-4 shadow-xl">
          {/* Month Header with controls */}
          <div className="flex items-center justify-between">
            <h2 className="font-serif-title text-xl font-bold text-[#FFFDF8]">{monthName}</h2>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-1.5 rounded-lg text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#102A25]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} className="p-1.5 rounded-lg text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#102A25]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#A7B7A0] pb-2 border-b border-[#B8A8D9]/10">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 text-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDate === dateKey;
              const entry = entries[dateKey];
              const isPeriod = entry?.isPeriodStart;

              return (
                <button
                  key={dayNum}
                  onClick={() => {
                    setSelectedDate(dateKey);
                    setNoteInput(entry?.note || '');
                    setSelectedSymptoms(entry?.symptoms || []);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-medium transition-all relative flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-[#B8A8D9] text-[#102A25] font-bold shadow-md'
                      : isPeriod
                      ? 'bg-rose-950/60 border border-rose-400/40 text-rose-200'
                      : entry?.note
                      ? 'bg-[#102A25] text-[#F6F1E8] border border-[#B8A8D9]/30'
                      : 'hover:bg-[#102A25]/50 text-[#F6F1E8]'
                  }`}
                >
                  <span>{dayNum}</span>
                  {entry?.note && (
                    <span className="w-1 h-1 rounded-full bg-[#E8B878] mt-0.5" />
                  )}
                  {isPeriod && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details & Private Note (1 col) */}
        <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/25 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#B8A8D9]/15 pb-2">
              <span className="text-xs text-[#B8A8D9] font-serif italic">Selected Date</span>
              <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8]">{selectedDate}</h3>
            </div>

            {/* Cycle Tracker Toggles (if enabled) */}
            {cycleEnabled && (
              <div className="space-y-2 p-3 rounded-2xl bg-[#102A25] border border-[#B8A8D9]/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A7B7A0]">Period Log</span>
                  <button
                    onClick={togglePeriodStart}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      entries[selectedDate]?.isPeriodStart
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-[#173B32] text-[#A7B7A0] hover:text-white'
                    }`}
                  >
                    {entries[selectedDate]?.isPeriodStart ? 'Period Logged 🌸' : 'Log Period Day'}
                  </button>
                </div>
                <p className="text-[10px] text-[#A7B7A0] italic">
                  Note: Any estimate is only an approximation.
                </p>
              </div>
            )}

            {/* Private Note Field */}
            <div className="space-y-2">
              <label className="text-xs text-[#A7B7A0]">Private Note for this date:</label>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="How did you feel today? Any gentle reminders?"
                rows={3}
                className="w-full rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 p-3 text-xs text-[#FFFDF8] placeholder-[#A7B7A0]/50 focus:outline-none focus:ring-1 focus:ring-[#B8A8D9]"
              />
            </div>

            <button
              onClick={saveDayEntry}
              className="w-full py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] font-semibold text-xs hover:bg-[#D8CEEE] transition-colors"
            >
              Save Private Note
            </button>
          </div>

          {/* Gentle Health Note Disclaimer */}
          <div className="p-3 rounded-xl bg-[#102A25]/40 border border-[#B8A8D9]/10 text-[11px] text-[#A7B7A0] space-y-1">
            <span className="text-[#E8B878] font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Gentle Wellness Note:
            </span>
            <p>
              If you ever experience severe cramps, dizziness, or unusual discomfort, please consult a qualified healthcare doctor or trusted family member. Rest well!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
