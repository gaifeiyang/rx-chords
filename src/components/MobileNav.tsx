import React from 'react';
import { Music, Wand2, Settings } from 'lucide-react';

interface MobileNavProps {
    activeTab: 'editor' | 'generator' | 'settings';
    onTabChange: (tab: 'editor' | 'generator' | 'settings') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#1a1a1f]/90 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                <button
                    onClick={() => onTabChange('editor')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'editor'
                        ? 'text-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    <Music size={24} strokeWidth={activeTab === 'editor' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Editor</span>
                </button>

                <button
                    onClick={() => onTabChange('generator')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'generator'
                        ? 'text-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    <Wand2 size={24} strokeWidth={activeTab === 'generator' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Generator</span>
                </button>

                <button
                    onClick={() => onTabChange('settings')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'settings'
                        ? 'text-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                >
                    <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};
