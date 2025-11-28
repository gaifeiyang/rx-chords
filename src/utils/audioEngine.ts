import * as Tone from 'tone';
import type { ChordType } from './musicTheory';

class AudioEngine {
    private piano: Tone.Sampler;
    private guitar: Tone.Sampler;
    private kick: Tone.MembraneSynth;
    private snare: Tone.NoiseSynth;
    private hihat: Tone.MetalSynth;
    private isReady: boolean = false;
    private isLoading: boolean = false;

    constructor() {
        // Piano Sampler - with loading callback
        this.piano = new Tone.Sampler({
            urls: {
                "C4": "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                "A4": "A4.mp3",
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/",
            onload: () => console.log("✓ Piano loaded")
        }).toDestination();
        this.piano.volume.value = -5;

        // Guitar Sampler
        this.guitar = new Tone.Sampler({
            urls: {
                "C4": "C4.mp3",
                "E4": "E4.mp3",
                "G4": "G4.mp3",
                "B4": "B4.mp3",
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/acoustic_guitar_nylon/",
            onload: () => console.log("✓ Guitar loaded")
        }).toDestination();
        this.guitar.volume.value = -5;

        // Drum Synths
        this.kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 10,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' }
        }).toDestination();

        this.snare = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
        }).toDestination();

        this.hihat = new Tone.MetalSynth({
            envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();

        this.setDrumVolume(-10);
    }

    async initialize() {
        if (this.isReady) return true;
        if (this.isLoading) {
            console.log("Audio is already initializing...");
            return false;
        }

        this.isLoading = false;

        try {
            await Tone.start();
            console.log("✓ Audio Context Started");

            // Wait for samplers to load (with 5s timeout)
            const loaded = await this.waitForSamplersLoaded();

            if (!loaded) {
                console.warn("⚠ Samplers didn't load in time, but continuing anyway");
            }

            this.isReady = true;
            this.isLoading = false;
            console.log("✓ Audio Engine Ready");
            return true;
        } catch (e) {
            console.error("✗ Failed to start audio context", e);
            this.isLoading = false;
            // Still mark as ready to allow fallback playback
            this.isReady = true;
            return true;
        }
    }

    private async waitForSamplersLoaded(): Promise<boolean> {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.warn("⚠ Sampler loading timeout - proceeding anyway");
                resolve(false);
            }, 5000); // 5 second timeout

            const checkLoaded = () => {
                if (this.piano.loaded && this.guitar.loaded) {
                    clearTimeout(timeout);
                    console.log("✓ All samplers loaded successfully");
                    resolve(true);
                } else {
                    setTimeout(checkLoaded, 100);
                }
            };
            checkLoaded();
        });
    }

    setDrumVolume(db: number) {
        this.kick.volume.value = db;
        this.snare.volume.value = db - 5;
        this.hihat.volume.value = db - 15;
    }

    playChord(chord: ChordType, instrument: 'piano' | 'guitar' = 'piano', duration: string = '1n', time?: number) {
        if (!this.isReady) {
            console.warn("Audio engine not ready yet!");
            return;
        }

        const playTime = time !== undefined ? time : Tone.now() + 0.05;
        const notes = chord.notes.map(n => {
            // Check if note already has octave (digit)
            return /\d/.test(n) ? n : n + '4';
        });

        if (instrument === 'piano') {
            this.piano.triggerAttackRelease(notes, duration, playTime);
        } else {
            notes.forEach((note, i) => {
                this.guitar.triggerAttackRelease(note, duration, playTime + i * 0.05);
            });
        }
    }

    previewChord(chord: ChordType) {
        this.playChord(chord, 'piano', '2n');
    }

    playDrumPattern(bpm: number, pattern: 'basic' | 'rock' | 'jazz' | 'funk' = 'basic', complexity: number = 50, time?: number) {
        if (!this.isReady) return;

        const beatTime = 60 / bpm;
        const t = time !== undefined ? time : Tone.now() + 0.05;
        const c = complexity / 100;

        switch (pattern) {
            case 'rock':
                this.kick.triggerAttackRelease('C1', '8n', t);
                this.kick.triggerAttackRelease('C1', '8n', t + beatTime * 2);
                if (c > 0.5) this.kick.triggerAttackRelease('C1', '16n', t + beatTime * 2.5);

                this.snare.triggerAttackRelease('8n', t + beatTime);
                this.snare.triggerAttackRelease('8n', t + beatTime * 3);
                if (c > 0.7) this.snare.triggerAttackRelease('16n', t + beatTime * 3.75, 0.2);

                for (let i = 0; i < 8; i++) {
                    if (i % 2 === 0 || c > 0.3) {
                        this.hihat.triggerAttackRelease('32n', t + beatTime * 0.5 * i, i % 2 === 0 ? 1 : 0.5);
                    }
                }
                break;

            case 'jazz':
                this.kick.triggerAttackRelease('C1', '8n', t, 0.5);
                this.hihat.triggerAttackRelease('32n', t);
                if (c > 0.3) this.hihat.triggerAttackRelease('32n', t + beatTime * 0.66);
                this.hihat.triggerAttackRelease('32n', t + beatTime);
                this.hihat.triggerAttackRelease('32n', t + beatTime * 2);
                if (c > 0.3) this.hihat.triggerAttackRelease('32n', t + beatTime * 2.66);
                this.hihat.triggerAttackRelease('32n', t + beatTime * 3);
                this.snare.triggerAttackRelease('8n', t + beatTime * 3.66, 0.3);
                if (c > 0.6) this.snare.triggerAttackRelease('8n', t + beatTime * 1.66, 0.2);
                break;

            case 'funk':
                this.kick.triggerAttackRelease('C1', '8n', t);
                this.kick.triggerAttackRelease('C1', '8n', t + beatTime * 2.5);
                if (c > 0.4) this.kick.triggerAttackRelease('C1', '16n', t + beatTime * 3.5);

                this.snare.triggerAttackRelease('8n', t + beatTime);
                this.snare.triggerAttackRelease('8n', t + beatTime * 3);

                for (let i = 0; i < 16; i++) {
                    if (i % 4 === 0 || (c > 0.5 && i % 2 === 0) || c > 0.8) {
                        if (i % 4 !== 2) {
                            this.hihat.triggerAttackRelease('32n', t + beatTime * 0.25 * i, Math.random() * 0.5 + 0.2);
                        }
                    }
                }
                break;

            case 'basic':
            default:
                this.kick.triggerAttackRelease('C1', '8n', t);
                this.kick.triggerAttackRelease('C1', '8n', t + beatTime * 2);
                this.snare.triggerAttackRelease('8n', t + beatTime);
                this.snare.triggerAttackRelease('8n', t + beatTime * 3);
                for (let i = 0; i < 4; i++) {
                    if (c > 0.2) this.hihat.triggerAttackRelease('32n', t + beatTime * i);
                }
                break;
        }
    }

    stopAll() {
        // Immediately stop transport and cancel all events
        Tone.Transport.stop();
        Tone.Transport.cancel(0);

        // Release all currently playing notes
        this.piano.releaseAll();
        this.guitar.releaseAll();

        console.log("✓ All audio stopped");
    }
}

export const audioEngine = new AudioEngine();
