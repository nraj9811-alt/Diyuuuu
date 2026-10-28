import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Volume2, VolumeX, Eye, ArrowLeft, SunMedium, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export const RainyWindow: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
  const { rainSoundActive, toggleRainSound, rainVolume, setRainVolume, animationsEnabled, reducedMotion, logAction } = useTheme();
  const [rainDensity, setRainDensity] = useState<'gentle' | 'cozy' | 'downpour'>('cozy');
  const [mistEnabled, setMistEnabled] = useState<boolean>(true);
  const [lightingMode, setLightingMode] = useState<'twilight' | 'warm-amber' | 'deep-night'>('warm-amber');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    logAction('section_view', 'Rainy Window', 'Viewing rainy windowpane');
  }, []);

  // Canvas raindrop drawing
  useEffect(() => {
    if (!animationsEnabled || reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const count = rainDensity === 'gentle' ? 50 : rainDensity === 'cozy' ? 100 : 180;
    const drops: RainDrop[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 5 + 4,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#D8CEEE';
      ctx.lineWidth = 1.2;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.globalAlpha = d.opacity;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 0.5, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [rainDensity, animationsEnabled, reducedMotion]);

  return (
    <div className="relative min-h-[85vh] rounded-3xl overflow-hidden border border-[#B8A8D9]/30 shadow-2xl flex flex-col justify-between p-6 sm:p-10 my-4 max-w-6xl mx-auto">
      {/* Background Forest & Lighting Layer */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          lightingMode === 'twilight'
            ? 'bg-gradient-to-b from-[#181E2E] via-[#102A25] to-[#0A1A16]'
            : lightingMode === 'warm-amber'
            ? 'bg-gradient-to-b from-[#1E2620] via-[#1A3830] to-[#122A24]'
            : 'bg-gradient-to-b from-[#080F14] via-[#0D1D18] to-[#050C0A]'
        }`}
      >
        {/* Misty Forest Silhouettes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#102A25]/60 to-[#0A1A16]" />

        {/* Window Mist Glass Effect */}
        {mistEnabled && (
          <div className="absolute inset-0 backdrop-blur-[2.5px] bg-[#B8A8D9]/5 pointer-events-none" />
        )}

        {/* Desk Lamp Reflection in the Glass */}
        {lightingMode === 'warm-amber' && (
          <div className="absolute bottom-16 right-16 w-64 h-64 rounded-full bg-[#E8B878]/12 blur-3xl pointer-events-none" />
        )}
      </div>

      {/* Rain canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Window Frame Inner Shadow border */}
      <div className="absolute inset-0 pointer-events-none border-[12px] sm:border-[18px] border-[#0E211D]/80 rounded-3xl shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] z-20" />

      {/* Top Controls Bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onReturn}
          className="px-4 py-2 rounded-xl bg-[#102A25]/80 backdrop-blur-md border border-[#B8A8D9]/30 text-xs sm:text-sm font-semibold text-[#F6F1E8] flex items-center gap-2 hover:bg-[#102A25] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cozy Room</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleRainSound}
            className={`px-3.5 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold flex items-center gap-2 transition-all ${
              rainSoundActive
                ? 'bg-[#102A25] border-[#B8A8D9] text-[#B8A8D9] shadow-md'
                : 'bg-[#102A25]/70 border-[#B8A8D9]/20 text-[#A7B7A0]'
            }`}
          >
            {rainSoundActive ? <Volume2 className="w-4 h-4 text-[#B8A8D9] animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span>{rainSoundActive ? 'Rain Sound On' : 'Play Rain Sound'}</span>
          </button>
        </div>
      </div>

      {/* Central Gentle Atmospheric Thought */}
      <div className="relative z-30 text-center my-auto max-w-lg mx-auto p-6 rounded-3xl bg-[#102A25]/50 backdrop-blur-md border border-[#B8A8D9]/20 space-y-3">
        <span className="text-3xl">🌧️✨</span>
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8]">
          Rain on the Glass
        </h2>
        <p className="text-xs sm:text-sm text-[#F6F1E8]/90 font-body italic leading-relaxed">
          "Baahar ki baarish ko dekhiye. Kuch waqt ke liye saari baatein tham sakti hain. Aap araam se saans lijiye."
        </p>
      </div>

      {/* Bottom Scene Adjustment Controls */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#102A25]/80 backdrop-blur-md border border-[#B8A8D9]/20">
        {/* Rain Intensity Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#A7B7A0]">Rain:</span>
          {(['gentle', 'cozy', 'downpour'] as const).map((density) => (
            <button
              key={density}
              onClick={() => setRainDensity(density)}
              className={`px-2.5 py-1 rounded-lg capitalize border ${
                rainDensity === density
                  ? 'bg-[#B8A8D9] text-[#102A25] border-[#B8A8D9] font-bold'
                  : 'bg-[#173B32]/40 text-[#A7B7A0] border-[#B8A8D9]/15'
              }`}
            >
              {density}
            </button>
          ))}
        </div>

        {/* Lighting Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#A7B7A0]">Light:</span>
          {(['warm-amber', 'twilight', 'deep-night'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setLightingMode(mode)}
              className={`px-2.5 py-1 rounded-lg capitalize border ${
                lightingMode === mode
                  ? 'bg-[#E8B878] text-[#102A25] border-[#E8B878] font-bold'
                  : 'bg-[#173B32]/40 text-[#A7B7A0] border-[#B8A8D9]/15'
              }`}
            >
              {mode.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Mist Toggle */}
        <button
          onClick={() => setMistEnabled(!mistEnabled)}
          className={`px-3 py-1 rounded-lg text-xs border ${
            mistEnabled ? 'bg-[#173B32] border-[#B8A8D9]/40 text-[#B8A8D9]' : 'bg-[#173B32]/30 text-[#A7B7A0] border-[#B8A8D9]/10'
          }`}
        >
          {mistEnabled ? 'Mist Glass On' : 'Mist Glass Off'}
        </button>
      </div>
    </div>
  );
};
