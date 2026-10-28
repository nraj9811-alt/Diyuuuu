import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Sparkles, Volume2, ArrowLeft } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

interface Item {
  id: number;
  x: number;
  y: number;
  type: 'chocolate' | 'chai' | 'teddy' | 'heart' | 'cloud';
  speed: number;
  points: number;
}

export const SweetCatcher: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('diyu_catcher_high') || '0', 10);
  });
  const [basketX, setBasketX] = useState<number>(50); // percentage 0 - 100
  const [items, setItems] = useState<Item[]>([]);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(1);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Keyboard and Touch Movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setBasketX((prev) => Math.max(5, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setBasketX((prev) => Math.min(95, prev + 7));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Touch and Mouse tracking on game area
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(5, Math.min(95, relativeX)));
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(3);
    setCombo(1);
    setItems([]);
    soundManager.playComfortChime('star');
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    let nextItemId = 1;
    let spawnCounter = 0;

    const gameLoop = () => {
      spawnCounter++;
      // Spawn new item every ~35 frames
      if (spawnCounter % 32 === 0) {
        const types: Array<'chocolate' | 'chai' | 'teddy' | 'heart' | 'cloud'> = [
          'chocolate',
          'chai',
          'teddy',
          'heart',
          'chocolate',
          'cloud',
        ];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        const newItem: Item = {
          id: nextItemId++,
          x: Math.floor(Math.random() * 85) + 5,
          y: 0,
          type: chosenType,
          speed: chosenType === 'cloud' ? 1.6 : 1.2 + Math.random() * 0.8,
          points: chosenType === 'heart' ? 25 : chosenType === 'chocolate' ? 15 : chosenType === 'chai' ? 20 : chosenType === 'teddy' ? 30 : -10,
        };
        setItems((prev) => [...prev, newItem]);
      }

      // Update positions & check collisions
      setItems((prevItems) => {
        const nextItems: Item[] = [];

        for (const item of prevItems) {
          const newY = item.y + item.speed;

          // Check collision with basket (basket is at y ~ 88% to 96%)
          if (newY >= 84 && newY <= 94 && Math.abs(item.x - basketX) < 14) {
            // Caught item!
            if (item.type === 'cloud') {
              // Hit obstacle
              setLives((l) => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  endGame();
                }
                return nextLives;
              });
              setCombo(1);
              soundManager.playComfortChime('wind');
            } else {
              // Caught treat
              setScore((s) => {
                const added = item.points * combo;
                const newScore = s + added;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  localStorage.setItem('diyu_catcher_high', newScore.toString());
                }
                return newScore;
              });
              setCombo((c) => Math.min(5, c + 1));
              soundManager.playComfortChime('star');
            }
            continue; // Item collected, remove
          }

          // Off bottom of screen
          if (newY > 100) {
            if (item.type !== 'cloud') {
              setCombo(1); // Dropped good treat
            }
            continue;
          }

          nextItems.push({ ...item, y: newY });
        }
        return nextItems;
      });

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, basketX, combo, highScore]);

  const endGame = () => {
    setIsPlaying(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    soundManager.playComfortChime('success');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const getItemEmoji = (type: string) => {
    switch (type) {
      case 'chocolate': return '🍫';
      case 'chai': return '☕';
      case 'teddy': return '🧸';
      case 'heart': return '💖';
      case 'cloud': return '⚡';
      default: return '🍬';
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto font-body">
      {/* Game Header */}
      <div className="flex items-center justify-between text-xs text-[#A7B7A0] bg-[#102A25] p-3 rounded-2xl border border-[#B8A8D9]/20">
        <div className="flex items-center gap-2">
          <span>Score:</span>
          <span className="text-base font-bold text-[#FFFDF8] font-serif-title">{score}</span>
          {combo > 1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {combo}x Combo!
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-rose-400">
          <span>Lives:</span>
          <span>{'❤️'.repeat(Math.max(0, lives))}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#E8B878]">
          <Trophy className="w-3.5 h-3.5" />
          <span>High: {highScore}</span>
        </div>
      </div>

      {/* Main Game Canvas / Field */}
      <div
        ref={gameAreaRef}
        onPointerMove={handlePointerMove}
        className="relative h-96 sm:h-[420px] rounded-3xl bg-gradient-to-b from-[#0B1B17] via-[#102A25] to-[#15342D] border-2 border-[#B8A8D9]/30 overflow-hidden shadow-2xl select-none cursor-ew-resize touch-none"
      >
        {/* Soft floating stars in background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-12 text-sm">✨</div>
          <div className="absolute top-20 right-16 text-sm">☁️</div>
          <div className="absolute top-40 left-1/3 text-xs">⭐</div>
        </div>

        {!isPlaying ? (
          /* Start Screen Overlay */
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#173B32] border border-[#B8A8D9]/40 flex items-center justify-center text-3xl shadow-lg">
              🧺
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
                Sweet Catcher for Diyuuuu 🍫☕
              </h3>
              <p className="text-xs text-[#A7B7A0] max-w-xs mx-auto">
                Move basket to catch falling Chocolates, Adrak Chai, and Teddies! Avoid thunder clouds ⚡.
              </p>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{score > 0 ? 'Play Again 🎮' : 'Start Catching Treats!'}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Falling Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="absolute text-2xl transition-transform pointer-events-none transform -translate-x-1/2 drop-shadow-md"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                }}
              >
                {getItemEmoji(item.type)}
              </div>
            ))}

            {/* Divya's Basket */}
            <div
              className="absolute bottom-4 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
              style={{ left: `${basketX}%` }}
            >
              <span className="text-xs text-[#B8A8D9] font-bold pb-0.5">Diyuuuu</span>
              <div className="w-16 h-8 rounded-b-2xl bg-gradient-to-r from-[#E8B878] via-[#D4A373] to-[#B37D4E] border border-[#FFFDF8]/40 shadow-xl flex items-center justify-center text-base">
                🧺
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-[11px] text-[#A7B7A0] text-center">
        💡 Controls: Touch & drag left/right on screen or use Left/Right Arrow keys.
      </p>
    </div>
  );
};
