import React, { useState, useRef, useEffect } from 'react';
import { Play, Plus, Repeat, Trash2, Edit2, Check, ArrowUp, ArrowDown } from 'lucide-react';
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
    const removeSection = useSongStore(state => state.removeSection);
    const moveSection = useSongStore(state => state.moveSection);
    const isPlaying = useSongStore(state => state.isPlaying);
    const currentSectionIndex = useSongStore(state => state.currentSectionIndex);
    const sections = useSongStore(state => state.sections);

    const [isRenaming, setIsRenaming] = useState(false);
    const [tempName, setTempName] = useState(section.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isRenaming]);

    const handleRename = () => {
        if (tempName.trim()) {
            updateSection(sIdx, { name: tempName.trim() });
        } else {
            setTempName(section.name); // Revert if empty
        }
        setIsRenaming(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleRename();
        if (e.key === 'Escape') {
            setTempName(section.name);
            setIsRenaming(false);
        }
    };

    const handleDeleteSection = () => {
        if (window.confirm(`Are you sure you want to delete "${section.name}"?`)) {
            removeSection(sIdx);
        }
    };

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
                    {isRenaming ? (
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={handleRename}
                                onKeyDown={handleKeyDown}
                                className="text-2xl font-bold text-gray-800 dark:text-white bg-transparent border-b-2 border-primary focus:outline-none w-40"
                            />
                            <button onClick={handleRename} className="text-primary hover:text-primary/80">
                                <Check size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group/title">
                            <h3
                                className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight cursor-pointer hover:text-primary transition-colors"
                                onDoubleClick={() => setIsRenaming(true)}
                            >
                                {section.name}
                            </h3>
                            <button
                                onClick={() => setIsRenaming(true)}
                                className="opacity-100 md:opacity-0 md:group-hover/title:opacity-100 text-gray-400 hover:text-primary transition-all p-2 md:p-0"
                            >
                                <Edit2 size={14} />
                            </button>
                        </div>
                    )}
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                        }`}>
                        {section.bars} Bars
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Move Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => moveSection(sIdx, sIdx - 1)}
                            disabled={sIdx === 0}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move Up"
                        >
                            <ArrowUp size={16} />
                        </button>
                        <button
                            onClick={() => moveSection(sIdx, sIdx + 1)}
                            disabled={sIdx === sections.length - 1}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move Down"
                        >
                            <ArrowDown size={16} />
                        </button>
                    </div>

                    <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />

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

                    <button
                        onClick={handleDeleteSection}
                        className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-300 transition-all shadow-sm hover:shadow-md"
                        title="Delete Section"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Chords Grid - Updated to 3-4-6-8 columns */}
            <div className={`grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 md:gap-4 p-2 md:p-4 rounded-2xl transition-all ${isActive
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
                    className="aspect-square rounded-xl md:rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group/add active:scale-95"
                >
                    <Plus size={24} className="group-hover/add:scale-110 transition-transform" />
                    <span className="text-[10px] md:text-xs font-medium mt-1 md:mt-2">Add</span>
                </button>
            </div>
        </div>
    );
};
