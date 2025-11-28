import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Play } from 'lucide-react';
import { useSongStore } from '../store/songStore';
import type { ChordType } from '../utils/musicTheory';
import { Chord } from 'tonal';
import { audioEngine } from '../utils/audioEngine';

interface ChordEditorProps {
    chord: ChordType;
    sIdx: number;
    cIdx: number;
    onClose: () => void;
}

export const ChordEditor: React.FC<ChordEditorProps> = ({ chord, sIdx, cIdx, onClose }) => {
    const updateChord = useSongStore(state => state.updateChord);

    const [root, setRoot] = useState(chord.root);
    const [quality, setQuality] = useState(chord.quality);
    const [bass, setBass] = useState('');
    const [duration, setDuration] = useState(chord.duration || 4);

    // Preview state
    const [previewSymbol, setPreviewSymbol] = useState(chord.symbol);

    useEffect(() => {
        let newSymbol = `${root}${quality}`;
        if (bass) newSymbol += `/${bass}`;
        setPreviewSymbol(newSymbol);
    }, [root, quality, bass]);

    const handleSave = () => {
        // Re-calculate chord data using Tonal
        const chordData = Chord.get(previewSymbol);

        // Construct new chord object
        const newChord: ChordType = {
            ...chord,
            root,
            quality,
            symbol: previewSymbol,
            notes: chordData.notes,
            bass: bass || undefined,
            duration
        };

        updateChord(sIdx, cIdx, newChord);
        onClose();
    };

    const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const QUALITIES = [
        { label: 'Major', value: '' },
        { label: 'Minor', value: 'm' },
        { label: 'Diminished', value: 'dim' },
        { label: 'Augmented', value: 'aug' },
        { label: 'Maj7', value: 'maj7' },
        { label: 'Min7', value: 'm7' },
        { label: 'Dom7', value: '7' },
        { label: 'Sus2', value: 'sus2' },
        { label: 'Sus4', value: 'sus4' },
        { label: 'Add9', value: 'add9' },
    ];

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#1a1a1f] w-96 rounded-2xl shadow-2xl overflow-hidden border border-white/10" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Edit Chord</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-white">{previewSymbol}</span>
                                <button
                                    onClick={() => {
                                        const chordData = Chord.get(previewSymbol);
                                        audioEngine.previewChord({
                                            ...chord,
                                            symbol: previewSymbol,
                                            root,
                                            quality,
                                            bass: bass || undefined,
                                            notes: chordData.notes,
                                            duration
                                        });
                                    }}
                                    className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors"
                                >
                                    <Play size={16} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Duration Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">时长 (Duration)</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[4, 2, 1, 0.5].map((beats) => (
                                    <button
                                        key={beats}
                                        onClick={() => setDuration(beats)}
                                        className={`py-2 rounded-lg text-sm font-medium transition-all ${duration === beats
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {beats === 4 && '4'}
                                        {beats === 2 && '2'}
                                        {beats === 1 && '1'}
                                        {beats === 0.5 && '0.5'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Root Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">根音 (Root)</label>
                            <div className="grid grid-cols-6 gap-2">
                                {ROOTS.map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setRoot(r)}
                                        className={`p-2 rounded text-sm font-bold transition-colors ${root === r ? 'bg-primary text-white' : 'bg-[#2d2d35] hover:bg-[#3d3d45] text-gray-300'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quality Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">性质 (Quality)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {QUALITIES.map(q => (
                                    <button
                                        key={q.value}
                                        onClick={() => setQuality(q.value)}
                                        className={`p-2 rounded text-xs font-medium transition-colors ${quality === q.value ? 'bg-secondary text-black' : 'bg-[#2d2d35] hover:bg-[#3d3d45] text-gray-300'
                                            }`}
                                    >
                                        {q.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bass Note (Optional) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">低音 (Bass / Inversion)</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setBass('')}
                                    className={`px-3 py-1 rounded text-xs ${!bass ? 'bg-gray-600 text-white' : 'bg-[#2d2d35] text-gray-400'}`}
                                >
                                    无
                                </button>
                                {ROOTS.map(r => (
                                    <button
                                        key={`bass-${r}`}
                                        onClick={() => setBass(r)}
                                        className={`w-8 py-1 rounded text-xs font-bold transition-colors ${bass === r ? 'bg-indigo-500 text-white' : 'bg-[#2d2d35] hover:bg-[#3d3d45] text-gray-500'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                )).slice(0, 7)}
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-primary hover:bg-indigo-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 mt-4"
                        >
                            <Check size={18} />
                            保存修改
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
