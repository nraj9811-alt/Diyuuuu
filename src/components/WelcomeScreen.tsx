import React from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SiteSettings } from '../types';

interface WelcomeScreenProps {
  settings: SiteSettings;
  onEnter: () => void;
  onOpenSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  settings,
  onEnter,
  onOpenSettings,
}) => {
  const { rainSoundActive, toggleRainSound, animationsEnabled, reducedMotion } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#102A25] via-[#173B32] to-[#102A25] px-4 sm:px-6">
      {/* Background Animated Rain & Forest Silhouettes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {/* Soft forest silhouette */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#091714] to-transparent" />
        {/* Procedural raindrops */}
        {animationsEnabled && !reducedMotion && (
          <div className="absolute inset-0">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[1.5px] bg-[#B8A8D9]/40 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 25 + 15}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 1.5 + 0.8}s`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Warm Ambient Lamp & Lavender Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#E8B878]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-[#B8A8D9]/15 blur-3xl pointer-events-none" />

      {/* Sound Toggle top-right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleRainSound}
          aria-label={rainSoundActive ? 'Mute ambient rain audio' : 'Play gentle ambient rain audio'}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#173B32]/70 border border-[#B8A8D9]/30 text-xs text-[#F6F1E8] backdrop-blur hover:bg-[#173B32] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9]"
        >
          {rainSoundActive ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#B8A8D9] animate-pulse" />
              <span>Rain audio playing</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#A7B7A0]" />
              <span className="text-[#A7B7A0]">Sound off (tap to hear rain)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Welcome Content Box */}
      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl bg-[#173B32]/40 backdrop-blur-md border border-[#B8A8D9]/20 shadow-2xl">
        {/* Soft Cloud and Lavender Star Icon */}
        <div className="flex justify-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1C453B] to-[#102A25] border border-[#B8A8D9]/30 shadow-inner group">
            <span className="text-3xl select-none group-hover:scale-110 transition-transform">☁️</span>
            <span className="absolute -top-1 -right-1 text-sm animate-bounce">💜</span>
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="font-serif-title text-4xl sm:text-6xl font-bold tracking-tight text-[#FFFDF8] leading-tight">
            {settings.heroHeading || 'DIYUUUU ☁️💜'}
          </h1>
          <p className="text-xl sm:text-2xl text-[#B8A8D9] font-serif italic tracking-wide">
            {settings.heroSubtitle || 'For your cloudy days.'}
          </p>
        </div>

        {/* Supporting Message */}
        <p className="text-base sm:text-lg text-[#F6F1E8]/90 max-w-lg mx-auto font-body leading-relaxed">
          {settings.heroSupporting || 'A little corner of the internet, made with care, just for you.'}
        </p>

        {/* Enter Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-semibold text-base sm:text-lg tracking-wide shadow-lg hover:shadow-[#B8A8D9]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#B8A8D9]/50"
          >
            <span>{settings.enterButtonText || 'Enter your little world'}</span>
            <ArrowRight className="w-5 h-5 text-[#102A25]" />
          </button>
        </div>

        {/* Quiet Footnote with Respectful Tone */}
        <div className="pt-6 border-t border-[#B8A8D9]/15 flex items-center justify-center gap-2 text-xs text-[#A7B7A0]">
          <Heart className="w-3.5 h-3.5 text-[#B8A8D9]" />
          <span>Made for Divya ({settings.recipientNickname || 'Diyuuuu'}) · Aap jab chahein, yahan aa sakti hain</span>
        </div>
      </div>
    </div>
  );
};
