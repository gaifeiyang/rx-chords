import React from 'react';
import { useSongStore } from '../store/songStore';
import { generateSongStructure } from '../utils/composer';
import { GENRES } from '../utils/musicTheory';
import { Wand2, Play, Square, Image, Loader2, Trash2 } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { audioEngine } from '../utils/audioEngine';
import { exportAsImage } from '../utils/exportImage';

const ALL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const KEY_DISPLAY = {
    'C': 'C', 'C#': 'C# / Db', 'D': 'D', 'D#': 'D# / Eb',
    'E': 'E', 'F': 'F', 'F#': 'F# / Gb', 'G': 'G',
    'G#': 'G# / Ab', 'A': 'A', 'A#': 'A# / Bb', 'B': 'B'
};

export const Controls: React.FC = () => {
    const {
        keyRoot, scaleType, genre, tempo, isPlaying, settings,
        setKey, setGenre, setSections, setTempo, updateSettings
    } = useSongStore();

    const { playFullSong, stop } = useAudio();
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Pre-initialize audio engine while generating
        audioEngine.initialize();
        setTimeout(() => {
            const newSections = generateSongStructure(keyRoot, scaleType, genre);
            setSections(newSections);
            setIsGenerating(false);
        }, 500);
    };

    const handlePlayToggle = () => {
        if (isPlaying) {
            stop();
        } else {
            playFullSong();
        }
    };

    return (
        <div className="w-full md:w-80 p-6 flex flex-col gap-6 border-r border-gray-200/50 dark:border-white/10 h-full overflow-y-auto font-sans bg-white/40 dark:bg-black/20 backdrop-blur-xl transition-colors duration-300">
            <div>
                <h1 className="text-2xl font-light tracking-widest text-gray-900 dark:text-white mb-1">
                    和弦<span className="font-bold text-primary">构机</span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI 辅助音乐创作 v2.1</p>
            </div>

            {/* Key Selection */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">调性中心</label>
                <div className="grid grid-cols-3 gap-2">
                    {ALL_KEYS.map(k => (
                        <button
                            key={k}
                            onClick={() => setKey(k, scaleType)}
                            className={`p-2 rounded text-xs font-medium transition-all ${keyRoot === k
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                : 'bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {KEY_DISPLAY[k as keyof typeof KEY_DISPLAY]}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 mt-2">
                    {(['major', 'minor'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setKey(keyRoot, t)}
                            className={`flex-1 p-2 rounded text-xs font-bold transition-colors ${scaleType === t
                                ? 'bg-gray-800 dark:bg-gray-600 text-white'
                                : 'bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            {t === 'major' ? '大调 (Major)' : '小调 (Minor)'}
                        </button>
                    ))}
                </div>
            </div>

            {/* BPM Control */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex justify-between items-center">
                    <span>速度 (BPM)</span>
                    <input
                        type="number"
                        value={tempo}
                        onChange={(e) => setTempo(Math.min(240, Math.max(40, Number(e.target.value))))}
                        className="w-16 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-right text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                </label>
                <input
                    type="range"
                    min="40"
                    max="240"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider accent-primary touch-manipulation"
                />
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-600">
                    <span>40</span>
                    <span>140</span>
                    <span>240</span>
                </div>
            </div>

            {/* Genre Selection */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">音乐风格</label>
                <div className="grid grid-cols-1 gap-2">
                    {Object.entries(GENRES).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setGenre(key as 'pop' | 'rock' | 'emotional' | 'complex')}
                            className={`p-3 rounded text-left transition-all border ${genre === key
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-white/50 dark:bg-white/5 border-transparent hover:bg-white/80 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <div className="font-bold text-sm">{data.name}</div>
                            <div className="text-[10px] opacity-70">{data.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Drum Controls - Collapsible */}
            <details className="pt-4 border-t border-gray-200/50 dark:border-white/10">
                <summary className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-3 list-none flex items-center justify-between">
                    <span>鼓机设置 (Drums)</span>
                    <span className="text-[10px]">▼</span>
                </summary>

                <div className="space-y-3">
                    {/* Pattern Select */}
                    <div className="grid grid-cols-4 gap-1">
                        {(['basic', 'rock', 'jazz', 'funk'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => updateSettings({ drumPattern: p })}
                                className={`text-[10px] py-1 rounded ${settings.drumPattern === p
                                    ? 'bg-primary text-white'
                                    : 'bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-white/10'
                                    }`}
                            >
                                {p.slice(0, 1).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Complexity Slider */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
                            <span>Simple</span>
                            <span>Complex</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.drumComplexity}
                            onChange={(e) => updateSettings({ drumComplexity: parseInt(e.target.value) })}
                            className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary touch-manipulation"
                        />
                    </div>

                    {/* Volume Slider */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
                            <span>Vol</span>
                            <span>{settings.drumVolume}dB</span>
                        </div>
                        <input
                            type="range"
                            min="-40"
                            max="0"
                            value={settings.drumVolume}
                            onChange={(e) => updateSettings({ drumVolume: parseInt(e.target.value) })}
                            className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary touch-manipulation"
                        />
                    </div>
                </div>
            </details>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-200/50 dark:border-white/10">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-500 hover:to-primary text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                    {isGenerating ? '正在创作...' : '生成歌曲结构'}
                </button>

                <button
                    onClick={handlePlayToggle}
                    className={`w-full py-3 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${isPlaying
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-secondary hover:bg-[#00b5b0] text-black'
                        }`}
                >
                    {isPlaying ? <><Square size={16} fill="currentColor" /> 停止播放</> : <><Play size={16} fill="currentColor" /> 播放全曲</>}
                </button>

                <button
                    onClick={exportAsImage}
                    className="w-full py-3 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <Image size={16} />
                    导出图片
                </button>

                <button
                    onClick={() => {
                        if (window.confirm('确定要清空所有内容吗？')) {
                            useSongStore.getState().resetSong();
                        }
                    }}
                    className="w-full py-2 text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-1"
                >
                    <Trash2 size={12} />
                    清空重置 (Reset)
                </button>
            </div>
        </div>
    );
};
