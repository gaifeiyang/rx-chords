import { Scale, Chord } from "tonal";

export type SongSectionType = 'Intro' | 'Verse' | 'Pre-Chorus' | 'Chorus' | 'Bridge' | 'Outro';

export type ChordFunction = 'Tonic' | 'Subdominant' | 'Dominant' | 'Mediant' | 'Submediant' | 'Supertonic' | 'Leading Tone';

export type ChordType = {
    root: string;
    quality: string;
    symbol: string;
    degree: number;
    function: ChordFunction;
    roman: string;
    notes: string[];
    bass?: string; // For inversions or slash chords
    duration: number; // Duration in beats (4 = whole, 2 = half, 1 = quarter, 0.5 = eighth)
};

export const SECTION_COLORS: Record<SongSectionType, string> = {
    'Intro': 'from-gray-700 to-gray-900',
    'Verse': 'from-blue-800 to-blue-900',
    'Pre-Chorus': 'from-purple-800 to-purple-900',
    'Chorus': 'from-rose-800 to-rose-900',
    'Bridge': 'from-orange-800 to-orange-900',
    'Outro': 'from-gray-800 to-black',
};

export const GENRES = {
    pop: {
        name: "流行 (Pop)",
        description: "经典流行和弦进行",
        progressions: [
            { degrees: [1, 5, 6, 4], name: "卡农进行 (I-V-vi-IV)", reference: "Pachelbel's Canon" },
            { degrees: [1, 6, 4, 5], name: "50年代进行 (I-vi-IV-V)", reference: "Stand By Me" },
            { degrees: [6, 4, 1, 5], name: "感伤进行 (vi-IV-I-V)", reference: "Apologize" },
            { degrees: [1, 4, 5, 4], name: "基础进行 (I-IV-V-IV)", reference: "Simple Pop" },
        ],
        qualities: ["", "sus2", "add9"],
    },
    rock: {
        name: "摇滚 (Rock)",
        description: "力量和弦与摇滚风格进行",
        progressions: [
            { degrees: [1, 6, 3, 7], name: "小调摇滚 (i-VI-III-VII)", reference: "Green Day Style" },
            { degrees: [1, 4, 1, 5], name: "强力和弦 (I-IV-I-V)", reference: "Classic Rock" },
            { degrees: [1, 7, 6, 7], name: "下行进行 (I-VII-vi-VII)", reference: "Alternative" },
            { degrees: [6, 4, 1, 5], name: "史诗摇滚 (vi-IV-I-V)", reference: "Epic Rock" },
        ],
        qualities: ["", "5", "sus2"],
    },
    emotional: {
        name: "抒情 (Ballad)",
        description: "情感丰富的抒情和弦",
        progressions: [
            { degrees: [6, 5, 4, 5], name: "悲伤循环 (vi-V-IV-V)", reference: "Sad Ballad" },
            { degrees: [1, 3, 6, 4], name: "黄金进行 (I-iii-vi-IV)", reference: "Emotional Pop" },
            { degrees: [4, 1, 5, 6], name: "希望进行 (IV-I-V-vi)", reference: "Hopeful" },
        ],
        qualities: ["", "maj7", "sus2", "add9"],
    },
    complex: {
        name: "爵士/R&B (Jazz)",
        description: "复杂的爵士和弦与二五一进行",
        progressions: [
            { degrees: [2, 5, 1, 6], name: "二五一 (ii-V-I-vi)", reference: "Jazz Standard" },
            { degrees: [4, 5, 3, 6], name: "R&B 常用 (IV-V-iii-vi)", reference: "Neo Soul" },
            { degrees: [1, 4, 2, 5], name: "循环 (I-IV-ii-V)", reference: "Jazz Turnaround" },
        ],
        qualities: ["maj7", "m7", "7", "sus4", "m9", "maj9", "13"],
    },
};

const getFunction = (degree: number, scaleType: 'major' | 'minor'): ChordFunction => {
    if (scaleType === 'major') {
        switch (degree) {
            case 1: return 'Tonic';
            case 2: return 'Supertonic';
            case 3: return 'Mediant';
            case 4: return 'Subdominant';
            case 5: return 'Dominant';
            case 6: return 'Submediant';
            case 7: return 'Leading Tone';
            default: return 'Tonic';
        }
    } else {
        // Simplified minor functions
        switch (degree) {
            case 1: return 'Tonic';
            case 2: return 'Supertonic';
            case 3: return 'Mediant';
            case 4: return 'Subdominant';
            case 5: return 'Dominant';
            case 6: return 'Submediant';
            case 7: return 'Leading Tone'; // Or Subtonic depending on scale
            default: return 'Tonic';
        }
    }
};

export const getRomanNumeral = (degree: number, quality: string): string => {
    const romans = ["I", "II", "III", "IV", "V", "VI", "VII"];
    let numeral = romans[degree - 1] || "I";

    if (quality.includes("m") && !quality.includes("maj")) {
        numeral = numeral.toLowerCase();
    }
    if (quality.includes("dim")) {
        numeral = numeral.toLowerCase() + "°";
    }
    if (quality.includes("aug")) {
        numeral = numeral + "+";
    }

    // Add 7th if present
    if (quality.includes("7")) {
        numeral += "7";
    }

    return numeral;
};

export const getScaleChords = (root: string, scaleType: "major" | "minor" = "major"): ChordType[] => {
    const scaleName = `${root} ${scaleType}`;
    const scale = Scale.get(scaleName);

    if (scale.empty) return [];

    // Basic diatonic chords
    const chords = scale.notes.map((note, index) => {
        const degree = index + 1;
        let quality = "";

        // Determine basic diatonic quality
        if (scaleType === "major") {
            if ([2, 3, 6].includes(degree)) quality = "m";
            if (degree === 7) quality = "dim";
        } else {
            if ([1, 4, 5].includes(degree)) quality = "m";
            if (degree === 2) quality = "dim";
        }

        const symbol = `${note}${quality}`;
        const chordData = Chord.get(symbol);
        const func = getFunction(degree, scaleType);
        const roman = getRomanNumeral(degree, quality);

        return {
            root: note,
            quality,
            symbol,
            degree,
            function: func,
            roman,
            notes: chordData.notes,
            duration: 4, // Default to whole note
        };
    });

    return chords;
};

export const getChordNotes = (symbol: string): string[] => {
    return Chord.get(symbol).notes;
};
