import { useState, useEffect, useCallback } from 'react';
import { imageUrl } from '../types';

interface Pass2Props {
  images: string[];
  onComplete: (kept: string[]) => void;
}

type Pair = [string, string];
type SingleAdvance = [string];

function makePairs(imgs: string[]): Array<Pair | SingleAdvance> {
  const pairs: Array<Pair | SingleAdvance> = [];
  for (let i = 0; i < imgs.length; i += 2) {
    if (i + 1 < imgs.length) {
      pairs.push([imgs[i], imgs[i + 1]]);
    } else {
      pairs.push([imgs[i]]);
    }
  }
  return pairs;
}

export default function Pass2({ images, onComplete }: Pass2Props) {
  const [pairs, setPairs] = useState<Array<Pair | SingleAdvance>>(() => makePairs(images));
  const [currentPairIdx, setCurrentPairIdx] = useState(0);
  const [kept, setKept] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  const currentPair = pairs[currentPairIdx];
  const isSingle = currentPair?.length === 1;
  const isLast = currentPairIdx === pairs.length - 1;

  const advance = useCallback(
    (winners: string[]) => {
      const newKept = [...kept, ...winners];

      setAnimKey((k) => k + 1);

      if (isLast) {
        if (newKept.length <= 6) {
          onComplete(newKept);
        } else {
          // Another round needed
          const shuffled = [...newKept];
          // Shuffle to create fresh matchups
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          setPairs(makePairs(shuffled));
          setCurrentPairIdx(0);
          setKept([]);
          setRound((r) => r + 1);
        }
      } else {
        setCurrentPairIdx((i) => i + 1);
        setKept(newKept);
      }
    },
    [kept, isLast, onComplete]
  );

  // Auto-advance singles
  useEffect(() => {
    if (isSingle && currentPair) {
      const timer = setTimeout(() => advance([currentPair[0]]), 500);
      return () => clearTimeout(timer);
    }
  }, [isSingle, currentPair, advance]);

  // Keyboard shortcuts
  useEffect(() => {
    if (isSingle) return;
    const handler = (e: KeyboardEvent) => {
      if (!currentPair || isSingle) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
        advance([(currentPair as Pair)[0]]);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
        advance([(currentPair as Pair)[1]]);
      if (e.key === 'b' || e.key === 'B') advance([...(currentPair as Pair)]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance, currentPair, isSingle]);

  const totalDuels = pairs.filter((p) => p.length === 2).length;
  const completedDuels = Math.min(currentPairIdx, totalDuels);

  if (isSingle && currentPair) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <p className="text-fog-400 font-mono text-sm mb-2">Odd image out — auto-advancing</p>
          <p className="text-gold-400 font-mono text-xs">{currentPair[0]}</p>
        </div>
      </div>
    );
  }

  if (!currentPair) return null;
  const [left, right] = currentPair as Pair;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-ink-600">
        <div className="flex items-center gap-4">
          <span className="pass-badge">Pass 02 — Side-by-Side Duel</span>
          {round > 1 && (
            <span className="text-fog-500 font-mono text-xs">Round {round}</span>
          )}
        </div>
        <div className="flex items-center gap-6 text-fog-400 font-mono text-xs">
          <span>
            <span className="text-fog-200">Duel {completedDuels + 1}</span>
            <span className="text-fog-600"> / {pairs.length}</span>
          </span>
          <span className="text-fog-500">|</span>
          <span>
            <span className="text-green-400">{kept.length}</span>
            <span className="text-fog-500"> advancing so far</span>
          </span>
          <span className="text-fog-500">|</span>
          <span className="text-fog-500">goal: ≤ 6</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-px bg-ink-600">
        <div
          className="h-px bg-gold-400 transition-all duration-300"
          style={{ width: `${(completedDuels / pairs.length) * 100}%` }}
        />
      </div>

      {/* Images */}
      <div key={animKey} className="flex-1 flex items-stretch gap-px overflow-hidden animate-fadeIn">
        {/* Left image */}
        <button
          onClick={() => advance([left])}
          className="group flex-1 flex flex-col items-center justify-center bg-ink-900 
                     hover:bg-ink-800 transition-colors duration-200 relative overflow-hidden p-6 gap-4"
        >
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500 
                          group-active:border-gold-300 transition-all duration-200 pointer-events-none" />
          <img
            src={imageUrl(left)}
            alt={left}
            className="max-w-full object-contain shadow-2xl shadow-ink-950 transition-transform duration-200 group-hover:scale-[1.01]"
            style={{ maxHeight: 'calc(100vh - 260px)' }}
            draggable={false}
          />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-fog-500 group-hover:text-gold-400 transition-colors">
              ← Choose Left
            </span>
          </div>
        </button>

        {/* Divider with VS */}
        <div className="flex flex-col items-center justify-center bg-ink-800 px-4 gap-4 shrink-0">
          <div className="h-16 w-px bg-ink-600" />
          <span className="text-display text-lg text-fog-600 font-light italic">vs</span>
          <div className="h-16 w-px bg-ink-600" />
        </div>

        {/* Right image */}
        <button
          onClick={() => advance([right])}
          className="group flex-1 flex flex-col items-center justify-center bg-ink-900 
                     hover:bg-ink-800 transition-colors duration-200 relative overflow-hidden p-6 gap-4"
        >
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500 
                          group-active:border-gold-300 transition-all duration-200 pointer-events-none" />
          <img
            src={imageUrl(right)}
            alt={right}
            className="max-w-full object-contain shadow-2xl shadow-ink-950 transition-transform duration-200 group-hover:scale-[1.01]"
            style={{ maxHeight: 'calc(100vh - 260px)' }}
            draggable={false}
          />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-fog-500 group-hover:text-gold-400 transition-colors">
              Choose Right →
            </span>
          </div>
        </button>
      </div>

      {/* Bottom bar with Both */}
      <div className="flex items-center justify-center gap-6 px-8 py-4 border-t border-ink-600 bg-ink-800">
        <button
          onClick={() => advance([left, right])}
          className="group flex items-center gap-2 border border-fog-600 px-6 py-2
                     hover:border-fog-300 hover:bg-ink-700 transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="text-fog-400 group-hover:text-fog-200">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span className="font-mono text-xs tracking-widest uppercase text-fog-400 group-hover:text-fog-200">
            Keep Both
          </span>
          <span className="font-mono text-xs text-fog-600 ml-1">B</span>
        </button>
        <p className="text-fog-600 font-mono text-xs">
          <span className="text-fog-400">← left</span>
          <span className="mx-3 text-fog-700">/</span>
          <span className="text-fog-400">right →</span>
          <span className="mx-3 text-fog-700">/</span>
          <span className="text-fog-400">B both</span>
        </p>
      </div>
    </div>
  );
}
