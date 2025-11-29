import React, { useState, useEffect, useRef } from 'react';
import { Play, Edit3, Trash2, MoreHorizontal, X } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';
import { useSongStore } from '../store/songStore';
import type { ChordType } from '../utils/musicTheory';
import { ChordEditor } from './ChordEditor';

interface ChordCardProps {
    chord: ChordType;
    sIdx: number;
    cIdx: number;
}

export const ChordCard: React.FC<ChordCardProps> = ({ chord, sIdx, cIdx }) => {
    const { playChord } = useAudio();
    const { settings, removeChord, currentSectionIndex, currentChordIndex } = useSongStore();
    const [isEditing, setIsEditing] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isPlaying = currentSectionIndex === sIdx && currentChordIndex === cIdx;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMobileMenu(false);
            }
        };

        if (showMobileMenu) {
            document.addEventListener('mousedown', handleClickOutside as EventListener);
            document.addEventListener('touchstart', handleClickOutside as EventListener);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as EventListener);
            document.removeEventListener('touchstart', handleClickOutside as EventListener);
        };
    }, [showMobileMenu]);

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        playChord(chord);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Delete this chord?')) {
            removeChord(sIdx, cIdx);
        }
        setShowMobileMenu(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setShowMobileMenu(false);
    };

    // Determine display notation
    const getNotation = () => {
        switch (settings.notationSystem) {
            case 'roman':
                return chord.roman || chord.degree;
            case 'standard':
                return chord.degree;
            case 'function':
                return chord.function || 'Chord';
            default:
                return chord.roman;
        }
    };

    return (
        <>
            <div
                className={`group/card relative aspect-square flex flex-col justify-center rounded-xl md:rounded-2xl p-2 md:p-4 transition-all cursor-pointer border border-transparent select-none
                ${isPlaying
                        ? 'bg-primary text-white shadow-lg scale-105 ring-2 ring-primary/50'
                        : 'bg-white dark:bg-[#2c2c2e] hover:bg-gray-50 dark:hover:bg-[#3a3a3c] active:scale-95 transition-transform shadow-sm'
                    }`}
                onClick={handlePlay}
                onDoubleClick={() => setIsEditing(true)}
            >
                {/* Notation Analysis */}
                <div className={`absolute top-1 right-2 md:top-2 md:right-3 flex gap-1`}>
                    <div className={`text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded ${isPlaying ? 'text-white/80 bg-white/20' : 'text-gray-400 dark:text-gray-300 bg-gray-100 dark:bg-white/10'
                        }`}>
                        {getNotation()}
                    </div>
                    {/* Duration Badge */}
                    {(chord.duration && chord.duration !== 4) && (
                        <div className={`text-[8px] md:text-[10px] font-bold px-1.5 py-0.5 rounded ${isPlaying ? 'text-white/80 bg-white/20' : 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                            {chord.duration}
                        </div>
                    )}
                </div>

                {/* Chord Symbol */}
                <div className="text-center mt-3 mb-1 px-1">
                    <div className={`text-lg md:text-2xl font-bold tracking-tight truncate ${isPlaying ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                        {chord.symbol}
                    </div>
                    <div className={`text-[8px] md:text-[10px] font-medium uppercase tracking-wider truncate ${isPlaying ? 'text-white/70' : 'text-gray-400 dark:text-gray-300'}`}>
                        {chord.function || 'Chord'}
                    </div>
                </div>

                {/* Mobile Menu Button - Visible on touch, hidden on desktop hover group */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMobileMenu(!showMobileMenu);
                    }}
                    className={`md:hidden absolute bottom-1 right-1 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${isPlaying ? 'text-white/70 hover:text-white' : ''}`}
                >
                    <MoreHorizontal size={16} />
                </button>

                {/* Desktop Hover Actions */}
                <div className="hidden md:flex absolute inset-0 bg-white/80 dark:bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity rounded-2xl items-center justify-center gap-2 backdrop-blur-[1px]">
                    <button
                        onClick={handlePlay}
                        className="p-2 bg-blue-500 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                        title="Play"
                    >
                        <Play size={14} fill="currentColor" />
                    </button>
                    <button
                        onClick={handleEdit}
                        className="p-2 bg-gray-500 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                        title="Edit"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-red-500 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                {/* Mobile Action Menu (Overlay) */}
                {showMobileMenu && (
                    <div
                        ref={menuRef}
                        className="absolute inset-0 z-10 bg-white/95 dark:bg-[#2c2c2e]/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePlay}
                                className="p-3 bg-blue-500 rounded-full text-white shadow-lg active:scale-90 transition-transform"
                            >
                                <Play size={18} fill="currentColor" />
                            </button>
                            <button
                                onClick={handleEdit}
                                className="p-3 bg-gray-500 rounded-full text-white shadow-lg active:scale-90 transition-transform"
                            >
                                <Edit3 size={18} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-3 bg-red-500 rounded-full text-white shadow-lg active:scale-90 transition-transform"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMobileMenu(false);
                            }}
                            className="absolute top-1 right-1 p-1 text-gray-400"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            {isEditing && (
                <ChordEditor
                    chord={chord}
                    sIdx={sIdx}
                    cIdx={cIdx}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
};
