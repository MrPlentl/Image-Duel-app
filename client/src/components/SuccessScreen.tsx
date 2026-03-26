import { imageUrl } from '../types';

interface SuccessScreenProps {
  images: string[];
  folderPath: string;
  onReset: () => void;
}

export default function SuccessScreen({ images, folderPath, onReset }: SuccessScreenProps) {
  const bestFolder = `${folderPath}/BEST`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 animate-fadeIn">
      <div className="w-full max-w-4xl">
        {/* Success header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-gold-500" />
            <div className="w-5 h-5 border border-gold-400 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="w-12 h-px bg-gold-500" />
          </div>

          <h2 className="text-display text-5xl font-light text-fog-100 mb-4">
            Your Best Four
          </h2>
          <p className="text-fog-400 font-mono text-sm mb-6">
            Culling complete. {images.length} image{images.length !== 1 ? 's' : ''} copied to:
          </p>
          <div className="inline-block border border-gold-500 border-opacity-40 bg-ink-800 px-5 py-2">
            <span className="text-gold-400 font-mono text-xs tracking-wide">{bestFolder}</span>
          </div>
        </div>

        {/* Final images showcase */}
        <div
          className="grid gap-3 mb-12"
          style={{
            gridTemplateColumns: `repeat(${images.length}, 1fr)`,
          }}
        >
          {images.map((img, i) => (
            <div
              key={img}
              className="relative overflow-hidden animate-scaleIn"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <img
                src={imageUrl(img)}
                alt={img}
                className="w-full object-cover shadow-2xl shadow-ink-950"
                style={{ maxHeight: '320px' }}
                draggable={false}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink-950 to-transparent px-3 py-3">
                <p className="text-fog-400 font-mono text-xs truncate">{img}</p>
              </div>
              <div className="absolute top-2 left-2 bg-gold-400 px-2 py-0.5">
                <span className="text-ink-950 font-mono text-xs font-medium">{i + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="border border-ink-600 bg-ink-800 p-6 mb-10 grid grid-cols-3 divide-x divide-ink-600">
          <div className="px-6 text-center">
            <p className="text-display text-3xl text-gold-400 mb-1">{images.length}</p>
            <p className="text-fog-500 font-mono text-xs uppercase tracking-wider">Final Selects</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-display text-3xl text-fog-200 mb-1">3</p>
            <p className="text-fog-500 font-mono text-xs uppercase tracking-wider">Passes Complete</p>
          </div>
          <div className="px-6 text-center">
            <p className="text-display text-lg text-fog-300 mb-1 mt-1 font-mono tracking-tight truncate text-sm">
              /BEST
            </p>
            <p className="text-fog-500 font-mono text-xs uppercase tracking-wider">Destination Folder</p>
          </div>
        </div>

        {/* Start over */}
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="btn-ghost flex items-center gap-3"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
            </svg>
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
