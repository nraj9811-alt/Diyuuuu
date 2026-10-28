import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Heart, Home, Sparkles, MapPin } from 'lucide-react';
import { FamilyVisitEvent, TodayPlanData } from '../types';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';

interface TodayPlanProps {
  todayPlan: TodayPlanData;
  familyVisit: FamilyVisitEvent;
  recipientNickname: string;
  timezone: string;
}

export const TodayPlan: React.FC<TodayPlanProps> = ({
  todayPlan,
  familyVisit,
  recipientNickname,
  timezone,
}) => {
  const { logAction } = useTheme();
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('diyu_plan_done') || '{}');
    } catch {
      return {};
    }
  });

  // Calculate current date in configured timezone
  const todayDateStr = new Date().toLocaleDateString('en-CA', { timeZone: timezone || 'Asia/Kolkata' });
  const displayFormattedDate = new Date().toLocaleDateString('en-IN', {
    timeZone: timezone || 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Check family visit event date status
  const eventDateStr = familyVisit.date;
  const isEventToday = eventDateStr === todayDateStr;
  const isEventPast = eventDateStr < todayDateStr;
  const isEventFuture = eventDateStr > todayDateStr;

  // Calculate days remaining if future
  let daysDiff = 0;
  if (isEventFuture) {
    const todayMs = new Date(todayDateStr).getTime();
    const eventMs = new Date(eventDateStr).getTime();
    daysDiff = Math.ceil((eventMs - todayMs) / (1000 * 60 * 60 * 24));
  }

  const defaultGentleGoals = [
    { id: 'chai', text: 'Ek cup warm adrak ya elaichi chai bina kisi rush ke' },
    { id: 'water', text: 'Paani peena aur thodi der deep breathing karna' },
    { id: 'rest', text: 'Khud ko bina kisi guilt ke thodi der rest dena' },
    { id: 'music', text: 'Apna favourite soothing song ya rain sounds sunna' },
  ];

  const handleToggleGoal = (id: string) => {
    const next = { ...completedItems, [id]: !completedItems[id] };
    setCompletedItems(next);
    localStorage.setItem('diyu_plan_done', JSON.stringify(next));
    soundManager.playComfortChime('star');
    logAction('interaction_click', "Today's Plan", `Toggled goal: ${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B8A8D9]">
          <Calendar className="w-3.5 h-3.5" />
          <span>Today's Little Plan</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF8]">
          A Gentle Day for {recipientNickname} ☁️
        </h1>
        <p className="text-sm sm:text-base text-[#A7B7A0] max-w-xl mx-auto font-body">
          {displayFormattedDate} · Timezone: {timezone || 'Asia/Kolkata'}
        </p>
      </div>

      {/* Main Today's Gentle Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#173B32] via-[#1A4238] to-[#122E27] border border-[#B8A8D9]/30 p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#B8A8D9]/15 pb-4">
          <div className="flex items-center gap-2 text-xs text-[#E8B878] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Gentle Daily Reminder</span>
          </div>
          <span className="text-xs text-[#A7B7A0]">No rigid deadlines</span>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
            Today's Thought:
          </h2>
          <p className="text-base text-[#F6F1E8]/90 font-body leading-relaxed italic">
            "{todayPlan?.defaultActivity || 'Ek cup garam adrak chai, thodi der relaxing music, aur bina kisi rush ke apne favourite tasks.'}"
          </p>
        </div>

        {/* Small Gentle Checkboxes */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B8A8D9]">
            Little Comfort Steps for Today
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {defaultGentleGoals.map((g) => {
              const isDone = Boolean(completedItems[g.id]);
              return (
                <button
                  key={g.id}
                  onClick={() => handleToggleGoal(g.id)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    isDone
                      ? 'bg-[#102A25] border-emerald-500/40 text-[#A7B7A0] line-through'
                      : 'bg-[#102A25]/60 border-[#B8A8D9]/20 text-[#FFFDF8] hover:bg-[#102A25]'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#A7B7A0] shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs sm:text-sm font-body">{g.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Special Configurable Family Visit Event Card */}
      {familyVisit.visible && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8] flex items-center gap-2">
              <Home className="w-4 h-4 text-[#E8B878]" />
              <span>Special Family Visit Card</span>
            </h3>
            {isEventPast ? (
              <span className="text-xs text-[#A7B7A0] bg-[#102A25] px-3 py-1 rounded-full border border-[#B8A8D9]/15">
                Past Little Days (Archived)
              </span>
            ) : isEventToday ? (
              <span className="text-xs text-emerald-300 font-bold bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30 animate-pulse">
                Happening Today! 🎉
              </span>
            ) : (
              <span className="text-xs text-[#B8A8D9] font-medium bg-[#102A25] px-3 py-1 rounded-full border border-[#B8A8D9]/20">
                Upcoming in {daysDiff} day{daysDiff === 1 ? '' : 's'}
              </span>
            )}
          </div>

          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all ${
              isEventPast
                ? 'bg-[#102A25]/40 border-[#B8A8D9]/15 opacity-80'
                : isEventToday
                ? 'bg-gradient-to-br from-[#231A38] to-[#173B32] border-[#E8B878]/60 shadow-xl'
                : 'bg-gradient-to-br from-[#173B32] to-[#102A25] border-[#B8A8D9]/30 shadow-lg'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8A8D9]/15 pb-4">
              <div className="space-y-1">
                <h4 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                  {familyVisit.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#A7B7A0]">
                  <span>Date: {familyVisit.date}</span>
                  {(familyVisit.startTime || familyVisit.endTime) && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E8B878]" />
                      <span>{familyVisit.startTime || ''} - {familyVisit.endTime || ''}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-2xl">🏡🌸</div>
            </div>

            <p className="pt-4 text-sm sm:text-base text-[#F6F1E8]/90 font-body leading-relaxed italic">
              "{familyVisit.message}"
            </p>

            <div className="pt-4 mt-2 flex items-center justify-between text-xs text-[#A7B7A0]">
              <span>Configured with love in Nishant's admin panel</span>
              <span className="text-[#B8A8D9]">Aap araam se enjoy kijiyega! 💜</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
