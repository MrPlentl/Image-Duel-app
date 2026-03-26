import { useState } from 'react';
import { AppState, initialAppState } from './types';
import FolderSelect from './components/FolderSelect';
import Pass1 from './components/Pass1';
import Pass2 from './components/Pass2';
import Pass3 from './components/Pass3';
import SuccessScreen from './components/SuccessScreen';

export default function App() {
  const [state, setState] = useState<AppState>(initialAppState);

  const updateState = (partial: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const handleReset = () => setState(initialAppState);

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-ink-600">
        <div className="flex items-center gap-6">
          <h1 className="text-display text-2xl font-light text-fog-100 tracking-wide">
            Photo Culler
          </h1>
          <span className="text-fog-500 font-mono text-xs">|</span>
          <span className="text-fog-400 font-mono text-xs tracking-widest uppercase">
            3-Pass Method
          </span>
        </div>

        {state.stage !== 'folder-select' && state.stage !== 'success' && (
          <div className="flex items-center gap-8">
            {/* Pass indicators */}
            {(['pass1', 'pass2', 'pass3'] as const).map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    state.stage === p
                      ? 'bg-gold-400'
                      : state.stage > p
                      ? 'bg-fog-500'
                      : 'bg-ink-600'
                  }`}
                />
                <span
                  className={`font-mono text-xs tracking-wider uppercase transition-colors ${
                    state.stage === p ? 'text-gold-400' : 'text-fog-500'
                  }`}
                >
                  Pass {i + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {state.stage === 'folder-select' && (
          <FolderSelect
            onComplete={(folderPath, images) => {
              const skip = images.length < 13;
              updateState({
                folderPath,
                allImages: images,
                stage: skip ? 'pass2' : 'pass1',
                pass1Keep: skip ? images : [],
              });
            }}
          />
        )}

        {state.stage === 'pass1' && (
          <Pass1
            images={state.allImages}
            onComplete={(kept) => {
              updateState({ stage: 'pass2', pass1Keep: kept });
            }}
          />
        )}

        {state.stage === 'pass2' && (
          <Pass2
            images={state.pass1Keep.length > 0 ? state.pass1Keep : state.allImages}
            onComplete={(kept) => {
              updateState({ stage: 'pass3', pass2Keep: kept });
            }}
          />
        )}

        {state.stage === 'pass3' && (
          <Pass3
            images={state.pass2Keep}
            folderPath={state.folderPath}
            onComplete={(saved) => {
              updateState({ stage: 'success', finalKeep: saved });
            }}
          />
        )}

        {state.stage === 'success' && (
          <SuccessScreen
            images={state.finalKeep}
            folderPath={state.folderPath}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
