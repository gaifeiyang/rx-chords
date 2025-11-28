import React from 'react';
import { X, Moon, Sun, Monitor, Type } from 'lucide-react';
import { useSongStore } from '../store/songStore';

interface SettingsModalProps {
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const { settings, updateSettings } = useSongStore();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-[#1c1c1e] w-96 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">设置 (Settings)</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Notation System */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <Type size={14} />
                            和弦标记 (Notation)
                        </label>
                        <div className="bg-gray-100 dark:bg-[#2c2c2e] p-1 rounded-lg flex">
                            {(['roman', 'standard', 'function'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => updateSettings({ notationSystem: mode })}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${settings.notationSystem === mode
                                        ? 'bg-white dark:bg-[#636366] text-black dark:text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {mode === 'roman' ? '级数 (I, ii)' : mode === 'standard' ? '数字 (1, 2)' : '功能 (T, S)'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme Mode (Placeholder for now as we mostly use genre themes, but good to have) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <Monitor size={14} />
                            外观 (Appearance)
                        </label>
                        <div className="bg-gray-100 dark:bg-[#2c2c2e] p-1 rounded-lg flex">
                            <button
                                onClick={() => updateSettings({ themeMode: 'light' })}
                                className={`flex-1 py-1.5 flex justify-center rounded-md transition-all ${settings.themeMode === 'light' ? 'bg-white shadow-sm' : 'text-gray-400'
                                    }`}
                            >
                                <Sun size={16} />
                            </button>
                            <button
                                onClick={() => updateSettings({ themeMode: 'dark' })}
                                className={`flex-1 py-1.5 flex justify-center rounded-md transition-all ${settings.themeMode === 'dark' ? 'bg-[#636366] text-white shadow-sm' : 'text-gray-400'
                                    }`}
                            >
                                <Moon size={16} />
                            </button>
                            <button
                                onClick={() => updateSettings({ themeMode: 'system' })}
                                className={`flex-1 py-1.5 flex justify-center rounded-md transition-all ${settings.themeMode === 'system' ? 'bg-white dark:bg-[#636366] shadow-sm' : 'text-gray-400'
                                    }`}
                            >
                                <Monitor size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#2c2c2e]/50 px-6 py-4 text-center">
                    <p className="text-[10px] text-gray-400">
                        AI Music Composer v2.1 • Designed with ❤️
                    </p>
                </div>
            </div>
        </div>
    );
};
