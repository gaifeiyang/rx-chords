import { GENRES, getScaleChords } from './musicTheory';
import type { ChordType, SongSectionType } from './musicTheory';
import { v4 as uuidv4 } from 'uuid';
import type { Section } from '../store/songStore';

const SONG_STRUCTURES: SongSectionType[][] = [
    ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
    ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
    ['Verse', 'Chorus', 'Verse', 'Chorus', 'Outro'], // Short version
];

export function generateSongStructure(
    keyRoot: string,
    scaleType: 'major' | 'minor',
    genre: 'pop' | 'rock' | 'emotional' | 'complex'
): Section[] {
    // 1. Select a structure template
    const template = SONG_STRUCTURES[Math.floor(Math.random() * SONG_STRUCTURES.length)];
    const genreData = GENRES[genre];
    const scaleChords = getScaleChords(keyRoot, scaleType);

    // 2. Generate progressions for each unique section type to ensure consistency (e.g. all Choruses are the same)
    const sectionProgressions: Record<string, ChordType[]> = {};

    const uniqueSectionTypes = Array.from(new Set(template));

    uniqueSectionTypes.forEach(type => {
        // Choose a progression for this section type
        const progressionTemplate = genreData.progressions[
            Math.floor(Math.random() * genreData.progressions.length)
        ];

        const degrees = progressionTemplate.degrees;
        const chords: ChordType[] = [];

        degrees.forEach(degree => {
            const baseChord = scaleChords[degree - 1];
            if (!baseChord) return;

            // Add some variation based on genre
            let quality = baseChord.quality;
            if (genreData.qualities.length > 0) {
                // 30% chance to add extension/alteration
                if (Math.random() < 0.3) {
                    const alt = genreData.qualities[Math.floor(Math.random() * genreData.qualities.length)];
                    if (alt) quality = alt;
                }
            }

            const chordData = { ...baseChord };
            if (quality !== baseChord.quality) {
                chordData.quality = quality;
                chordData.symbol = chordData.root + quality;
            }

            // Apply specific genre flavor
            if (genre === 'complex' && [2, 3, 6].includes(degree)) {
                chordData.quality = 'm7';
                chordData.symbol = chordData.root + 'm7';
            } else if (genre === 'complex' && [1, 4].includes(degree)) {
                chordData.quality = 'maj7';
                chordData.symbol = chordData.root + 'maj7';
            } else if (genre === 'complex' && degree === 5) {
                chordData.quality = '7';
                chordData.symbol = chordData.root + '7';
            }

            chords.push(chordData);
        });

        sectionProgressions[type] = chords;
    });

    // 3. Build the full song
    const sections: Section[] = [];
    template.forEach((sectionType) => {
        const baseChords = sectionProgressions[sectionType];
        // Clone chords to avoid reference issues if we edit later
        const sectionChords = baseChords.map(c => ({ ...c }));

        sections.push({
            id: uuidv4(),
            name: sectionType,
            type: sectionType,
            chords: sectionChords,
            bars: sectionChords.length,
            loopCount: 1,
        });
    });

    return sections;
}
