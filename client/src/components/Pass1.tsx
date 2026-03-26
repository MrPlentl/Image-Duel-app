import { useState, useEffect, useCallback } from 'react';
import { imageUrl } from '../types';

interface Pass1Props {
  images: string[];
  onComplete: (kept: string[]) => void;
}

export default function Pass1({ images, onComplete }: Pass1Props) {
  const [queue, setQueue] = useState<string[]>(images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [kept, setKept] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);

  const currentImage = queue[currentIndex];
  const isLast = currentIndex === queue.length - 1;

  const advance = useCallback(
    (thumbsUp: boolean) => {
      const newKept = thumbsUp ? [...kept, currentImage] : kept;

      setDirection(thumbsUp ? 'up' : 'down');
      setTimeout(() => {
        setDirection(null);
        setAnimKey((k) => k + 1);

        if (isLast) {
          // End of this round
          if (newKept.length <= 12) {
            onComplete(newKept);
          } else {
            // Need another round
            setQueue(newKept);
            setCurrentIndex(0);
            setKept([]);
            setRound((r) => r + 1);
          }
        } else {
          setCurrentIndex((i) => i + 1);
          setKept(newKept);
        }
      }, 180);
    },
    [currentImage, kept, isLast, onComplete]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') advance(true);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') advance(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance]);

  const progress = ((currentIndex) / queue.length) * 100;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-ink-600">
        <div className="flex items-center gap-4">
          <span className="pass-badge">Pass 01 — Gut Reaction</span>
          {round > 1 && (
            <span className="text-fog-500 font-mono text-xs">Round {round}</span>
          )}
        </div>
        <div className="flex items-center gap-6 text-fog-400 font-mono text-xs">
          <span>
            <span className="text-fog-200">{currentIndex + 1}</span>
            <span className="text-fog-600"> / {queue.length}</span>
          </span>
          <span className="text-fog-500">|</span>
          <span>
            <span className="text-green-400">{kept.length}</span>
            <span className="text-fog-500"> kept so far</span>
          </span>
          <span className="text-fog-500">|</span>
          <span className="text-fog-500">goal: ≤ 12</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-ink-600">
        <div
          className="h-px bg-gold-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Image display */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-6 gap-6 overflow-hidden">
        <div
          key={animKey}
          className={`relative flex items-center justify-center w-full max-w-4xl
            ${direction === 'up' ? 'animate-slideLeft opacity-0' : ''}
            ${direction === 'down' ? 'animate-slideRight opacity-0' : ''}
            ${direction === null ? 'animate-fadeIn' : ''}
          `}
          style={{ maxHeight: 'calc(100vh - 280px)' }}
        >
          <img
            src={imageUrl(currentImage)}
            alt={currentImage}
            className="max-w-full max-h-full object-contain shadow-2xl shadow-ink-950"
            style={{ maxHeight: 'calc(100vh - 280px)' }}
            draggable={false}
          />
        </div>

        {/* Filename */}
        <p className="text-fog-500 font-mono text-xs tracking-wide truncate max-w-md">
          {currentImage}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => advance(false)}
            className="group flex items-center gap-3 border border-red-900 bg-ink-800 px-8 py-4
                       hover:border-red-600 hover:bg-red-950 transition-all duration-200 active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="text-red-500 group-hover:text-red-300 transition-colors">
              <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3z"/>
              <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
            </svg>
            <span className="font-mono text-xs tracking-widest uppercase text-red-400 group-hover:text-red-300">
              Reject
            </span>
            <span className="font-mono text-xs text-fog-600 ml-1">←</span>
          </button>

          <div className="text-fog-600 font-mono text-xs px-4">or</div>

          <button
            onClick={() => advance(true)}
            className="group flex items-center gap-3 border border-green-900 bg-ink-800 px-8 py-4
                       hover:border-green-600 hover:bg-green-950 transition-all duration-200 active:scale-95"
          >
            <span className="font-mono text-xs tracking-widest uppercase text-green-400 group-hover:text-green-300">
              Keep
            </span>
            <span className="font-mono text-xs text-fog-600 mr-1">→</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="text-green-500 group-hover:text-green-300 transition-colors">
              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3z"/>
              <path d="M7 22H4.67A2.31 2.31 0 012 20V13a2.31 2.31 0 012.33-2H7"/>
            </svg>
          </button>
        </div>

        <p className="text-fog-600 font-mono text-xs">
          keyboard: <span className="text-fog-400">← reject</span>
          <span className="text-fog-600 mx-2">/</span>
          <span className="text-fog-400">→ keep</span>
        </p>
      </div>
    </div>
  );
}
