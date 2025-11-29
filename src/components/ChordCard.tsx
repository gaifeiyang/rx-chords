import React, { useState } from 'react';
import { Play, Edit3, Trash2 } from 'lucide-react';
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

    const isPlaying = currentSectionIndex === sIdx && currentChordIndex === cIdx;

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        playChord(chord);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Delete this chord?')) {
            removeChord(sIdx, cIdx);
        }
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
                className={`group/card relative aspect-square flex flex-col justify-center rounded-xl md:rounded-2xl p-2 md:p-4 transition-all cursor-pointer border border-transparent 
                ${isPlaying
                        ? 'bg-primary text-white shadow-lg scale-105 ring-2 ring-primary/50'
                        : 'bg-white dark:bg-[#2c2c2e] hover:bg-gray-50 dark:hover:bg-[#3a3a3c] hover:-translate-y-1 hover:shadow-xl shadow-sm'
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

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-white/80 dark:bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <button
                        onClick={handlePlay}
                        className="p-2 bg-blue-500 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                        title="Play"
                    >
                        <Play size={14} fill="currentColor" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
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
