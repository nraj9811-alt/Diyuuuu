import React, { useState } from 'react';
import {
  CloudRain,
  Coffee,
  Wind,
  Heart,
  Moon,
  Sparkles,
  Star,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Send,
  ArrowRight,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { ComfortCategory } from '../types';
import { shareResponse } from '../services/api';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';

interface ComfortCornerProps {
  categories: ComfortCategory[];
  recipientNickname: string;
}

export const ComfortCorner: React.FC<ComfortCornerProps> = ({
  categories,
  recipientNickname,
}) => {
  const { logAction } = useTheme();
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || 'heavy-day');
  const [currentMsgIndex, setCurrentMsgIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('diyu_fav_comfort') || '[]');
    } catch {
      return [];
    }
  });

  // Explicit response sharing state
  const [showShareBox, setShowShareBox] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [shareStatus, setShareStatus] = useState<{ success?: boolean; msg?: string } | null>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCatId) || categories[0];
  const messages = selectedCategory?.messages || [];
  const activeMessage = messages[currentMsgIndex % (messages.length || 1)] || '';

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'heavy-day': return CloudRain;
      case 'small-break': return Coffee;
      case 'overwhelmed': return Wind;
      case 'comforting': return Heart;
      case 'rest-reminder': return Moon;
      case 'tiny-smile': return Sparkles;
      case 'appreciated': return Star;
      default: return Heart;
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCatId(catId);
    setCurrentMsgIndex(0);
    setCopied(false);
    logAction('section_view', 'Comfort Corner', `Selected category: ${catId}`);
  };

  const handleNextMessage = () => {
    setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
    setCopied(false);
    soundManager.playComfortChime('click');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    soundManager.playComfortChime('star');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleFavorite = () => {
    const isFav = favorites.includes(activeMessage);
    let updated: string[];
    if (isFav) {
      updated = favorites.filter((f) => f !== activeMessage);
    } else {
      updated = [...favorites, activeMessage];
      soundManager.playComfortChime('heart');
    }
    setFavorites(updated);
    localStorage.setItem('diyu_fav_comfort', JSON.stringify(updated));
  };

  const handleSendResponse = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    setShareStatus(null);

    try {
      const res = await shareResponse({
        section: `Comfort Corner - ${selectedCategory?.title}`,
        question: `In response to: "${activeMessage.substring(0, 60)}..."`,
        responseText: replyText.trim(),
      });

      if (res.deliveredToTelegram) {
        setShareStatus({ success: true, msg: 'Delivered securely to your Sir jiii via Telegram!' });
      } else {
        setShareStatus({ success: true, msg: 'Saved safely in your comfort book for Nishant.' });
      }
      setReplyText('');
      soundManager.playComfortChime('success');
      logAction('response_shared', 'Comfort Corner', 'Shared response with Nishant');
    } catch (err: any) {
      setShareStatus({ success: false, msg: err.message || 'Could not send message. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B8A8D9]">
          <CloudRain className="w-3.5 h-3.5" />
          <span>Cloudy-Day Comfort Corner</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF8]">
          Gentle Words for Your Heart, {recipientNickname} ☁️
        </h1>
        <p className="text-sm sm:text-base text-[#A7B7A0] max-w-xl mx-auto font-body">
          Jab bhi din thoda heavy lage ya bas thode sukoon ki zaroorat ho, yahan kisi bhi category ko chuniye.
          Har message aapke aaram aur sukoon ke liye likha gaya hai.
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9] ${
                isSelected
                  ? 'bg-[#173B32] border-[#B8A8D9]/60 shadow-md text-[#FFFDF8]'
                  : 'bg-[#173B32]/35 border-[#B8A8D9]/15 text-[#A7B7A0] hover:text-[#FFFDF8] hover:bg-[#173B32]/60'
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isSelected ? 'bg-[#B8A8D9]/20 text-[#B8A8D9]' : 'bg-[#102A25] text-[#A7B7A0]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight text-[#F6F1E8] truncate">{cat.title}</p>
                <p className="text-[11px] text-[#A7B7A0] mt-0.5 truncate">{cat.hindiTitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* The Central Comfort Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#173B32] via-[#1A4238] to-[#122E27] border border-[#B8A8D9]/30 p-8 sm:p-12 shadow-2xl text-center space-y-6">
        {/* Category Header Tag */}
        <div className="flex items-center justify-center gap-2 text-xs font-serif italic text-[#B8A8D9]">
          <span>{selectedCategory?.title}</span>
          <span aria-hidden="true">·</span>
          <span>Thought {((currentMsgIndex % messages.length) + 1)} of {messages.length}</span>
        </div>

        {/* Message Quote */}
        <div className="min-h-[140px] flex items-center justify-center">
          <blockquote className="font-serif-title text-2xl sm:text-3xl text-[#FFFDF8] leading-relaxed max-w-3xl italic">
            "{activeMessage}"
          </blockquote>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#B8A8D9]/15">
          {/* Next Message Button */}
          {messages.length > 1 && (
            <button
              onClick={handleNextMessage}
              className="px-5 py-2.5 rounded-xl bg-[#B8A8D9] text-[#102A25] text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-[#D8CEEE] active:scale-95 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Agla Sukoon Bhara Thought</span>
            </button>
          )}

          {/* Copy Message Button */}
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-[#102A25]/60 border border-[#B8A8D9]/25 text-xs sm:text-sm text-[#F6F1E8] flex items-center gap-2 hover:bg-[#102A25] transition-all"
            title="Copy message to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#A7B7A0]" />}
            <span>{copied ? 'Copied with love!' : 'Copy'}</span>
          </button>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm flex items-center gap-2 transition-all ${
              favorites.includes(activeMessage)
                ? 'bg-[#E8B878]/15 border-[#E8B878]/50 text-[#E8B878]'
                : 'bg-[#102A25]/60 border-[#B8A8D9]/25 text-[#A7B7A0] hover:text-[#F6F1E8]'
            }`}
            title="Save as favorite comfort thought"
          >
            {favorites.includes(activeMessage) ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-[#E8B878]" />
                <span>Saved Favorite</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Favorite</span>
              </>
            )}
          </button>

          {/* Share Response with Nishant Toggle */}
          <button
            onClick={() => setShowShareBox((prev) => !prev)}
            className="px-4 py-2.5 rounded-xl bg-[#102A25]/60 border border-[#B8A8D9]/25 text-xs sm:text-sm text-[#B8A8D9] flex items-center gap-2 hover:bg-[#102A25] transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#B8A8D9]" />
            <span>Share a thought with Your Sir jiii</span>
          </button>
        </div>
      </div>

      {/* Explicit Share Box ("Share with Your Sir jiii") */}
      {showShareBox && (
        <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/40 p-6 sm:p-8 space-y-4 shadow-xl animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8] flex items-center gap-2">
                <span>Share a Note with Nishant (Your Sir jiii) 💌</span>
              </h3>
              <p className="text-xs text-[#E8B878] font-body">
                ⚠️ Disclosure: This response will be shared with Your Sir jiii directly.
              </p>
            </div>
            <button
              onClick={() => setShowShareBox(false)}
              className="text-xs text-[#A7B7A0] hover:text-[#FFFDF8] underline"
            >
              Cancel
            </button>
          </div>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Aap kuch kehna chahein, din kaisa raha, ya koi bhi baat... Aap jab chahein likh sakti hain."
            rows={3}
            className="w-full rounded-2xl bg-[#102A25] border border-[#B8A8D9]/30 p-4 text-sm text-[#FFFDF8] placeholder-[#A7B7A0]/60 focus:outline-none focus:ring-2 focus:ring-[#B8A8D9]"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A7B7A0]">No pressure, only whenever you feel like sharing.</span>
            <button
              onClick={handleSendResponse}
              disabled={isSending || !replyText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] text-xs sm:text-sm font-semibold flex items-center gap-2 hover:shadow-md disabled:opacity-50 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending...' : 'Send to Nishant'}</span>
            </button>
          </div>

          {shareStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                shareStatus.success
                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/70 border border-rose-500/40 text-rose-200'
              }`}
            >
              {shareStatus.success ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              <span>{shareStatus.msg}</span>
            </div>
          )}
        </div>
      )}

      {/* Saved Favorites Drawer (if any) */}
      {favorites.length > 0 && (
        <div className="rounded-2xl bg-[#173B32]/40 border border-[#B8A8D9]/15 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-lg font-semibold text-[#FFFDF8] flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-[#E8B878]" />
              <span>Aapke Saved Favorite Thoughts ({favorites.length})</span>
            </h3>
            <span className="text-xs text-[#A7B7A0]">Stored privately on your device</span>
          </div>

          <div className="space-y-2.5">
            {favorites.map((fav, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#102A25]/50 border border-[#B8A8D9]/10 text-xs sm:text-sm text-[#F6F1E8]/90 italic flex items-center justify-between gap-4"
              >
                <span>"{fav}"</span>
                <button
                  onClick={() => {
                    const up = favorites.filter((_, idx) => idx !== i);
                    setFavorites(up);
                    localStorage.setItem('diyu_fav_comfort', JSON.stringify(up));
                  }}
                  className="text-xs text-[#A7B7A0] hover:text-rose-400 shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
