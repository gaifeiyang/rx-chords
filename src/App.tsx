import React, { useState } from 'react';
import { Controls } from './components/Controls';
import { SectionBlock } from './components/SectionBlock';
import { useSongStore } from './store/songStore';
import { Music, Settings as SettingsIcon } from 'lucide-react';
import { useAudio } from './hooks/useAudio';
import { StructureFlow } from './components/StructureFlow';
import { SettingsModal } from './components/SettingsModal';

const App: React.FC = () => {
  const { sections, genre, settings, isPlaying } = useSongStore();
  const [showSettings, setShowSettings] = useState(false);
  const { playFullSong, stop } = useAudio();

  // Theme Effect
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (settings.themeMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.themeMode);
    }
  }, [settings.themeMode]);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        if (isPlaying) stop();
        else playFullSong();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, playFullSong, stop]);

  // Genre-based dynamic background colors
  const getBackgroundStyle = () => {
    // If user explicitly sets Light mode, override with light colors
    if (settings.themeMode === 'light') {
      switch (genre) {
        case 'rock':
          return 'bg-gradient-to-br from-gray-100 to-gray-200';
        case 'emotional':
          return 'bg-gradient-to-br from-purple-50 to-pink-50';
        case 'complex':
          return 'bg-gradient-to-br from-blue-50 to-indigo-50';
        case 'pop':
        default:
          return 'bg-gradient-to-br from-white to-gray-50';
      }
    }

    // Dark mode genre colors
    switch (genre) {
      case 'rock':
        return 'bg-gradient-to-br from-gray-900 via-gray-800 to-red-900/20';
      case 'emotional':
        return 'bg-gradient-to-br from-purple-950 via-purple-900/40 to-pink-950/30';
      case 'complex':
        return 'bg-gradient-to-br from-indigo-950 via-blue-900/30 to-teal-950/20';
      case 'pop':
      default:
        return 'bg-gradient-to-br from-gray-900 to-gray-950';
    }
  };

  return (
    <div className={`${getBackgroundStyle()} min-h-screen transition-colors duration-1000`}>
      <div className="flex h-screen overflow-hidden">
        <Controls />

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="p-6 border-b border-white/10 backdrop-blur-sm flex items-center justify-between bg-white/20 dark:bg-black/10">
            <div className="flex items-center gap-3">
              <Music className="text-primary" size={32} />
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Song Structure</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Visual chord progression builder</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
            >
              <SettingsIcon size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </header>

          {/* Structure Flow Diagram */}
          <StructureFlow />

          {/* Sections */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                  <Music size={48} className="text-white" />
                </div>
                <h2 className="text-4xl font-semibold mb-3 tracking-tight text-gray-900 dark:text-white">准备开始创作</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md font-medium">
                  选择风格，点击生成。
                  <br />
                  <span className="text-sm mt-4 block text-gray-500">AI 驱动 • 专业和弦 • 真实采样</span>
                </p>
              </div>
            ) : (
              sections.map((section, sIdx) => (
                <SectionBlock key={section.id} section={section} sIdx={sIdx} />
              ))
            )}
          </div>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default App;
