import React from 'react';
import { useSongStore } from '../store/songStore';
import { ChevronRight } from 'lucide-react';

export const StructureFlow: React.FC = () => {
    const { sections } = useSongStore();

    if (sections.length === 0) return null;

    return (
        <div className="w-full p-4 bg-white/30 dark:bg-black/10 backdrop-blur-sm border-y border-white/20 overflow-x-auto">
            <div className="flex items-center gap-2 justify-center min-w-max">
                {sections.map((section, idx) => (
                    <React.Fragment key={section.id}>
                        <div className="flex flex-col items-center">
                            <div className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <div className="text-sm font-bold text-gray-800 dark:text-white">
                                    {section.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {section.chords.length} chords {section.loopCount > 1 && `× ${section.loopCount}`}
                                </div>
                            </div>
                        </div>
                        {idx < sections.length - 1 && (
                            <ChevronRight size={16} className="text-gray-400 dark:text-gray-600 flex-shrink-0" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
