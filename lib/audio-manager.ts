import { Platform } from 'react-native';
import audioMapping from './audio-mapping.json';

const HARAKAT_MARKS: Record<string, string> = {
  fatha: '\u064E',
  damma: '\u064F',
  kasra: '\u0650',
};

const SUKOON = '\u0652';

export type AudioResult = {
  success: boolean;
  method: 'local' | 'tts' | 'none';
  error?: string;
};

const LRU_MAX_SIZE = 50;

class LRUCache<V> {
  private map = new Map<string, V>();

  get(key: string): V | undefined {
    const value = this.map.get(key);
    if (value !== undefined) {
      this.map.delete(key);
      this.map.set(key, value);
    }
    return value;
  }

  set(key: string, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= LRU_MAX_SIZE) {
      const firstKey = this.map.keys().next().value!;
      this.map.delete(firstKey);
    }
    this.map.set(key, value);
  }

  delete(key: string): void {
    this.map.delete(key);
  }

  has(key: string): boolean {
    return this.map.has(key);
  }
}

let expoAudioModule: any = null;
let currentSound: any = null;

async function getExpoAudio() {
  if (!expoAudioModule) {
    expoAudioModule = await import('expo-av');
  }
  return expoAudioModule;
}

let speechModule: any = null;

async function getSpeechModule() {
  if (!speechModule) {
    speechModule = await import('expo-speech');
  }
  return speechModule;
}

interface QueueItem {
  task: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

const audioQueue: QueueItem[] = [];
let isProcessingQueue = false;

async function enqueueAudio<T>(task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    audioQueue.push({ task, resolve, reject });
    processQueue();
  });
}

async function processQueue(): Promise<void> {
  if (isProcessingQueue || audioQueue.length === 0) return;
  isProcessingQueue = true;

  while (audioQueue.length > 0) {
    const item = audioQueue.shift()!;
    try {
      const result = await item.task();
      item.resolve(result);
    } catch (e) {
      item.reject(e);
    }
  }

  isProcessingQueue = false;
}

function getWebBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

function getLocalAudioUrl(text: string): string | null {
  const filename = (audioMapping as Record<string, string>)[text];
  if (!filename) return null;
  if (Platform.OS === 'web') {
    return `${getWebBaseUrl()}/audio/${filename}`;
  }
  return `https://raw.githubusercontent.com/horizon-bilingue/audio/main/${filename}`;
}

const webAudioCache = new LRUCache<HTMLAudioElement>();

async function playLocalAudioWeb(text: string): Promise<void> {
  const url = getLocalAudioUrl(text);
  if (!url) throw new Error(`No local audio for: ${text}`);

  let audio = webAudioCache.get(text);

  if (audio) {
    audio.currentTime = 0;
    return new Promise<void>((resolve, reject) => {
      let settled = false;
      audio!.onended = () => { if (!settled) { settled = true; resolve(); } };
      audio!.onerror = () => {
        if (!settled) {
          settled = true;
          webAudioCache.delete(text);
          reject(new Error('Audio playback failed'));
        }
      };
      audio!.play().catch((e) => { if (!settled) { settled = true; reject(e); } });
    });
  }

  audio = new Audio(url);
  webAudioCache.set(text, audio);

  return new Promise<void>((resolve, reject) => {
    let settled = false;
    audio!.onended = () => { if (!settled) { settled = true; resolve(); } };
    audio!.onerror = () => {
      if (!settled) {
        settled = true;
        webAudioCache.delete(text);
        reject(new Error('Local audio playback failed'));
      }
    };
    audio!.play().catch((e) => { if (!settled) { settled = true; reject(e); } });
  });
}

async function playLocalAudioNative(text: string): Promise<void> {
  const url = getLocalAudioUrl(text);
  if (!url) throw new Error(`No local audio for: ${text}`);

  const { Audio } = await getExpoAudio();

  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch {}
    currentSound = null;
  }

  const { sound } = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true }
  );
  currentSound = sound;

  return new Promise<void>((resolve, reject) => {
    sound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        if (currentSound === sound) currentSound = null;
        resolve();
      }
      if (status.error) {
        sound.unloadAsync().catch(() => {});
        if (currentSound === sound) currentSound = null;
        reject(new Error(`Playback error: ${status.error}`));
      }
    });
  });
}

async function playLocalAudio(text: string): Promise<void> {
  if (Platform.OS === 'web') {
    return playLocalAudioWeb(text);
  }
  return playLocalAudioNative(text);
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
  async playLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra'): Promise<AudioResult> {
    const text = `${letter}${HARAKAT_MARKS[harakat]}`;
    return enqueueAudio(async () => {
      try {
        await playLocalAudio(text);
        return { success: true, method: 'local' as const };
      } catch {
        try {
          await speakTTS(text);
          return { success: true, method: 'tts' as const };
        } catch (e) {
          return { success: false, method: 'none' as const, error: String(e) };
        }
      }
    });
  }

  async playDecomposedLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra'): Promise<AudioResult> {
    const isolated = `${letter}${SUKOON}`;
    return enqueueAudio(async () => {
      try {
        const localUrl = getLocalAudioUrl(isolated);
        if (localUrl) {
          await playLocalAudio(isolated);
          await new Promise((r) => setTimeout(r, 200));
        } else {
          await speakTTS(`${isolated}`);
          await new Promise((r) => setTimeout(r, 200));
        }
      } catch {
        try {
          await speakTTS(letter);
          await new Promise((r) => setTimeout(r, 200));
        } catch {}
      }

      const text = `${letter}${HARAKAT_MARKS[harakat]}`;
      try {
        await playLocalAudio(text);
        return { success: true, method: 'local' as const };
      } catch {
        try {
          await speakTTS(text);
          return { success: true, method: 'tts' as const };
        } catch (e) {
          return { success: false, method: 'none' as const, error: String(e) };
        }
      }
    });
  }

  async playWordSound(word: string): Promise<AudioResult> {
    return enqueueAudio(async () => {
      try {
        const localUrl = getLocalAudioUrl(word);
        if (localUrl) {
          await playLocalAudio(word);
          return { success: true, method: 'local' as const };
        }
      } catch {}
      try {
        await speakTTS(word);
        return { success: true, method: 'tts' as const };
      } catch (e) {
        return { success: false, method: 'none' as const, error: String(e) };
      }
    });
  }

  async playFeedbackSound(type: 'success' | 'error' | 'celebration' | 'click'): Promise<void> {
    const soundMap: Record<string, string> = {
      success: 'أحسنت',
      error: 'حاول مرة أخرى',
      celebration: 'مبروك',
      click: '',
    };
    const text = soundMap[type];
    if (text) {
      try {
        await speakTTS(text);
      } catch {}
    }
  }

  stopAll(): void {
    if (currentSound) {
      currentSound.stopAsync().catch(() => {});
      currentSound.unloadAsync().catch(() => {});
      currentSound = null;
    }
  }
}

export const audioManager = new AudioManager();

export function useAudioManager() {
  return audioManager;
}

export async function playLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra'): Promise<AudioResult> {
  return audioManager.playLetterSound(letter, harakat);
}

export async function playDecomposedLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra'): Promise<AudioResult> {
  return audioManager.playDecomposedLetterSound(letter, harakat);
}

export async function playWordSound(word: string): Promise<AudioResult> {
  return audioManager.playWordSound(word);
}
