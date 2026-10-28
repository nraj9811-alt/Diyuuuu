import React, { useState, useEffect, useRef } from 'react';
import { Star, Play, Pause, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';

interface FallingStar {
  id: number;
  x: number; // percentage
  y: number; // percentage
  speed: number;
  size: number;
  points: number;
}

export const CatchTheStars: React.FC<{ onScoreUpdate?: (score: number) => void }> = ({ onScoreUpdate }) => {
  const { logAction } = useTheme();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('diyu_stars_high') || '0', 10);
  });
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stars, setStars] = useState<FallingStar[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setStars([]);
    soundManager.playComfortChime('star');
    logAction('game_play', 'Catch The Stars', 'Started a new game');
  };

  const restartGame = () => {
    startGame();
  };

  // Game timer loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setIsPlaying(false);
          soundManager.playComfortChime('success');
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, gameOver]);

  // Star generation and animation loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return;

    const interval = setInterval(() => {
      setStars((current) => {
        // Drop existing stars
        const updated = current
          .map((s) => ({ ...s, y: s.y + s.speed }))
          .filter((s) => s.y < 95);

        // Spawn new star if under count
        if (updated.length < 7 && Math.random() > 0.3) {
          updated.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 85 + 5,
            y: 0,
            speed: Math.random() * 1.5 + 1.2,
            size: Math.random() * 14 + 18,
            points: 1,
          });
        }
        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, gameOver]);

  // High score tracking
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('diyu_stars_high', score.toString());
      if (onScoreUpdate) onScoreUpdate(score);
    }
  }, [score, highScore, onScoreUpdate]);

  const catchStar = (id: number) => {
    if (!isPlaying || isPaused) return;
    setStars((prev) => prev.filter((s) => s.id !== id));
    setScore((s) => s + 1);
    soundManager.playComfortChime('star');
  };

  return (
    <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/25 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8A8D9]/15 pb-4">
        <div>
          <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8] flex items-center gap-2">
            <Star className="w-5 h-5 text-[#E8B878]" />
            <span>Catch the Stars ⭐</span>
          </h2>
          <p className="text-xs text-[#A7B7A0]">Tap or click the peaceful falling stars before they fade away.</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-[#102A25] text-[#E8B878] flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>High: {highScore}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#102A25] text-[#FFFDF8]">
            Score: <span className="text-[#B8A8D9]">{score}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#102A25] text-[#A7B7A0]">
            Time: <span className={timeLeft < 6 ? 'text-rose-400 font-bold' : 'text-[#FFFDF8]'}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Game Playing Area */}
      <div
        ref={containerRef}
        className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-[#0B1A16] via-[#102A25] to-[#173B32] border border-[#B8A8D9]/20 overflow-hidden select-none cursor-pointer"
      >
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-black/40 backdrop-blur-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/30 flex items-center justify-center text-3xl">
              ⭐
            </div>
            <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">Ready to catch some stars, Diyuuuu?</h3>
            <p className="text-xs text-[#A7B7A0] max-w-xs font-body">
              Soft evening stars falling peacefully. Tap as many as you can in 30 seconds!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-semibold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Play className="w-4 h-4" />
              <span>Start Catching</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-black/60 backdrop-blur-sm animate-fade-in z-20">
            <div className="text-4xl">✨💜</div>
            <h3 className="font-serif-title text-3xl font-bold text-[#FFFDF8]">Wonderful Job, Diyuuuu!</h3>
            <p className="text-sm text-[#B8A8D9]">You caught {score} stars for your sky!</p>
            {score >= highScore && score > 0 && (
              <span className="text-xs text-[#E8B878] font-semibold">🎉 New Personal High Score!</span>
            )}
            <button
              onClick={restartGame}
              className="px-6 py-2.5 rounded-xl bg-[#B8A8D9] text-[#102A25] font-semibold text-sm flex items-center gap-2 hover:bg-[#D8CEEE] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}

        {/* Falling Stars */}
        {isPlaying &&
          stars.map((star) => (
            <button
              key={star.id}
              onClick={() => catchStar(star.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform active:scale-125 focus:outline-none"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              title="Catch star"
            >
              <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(232,184,120,0.8)]">⭐</span>
            </button>
          ))}
      </div>

      {/* Control Bar */}
      {isPlaying && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-4 py-2 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-[#F6F1E8] flex items-center gap-2 hover:bg-[#1C453B]"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={restartGame}
            className="px-4 py-2 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-xs text-[#A7B7A0] hover:text-[#FFFDF8] flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      )}
    </div>
  );
};
