import type { Section, Settings } from '../store/songStore';

export const downloadSongAsJSON = (sections: Section[], settings: Settings) => {
    const songData = {
        version: '2.1',
        timestamp: new Date().toISOString(),
        settings,
        sections
    };

    const blob = new Blob([JSON.stringify(songData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `song-structure-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
