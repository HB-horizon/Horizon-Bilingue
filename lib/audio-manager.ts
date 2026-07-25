import audioMapping from './audio-mapping.json';

const HARAKAT_MARKS: Record<string, string> = {
  fatha: '\u064E',
  damma: '\u064F',
  kasra: '\u0650',
};

const SUKOON = '\u0652';

const audioCache = new Map<string, HTMLAudioElement>();
let speechModule: any = null;

function getWebBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

async function getSpeechModule() {
  if (!speechModule) {
    speechModule = await import('expo-speech');
  }
  return speechModule;
}

function getLocalAudioUrl(text: string): string | null {
  const filename = (audioMapping as Record<string, string>)[text];
  if (!filename) return null;
  return `${getWebBaseUrl()}/audio/${filename}`;
}

async function playLocalAudio(text: string): Promise<void> {
  const url = getLocalAudioUrl(text);
  if (!url) throw new Error(`No local audio for: ${text}`);

  if (audioCache.has(text)) {
    const cached = audioCache.get(text)!;
    cached.currentTime = 0;
    return new Promise<void>((resolve, reject) => {
      let settled = false;
      cached.onended = () => { if (!settled) { settled = true; resolve(); } };
      cached.onerror = () => { if (!settled) { settled = true; audioCache.delete(text); reject(new Error('Audio playback failed')); } };
      cached.play().catch((e) => { if (!settled) { settled = true; reject(e); } });
    });
  }

  const audio = new Audio(url);
  audioCache.set(text, audio);

  return new Promise<void>((resolve, reject) => {
    let settled = false;
    audio.onended = () => { if (!settled) { settled = true; resolve(); } };
    audio.onerror = () => { if (!settled) { settled = true; audioCache.delete(text); reject(new Error('Local audio playback failed')); } };
    audio.play().catch((e) => { if (!settled) { settled = true; reject(e); } });
  });
}

async function speakTTS(text: string): Promise<void> {
  const Speech = await getSpeechModule();
  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      language: 'ar',
      pitch: 1.0,
      rate: 0.75,
      onDone: () => resolve(),
      onError: (e: any) => reject(e),
    });
  });
}

class AudioManager {
  async playLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra'): Promise<void> {
    const text = `${letter}${HARAKAT_MARKS[harakat]}`;
    try {
      await speakTTS(text);
    } catch (e) {
      console.warn('[AudioManager] TTS failed, trying local audio:', e);
      try {
        await playLocalAudio(text);
      } catch (e2) {
        console.warn('[AudioManager] Local audio also failed:', e2);
      }
    }
  }

  async playDecomposedLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra'): Promise<void> {
    const isolated = `${letter}${SUKOON}`;
    const localUrl = getLocalAudioUrl(isolated);

    if (localUrl) {
      try {
        await playLocalAudio(isolated);
        await new Promise((r) => setTimeout(r, 200));
      } catch {
        await this.speakDecomposedFallback(letter);
      }
    } else {
      await this.speakDecomposedFallback(letter);
    }

    await this.playLetterSound(letter, harakat);
  }

  private async speakDecomposedFallback(letter: string): Promise<void> {
    try {
      await speakTTS(`${letter}${SUKOON}`);
      await new Promise((r) => setTimeout(r, 200));
    } catch {
      try {
        await speakTTS(letter);
        await new Promise((r) => setTimeout(r, 200));
      } catch (e) {
        console.warn('[AudioManager] Decomposed speech fallback also failed:', e);
      }
    }
  }

  async playWordSound(word: string): Promise<void> {
    const localUrl = getLocalAudioUrl(word);
    if (localUrl) {
      try {
        await playLocalAudio(word);
        return;
      } catch (e) {
        console.warn('[AudioManager] Local audio failed for word:', e);
      }
    }
    try {
      await speakTTS(word);
    } catch (e) {
      console.warn('[AudioManager] Word TTS also failed:', e);
    }
  }
}

export const audioManager = new AudioManager();

export function useAudioManager() {
  return audioManager;
}

export async function playLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra') {
  await audioManager.playLetterSound(letter, harakat);
}

export async function playDecomposedLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra') {
  await audioManager.playDecomposedLetterSound(letter, harakat);
}

export async function playWordSound(word: string) {
  await audioManager.playWordSound(word);
}
