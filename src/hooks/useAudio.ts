import { useCallback } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { useSongStore } from '../store/songStore';
import type { ChordType } from '../utils/musicTheory';
import type { Section } from '../store/songStore';
import * as Tone from 'tone';

export const useAudio = () => {
    const {
        tempo,
        sections,
        setIsPlaying,
        setPlaybackPosition,
        useDrums,
        settings
    } = useSongStore();

    const playChord = useCallback((chord: ChordType) => {
        audioEngine.playChord(chord, 'piano', '2n');
    }, []);

    const stop = useCallback(() => {
        // Stop transport first
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
        Tone.Transport.position = 0;

        // Stop all audio
        audioEngine.stopAll();

        // Update state
        setIsPlaying(false);
        setPlaybackPosition(-1, -1);
    }, [setIsPlaying, setPlaybackPosition]);

    const playSection = useCallback(async (section: Section) => {
        // Stop any current playback
        stop();

        const ready = await audioEngine.initialize();
        if (!ready) {
            console.error("Audio engine failed to initialize");
            return;
        }

        // Warmup context
        if (Tone.context.state !== 'running') {
            await Tone.context.resume();
        }

        // Set tempo on transport
        Tone.Transport.bpm.value = tempo;
        setIsPlaying(true);
        const beatTime = 60 / tempo;
        const sIdx = sections.findIndex(s => s.id === section.id);

        // Use Transport timeline (starts at 0)
        let transportTime = 0;

        // Schedule all chords in the section
        for (let l = 0; l < (section.loopCount || 1); l++) {
            section.chords.forEach((chord, cIdx) => {
                // Schedule visual update
                Tone.Transport.schedule((time) => {
                    Tone.Draw.schedule(() => {
                        setPlaybackPosition(sIdx, cIdx);
                    }, time);

                    // Audio playback
                    // Convert beats to duration string
                    const durationMap: Record<number, string> = {
                        4: '1n',
                        2: '2n',
                        1: '4n',
                        0.5: '8n'
                    };
                    const duration = durationMap[chord.duration] || '1n';

                    audioEngine.playChord(chord, 'piano', duration, time);

                    if (useDrums) {
                        audioEngine.playDrumPattern(tempo, settings.drumPattern, settings.drumComplexity, time);
                    }
                }, transportTime);

                transportTime += beatTime * (chord.duration || 4);
            });
        }

        // Cleanup at end
        Tone.Transport.schedule((time) => {
            Tone.Draw.schedule(() => {
                stop();
            }, time);
        }, transportTime);

        Tone.Transport.start();

    }, [tempo, useDrums, sections, setPlaybackPosition, settings.drumPattern, settings.drumComplexity, stop, setIsPlaying]);

    const playFullSong = useCallback(async () => {
        // Stop any current playback
        stop();

        const ready = await audioEngine.initialize();
        if (!ready) {
            console.error("Audio engine failed to initialize");
            return;
        }

        // Warmup context
        if (Tone.context.state !== 'running') {
            await Tone.context.resume();
        }

        // Set tempo on transport
        Tone.Transport.bpm.value = tempo;
        setIsPlaying(true);
        const beatTime = 60 / tempo;

        // Use Transport timeline (starts at 0)
        let transportTime = 0;

        sections.forEach((section, sIdx) => {
            for (let l = 0; l < (section.loopCount || 1); l++) {
                section.chords.forEach((chord, cIdx) => {
                    // Schedule visual update and audio playback
                    Tone.Transport.schedule((time) => {
                        Tone.Draw.schedule(() => {
                            setPlaybackPosition(sIdx, cIdx);
                        }, time);

                        // Audio playback
                        const durationMap: Record<number, string> = {
                            4: '1n',
                            2: '2n',
                            1: '4n',
                            0.5: '8n'
                        };
                        const duration = durationMap[chord.duration] || '1n';

                        audioEngine.playChord(chord, 'piano', duration, time);

                        if (useDrums) {
                            audioEngine.playDrumPattern(tempo, settings.drumPattern, settings.drumComplexity, time);
                        }
                    }, transportTime);

                    transportTime += beatTime * (chord.duration || 4);
                });
            }
        });

        // Cleanup at end
        Tone.Transport.schedule((time) => {
            Tone.Draw.schedule(() => {
                stop();
            }, time);
        }, transportTime);

        Tone.Transport.start();
    }, [sections, tempo, useDrums, settings.drumPattern, settings.drumComplexity, stop, setIsPlaying, setPlaybackPosition]);

    return {
        playChord,
        playSection,
        playFullSong,
        stop
    };
};
