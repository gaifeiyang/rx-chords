import { create } from 'zustand';
import type { ChordType } from '../utils/musicTheory';

export type Section = {
    id: string;
    name: string;
    type: 'Intro' | 'Verse' | 'Chorus' | 'Bridge' | 'Outro' | 'Pre-Chorus';
    chords: ChordType[];
    bars: number; // Duration in bars
    loopCount: number; // Number of times to repeat this section
};

export type Settings = {
    notationSystem: 'roman' | 'standard' | 'function';
    themeMode: 'light' | 'dark' | 'system';
    drumPattern: 'basic' | 'rock' | 'jazz' | 'funk';
    drumVolume: number; // -60 to 0 dB
    drumComplexity: number; // 0 to 100
};

export type SongState = {
    keyRoot: string;
    scaleType: 'major' | 'minor';
    genre: 'pop' | 'rock' | 'emotional' | 'complex';
    tempo: number;
    sections: Section[];
    useDrums: boolean;
    settings: Settings;

    // Playback State
    isPlaying: boolean;
    currentSectionIndex: number;
    currentChordIndex: number;

    // Actions
    setKey: (root: string, type: 'major' | 'minor') => void;
    setGenre: (genre: 'pop' | 'rock' | 'emotional' | 'complex') => void;
    setTempo: (bpm: number) => void;
    setUseDrums: (use: boolean) => void;
    setSections: (sections: Section[]) => void;
    addSection: () => void;
    removeSection: (index: number) => void;
    moveSection: (fromIndex: number, toIndex: number) => void;
    updateSection: (index: number, section: Partial<Section>) => void;
    updateChord: (sIdx: number, cIdx: number, chord: Partial<ChordType>) => void;
    addChord: (sIdx: number, chord: ChordType) => void;
    removeChord: (sIdx: number, cIdx: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setPlaybackPosition: (sIdx: number, cIdx: number) => void;
    resetSong: () => void;
    updateSettings: (settings: Partial<Settings>) => void;
};

export const useSongStore = create<SongState>((set) => ({
    keyRoot: 'C',
    scaleType: 'major',
    genre: 'pop',
    tempo: 120,
    sections: [],
    useDrums: true,
    settings: {
        notationSystem: 'roman',
        themeMode: 'light',
        drumPattern: 'basic',
        drumVolume: -10,
        drumComplexity: 50,
    },

    isPlaying: false,
    currentSectionIndex: -1,
    currentChordIndex: -1,

    setKey: (root, type) => set({ keyRoot: root, scaleType: type }),
    setGenre: (genre) => set({ genre }),
    setTempo: (tempo) => set({ tempo }),
    setUseDrums: (useDrums) => set({ useDrums }),
    setSections: (sections) => set({ sections }),

    addSection: () => set((state) => {
        const newSection: Section = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'New Section',
            type: 'Verse',
            chords: [],
            bars: 4,
            loopCount: 1
        };
        return { sections: [...state.sections, newSection] };
    }),

    removeSection: (index) => set((state) => {
        const sections = [...state.sections];
        sections.splice(index, 1);
        return { sections };
    }),

    moveSection: (fromIndex, toIndex) => set((state) => {
        if (toIndex < 0 || toIndex >= state.sections.length) return {};
        const sections = [...state.sections];
        const [movedSection] = sections.splice(fromIndex, 1);
        sections.splice(toIndex, 0, movedSection);
        return { sections };
    }),

    updateSection: (index, newSection) => set((state) => {
        const sections = [...state.sections];
        sections[index] = { ...sections[index], ...newSection };
        return { sections };
    }),

    updateChord: (sIdx, cIdx, chord) => set((state) => {
        const sections = [...state.sections];
        sections[sIdx].chords[cIdx] = { ...sections[sIdx].chords[cIdx], ...chord };
        return { sections };
    }),

    addChord: (sIdx, chord) => set((state) => {
        const sections = [...state.sections];
        sections[sIdx].chords.push(chord);
        sections[sIdx].bars = sections[sIdx].chords.length; // Update bars count
        return { sections };
    }),

    removeChord: (sIdx, cIdx) => set((state) => {
        const sections = [...state.sections];
        sections[sIdx].chords.splice(cIdx, 1);
        sections[sIdx].bars = sections[sIdx].chords.length; // Update bars count
        return { sections };
    }),

    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setPlaybackPosition: (sIdx, cIdx) => set({
        currentSectionIndex: sIdx,
        currentChordIndex: cIdx
    }),

    resetSong: () => set({
        sections: [],
        isPlaying: false,
        currentSectionIndex: -1,
        currentChordIndex: -1
    }),

    updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),
}));
