import { useState } from 'react';
import { imageUrl } from '../types';

interface Pass3Props {
  images: string[];
  folderPath: string;
  onComplete: (saved: string[]) => void;
}

export default function Pass3({ images, folderPath, onComplete }: Pass3Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const MAX = Math.min(4, images.length);

  const toggle = (img: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(img)) {
        next.delete(img);
      } else if (next.size < MAX) {
        next.add(img);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (selected.size < MAX) return;
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderPath,
          images: Array.from(selected),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save.');
        return;
      }

      onComplete(Array.from(selected));
    } catch {
      setError('Could not connect to server.');
    } finally {
      setSaving(false);
    }
  };

  // Determine grid columns based on image count
  const cols = images.length <= 4 ? images.length : Math.ceil(images.length / 2);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-ink-600">
        <div className="flex items-center gap-4">
          <span className="pass-badge">Pass 03 — The Final Four</span>
        </div>
        <div className="flex items-center gap-6 text-fog-400 font-mono text-xs">
          <span>
            <span className="text-gold-400 text-sm font-mono">{selected.size}</span>
            <span className="text-fog-500"> / {MAX} selected</span>
          </span>
          <span className="text-fog-500">|</span>
          <span className="text-fog-500">
            Choose {MAX} with the most variety &amp; best craft
          </span>
        </div>
      </div>

      {/* Selection progress dots */}
      <div className="h-px bg-ink-600">
        <div
          className="h-px bg-gold-400 transition-all duration-300"
          style={{ width: `${(selected.size / MAX) * 100}%` }}
        />
      </div>

      {/* Images grid */}
      <div
        className="flex-1 overflow-auto p-6 animate-fadeIn"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '8px',
          alignItems: 'start',
        }}
      >
        {images.map((img) => {
          const isSelected = selected.has(img);
          const isDisabled = !isSelected && selected.size >= MAX;

          return (
            <button
              key={img}
              onClick={() => toggle(img)}
              disabled={isDisabled}
              className={`group relative overflow-hidden transition-all duration-200 
                ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-ink-900' : 'hover:ring-1 hover:ring-fog-500 hover:ring-offset-1 hover:ring-offset-ink-900'}
              `}
            >
              <img
                src={imageUrl(img)}
                alt={img}
                className={`w-full h-full object-cover transition-all duration-300
                  ${isSelected ? 'brightness-100' : 'brightness-75 group-hover:brightness-90'}
                  ${isDisabled ? '' : 'group-hover:scale-[1.02]'}
                `}
                style={{ display: 'block', maxHeight: '45vh' }}
                draggable={false}
              />

              {/* Selection overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-gold-400 bg-opacity-10 pointer-events-none" />
              )}

              {/* Selection badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-gold-400 flex items-center justify-center shadow-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#080706" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {/* Hover indicator */}
              {!isSelected && !isDisabled && (
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-fog-500 
                                transition-all duration-200 pointer-events-none" />
              )}

              {/* Filename */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink-950 to-transparent px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <p className="text-fog-300 font-mono text-xs truncate">{img}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom save bar */}
      <div className="border-t border-ink-600 bg-ink-800 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex gap-2 items-center">
            {Array.from({ length: MAX }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 transition-all duration-200 ${
                  i < selected.size ? 'bg-gold-400' : 'bg-ink-500'
                }`}
              />
            ))}
            <span className="ml-3 text-fog-400 font-mono text-xs">
              {selected.size < MAX
                ? `Select ${MAX - selected.size} more image${MAX - selected.size === 1 ? '' : 's'}`
                : 'Ready to save'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {error && (
            <p className="text-red-400 font-mono text-xs">⚠ {error}</p>
          )}
          {selected.size === MAX && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary animate-scaleIn flex items-center gap-3"
            >
              {saving ? (
                <>
                  <span className="inline-block w-3 h-3 border border-ink-950 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  SAVE — Copy to BEST
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
