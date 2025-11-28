import React from 'react';
import { Play, Plus, Repeat } from 'lucide-react';
import type { Section } from '../store/songStore';
import { ChordCard } from './ChordCard';
import { useSongStore } from '../store/songStore';
import { useAudio } from '../hooks/useAudio';
import { SECTION_COLORS } from '../utils/musicTheory';

interface SectionBlockProps {
    section: Section;
    sIdx: number;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({ section, sIdx }) => {
    const { playSection } = useAudio();
    const updateSection = useSongStore(state => state.updateSection);
    const addChord = useSongStore(state => state.addChord);
    const isPlaying = useSongStore(state => state.isPlaying);
    const currentSectionIndex = useSongStore(state => state.currentSectionIndex);

    const isActive = isPlaying && currentSectionIndex === sIdx;

    const handlePlay = () => {
        playSection(section);
    };

    const handleLoopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(1, Math.min(8, parseInt(e.target.value) || 1));
        updateSection(sIdx, { loopCount: val });
    };

    const handleAddChord = () => {
        const lastChord = section.chords[section.chords.length - 1];
        const newChord = lastChord ? { ...lastChord } : {
            root: 'C', quality: '', symbol: 'C', degree: 1, function: 'Tonic', roman: 'I', notes: ['C4', 'E4', 'G4'], duration: 4
        };
        addChord(sIdx, newChord as any);
    };

    const colorClass = SECTION_COLORS[section.type] || 'from-gray-700 to-gray-900';

    return (
        <div className={`relative group transition-all duration-500 ${isActive ? 'scale-[1.02]' : ''}`}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                    <div className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${colorClass}`}></div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                        {section.name}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                        }`}>
                        {section.bars} Bars
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Loop Control */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-300 dark:hover:border-white/20 transition-colors">
                        <Repeat size={14} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Loop:</span>
                        <input
                            type="number"
                            min="1"
                            max="8"
                            value={section.loopCount}
                            onChange={handleLoopChange}
                            className="w-8 bg-transparent text-center text-sm font-bold text-gray-800 dark:text-white focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={handlePlay}
                        className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white text-gray-600 dark:text-gray-300 transition-all shadow-sm hover:shadow-md"
                        title="Play Section"
                    >
                        <Play size={18} fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Chords Grid - Updated to 4-6-8 columns */}
            <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 rounded-2xl transition-all ${isActive
                ? 'bg-primary/5 border border-primary/20 shadow-xl shadow-primary/5'
                : 'bg-white/40 dark:bg-white/5 border border-white/20 hover:bg-white/60 dark:hover:bg-white/10'
                }`}>
                {section.chords.map((chord, cIdx) => (
                    <div key={`${section.id}-${cIdx}`}>
                        <ChordCard
                            chord={chord}
                            sIdx={sIdx}
                            cIdx={cIdx}
                        />
                    </div>
                ))}

                {/* Add Chord Button */}
                <button
                    onClick={handleAddChord}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group/add"
                >
                    <Plus size={24} className="group-hover/add:scale-110 transition-transform" />
                    <span className="text-xs font-medium mt-2">Add Chord</span>
                </button>
            </div>
        </div>
    );
};
