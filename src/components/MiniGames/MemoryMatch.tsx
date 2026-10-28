import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, Check } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  flipped: boolean;
  matched: boolean;
}

const SYMBOLS = [
  { symbol: '☕', name: 'Chai' },
  { symbol: '🌿', name: 'Leaf' },
  { symbol: '⭐', name: 'Star' },
  { symbol: '🌸', name: 'Flower' },
  { symbol: '🌧️', name: 'Rain' },
  { symbol: '🏮', name: 'Lamp' },
];

export const MemoryMatch: React.FC = () => {
  const { logAction } = useTheme();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const initGame = () => {
    const deck: CardItem[] = [];
    let id = 0;
    // Create pairs and shuffle
    SYMBOLS.forEach((sym) => {
      deck.push({ id: id++, symbol: sym.symbol, name: sym.name, flipped: false, matched: false });
      deck.push({ id: id++, symbol: sym.symbol, name: sym.name, flipped: false, matched: false });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || selectedCards.length === 2) return;

    soundManager.playComfortChime('click');
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newSelected;
      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // Match found!
        setTimeout(() => {
          soundManager.playComfortChime('star');
          const matchedCards = [...cards];
          matchedCards[firstIdx].matched = true;
          matchedCards[secondIdx].matched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          const newMatchCount = matches + 1;
          setMatches(newMatchCount);

          if (newMatchCount === SYMBOLS.length) {
            setIsCompleted(true);
            soundManager.playComfortChime('success');
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
            logAction('game_play', 'Tiny Memory Match', `Completed game in ${moves + 1} moves`);
          }
        }, 400);
      } else {
        // No match - flip back
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].flipped = false;
          resetCards[secondIdx].flipped = false;
          setCards(resetCards);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="rounded-3xl bg-[#173B32] border border-[#B8A8D9]/25 p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8A8D9]/15 pb-4">
        <div>
          <h2 className="font-serif-title text-2xl font-bold text-[#FFFDF8] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B8A8D9]" />
            <span>Tiny Memory Match 🎴</span>
          </h2>
          <p className="text-xs text-[#A7B7A0]">Flip the cozy symbols and find matching pairs.</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-[#102A25] text-[#F6F1E8]">
            Moves: <span className="text-[#B8A8D9]">{moves}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#102A25] text-[#E8B878]">
            Pairs: {matches}/{SYMBOLS.length}
          </div>
          <button
            onClick={initGame}
            className="p-1.5 rounded-xl bg-[#102A25] border border-[#B8A8D9]/20 text-[#A7B7A0] hover:text-[#FFFDF8]"
            title="Reset cards"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card, idx) => {
          const isRevealed = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={isRevealed}
              className={`aspect-square rounded-2xl border text-center transition-all duration-300 flex items-center justify-center text-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8A8D9] ${
                card.matched
                  ? 'bg-purple-950/60 border-purple-400/40 opacity-80 scale-95'
                  : isRevealed
                  ? 'bg-[#102A25] border-[#B8A8D9] shadow-md scale-102'
                  : 'bg-gradient-to-br from-[#1C453B] to-[#102A25] border-[#B8A8D9]/20 hover:border-[#B8A8D9]/50 hover:scale-102'
              }`}
            >
              {isRevealed ? (
                <span className="select-none animate-fade-in">{card.symbol}</span>
              ) : (
                <span className="text-xs text-[#A7B7A0]/50 font-serif font-bold">☁️</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="rounded-2xl bg-gradient-to-r from-[#231A38] to-[#173B32] border border-[#B8A8D9]/40 p-6 text-center space-y-3 animate-fade-in">
          <div className="text-3xl">🎉💜</div>
          <h3 className="font-serif-title text-2xl font-bold text-[#FFFDF8]">
            Brilliant Memory, Diyuuuu!
          </h3>
          <p className="text-xs sm:text-sm text-[#F6F1E8]/90 font-body">
            Aapne saare matching tokens sirf {moves} moves mein dhoondh liye!
          </p>
          <button
            onClick={initGame}
            className="px-6 py-2 rounded-xl bg-[#B8A8D9] text-[#102A25] text-xs font-bold hover:bg-[#D8CEEE] transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
