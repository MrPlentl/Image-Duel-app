import { useState, useRef } from 'react';

interface FolderSelectProps {
  onComplete: (folderPath: string, images: string[]) => void;
}

export default function FolderSelect({ onComplete }: FolderSelectProps) {
  const [folderPath, setFolderPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = async () => {
    const trimmed = folderPath.trim();
    if (!trimmed) {
      setError('Please enter a folder path.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to scan folder.');
        return;
      }

      onComplete(data.folderPath, data.images);
    } catch {
      setError('Could not connect to server. Make sure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan();
  };

  return (
    <div className="flex-1 flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-2xl animate-fadeIn">
        {/* Hero text */}
        <div className="mb-16 text-center">
          <p className="text-display text-6xl font-light text-fog-200 leading-tight mb-4">
            The 3-Pass
            <br />
            <em className="text-gold-400">Cull Method</em>
          </p>
          <p className="text-fog-400 font-mono text-sm leading-relaxed mt-6 max-w-lg mx-auto">
            Industry-standard photo selection. Pass 1 eliminates the flawed.
            Pass 2 duels the similar. Pass 3 finds your final four.
          </p>
        </div>

        {/* Folder input */}
        <div className="border border-ink-500 bg-ink-800 p-8">
          <label className="block text-fog-400 font-mono text-xs tracking-widest uppercase mb-3">
            Target Folder
          </label>
          <div className="flex gap-0">
            <input
              ref={inputRef}
              type="text"
              value={folderPath}
              onChange={(e) => {
                setFolderPath(e.target.value);
                setError('');
              }}
              onKeyDown={handleKey}
              placeholder="/Users/you/Photos/shoot-2024"
              className="flex-1 bg-ink-950 border border-ink-500 border-r-0 text-fog-100 font-mono text-sm px-4 py-3 
                         placeholder-fog-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
            <button
              onClick={handleScan}
              disabled={loading || !folderPath.trim()}
              className="btn-primary whitespace-nowrap px-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 border border-ink-950 border-t-transparent rounded-full animate-spin" />
                  Scanning
                </span>
              ) : (
                'Scan Folder'
              )}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-red-400 font-mono text-xs">
              ⚠ {error}
            </p>
          )}

          <p className="mt-4 text-fog-500 font-mono text-xs leading-relaxed">
            Supported formats: JPG, PNG, WEBP, GIF, TIFF, BMP
          </p>
        </div>

        {/* Process overview */}
        <div className="mt-8 grid grid-cols-3 gap-px bg-ink-600">
          {[
            { pass: '01', title: 'Gut Reaction', desc: 'Reject the flawed. One image at a time — thumbs up or down.' },
            { pass: '02', title: 'Side-by-Side Duel', desc: 'Compare pairs. You must choose one. Get from 12 down to 6.' },
            { pass: '03', title: 'The Final Four', desc: 'All 6 together. Pick the 4 with most variety and best craft.' },
          ].map((item) => (
            <div key={item.pass} className="bg-ink-800 px-6 py-5">
              <span className="text-gold-500 font-mono text-xs tracking-widest">PASS {item.pass}</span>
              <p className="text-fog-200 font-mono text-sm mt-2 mb-2">{item.title}</p>
              <p className="text-fog-500 font-mono text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
