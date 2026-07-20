import { Platform } from 'react-native';
import audioMapping from './audio-mapping.json';

const HARAKAT_MARKS: Record<string, string> = {
  fatha: '\u064E',
  damma: '\u064F',
  kasra: '\u0650',
};

const audioCache = new Map<string, HTMLAudioElement>();

function getLocalAudioUrl(text: string): string | null {
  const filename = (audioMapping as Record<string, string>)[text];
  if (!filename) return null;
  return `/audio/${filename}`;
}

async function playLocalAudio(text: string): Promise<void> {
  const url = getLocalAudioUrl(text);
  if (!url) throw new Error(`No local audio for: ${text}`);

  if (audioCache.has(text)) {
    const cached = audioCache.get(text)!;
    cached.currentTime = 0;
    return new Promise<void>((resolve, reject) => {
      cached.onended = () => resolve();
      cached.onerror = () => {
        audioCache.delete(text);
        reject(new Error('Audio playback failed'));
      };
      cached.play().catch(reject);
    });
  }

  console.log('[AudioManager] Playing local audio:', url);
  const audio = new Audio(url);
  audioCache.set(text, audio);

  return new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = (e) => {
      console.warn('[AudioManager] Local audio error:', e);
      audioCache.delete(text);
      reject(new Error('Local audio playback failed'));
    };
    audio.play().catch(reject);
  });
}

async function speakNative(text: string): Promise<void> {
  const Speech = await import('expo-speech');
  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      language: 'ar',
      pitch: 1.0,
      rate: 0.75,
      onDone: () => resolve(),
      onError: (e) => reject(e),
    });
  });
}

class AudioManager {
  async playLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra'): Promise<void> {
    const text = `${letter}${HARAKAT_MARKS[harakat]}`;
    try {
      if (Platform.OS === 'web') {
        await playLocalAudio(text);
      } else {
        await speakNative(text);
      }
    } catch (e) {
      console.warn('[AudioManager] Primary speech failed:', e);
      try {
        const { playLetterSound: synth } = await import('./audio-synthesizer');
        await synth(letter, harakat);
      } catch (e2) {
        console.warn('[AudioManager] All speech methods failed:', e2);
      }
    }
  }

  async playWordSound(word: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await playLocalAudio(word);
      } else {
        await speakNative(word);
      }
    } catch (e) {
      console.warn('[AudioManager] Word speech failed:', e);
    }
  }

  async playFeedbackSound(type: 'success' | 'error' | 'click' | 'celebration'): Promise<void> {
    if (Platform.OS !== 'web') return;
    const { audioSynthesizer } = await import('./audio-synthesizer');
    switch (type) {
      case 'success': case 'celebration':
        await audioSynthesizer.playSuccessSound();
        break;
      case 'error':
        await audioSynthesizer.playErrorSound();
        break;
      case 'click':
        await audioSynthesizer.playClickSound();
        break;
    }
  }

  async playCelebrationSound(): Promise<void> {
    await this.playFeedbackSound('celebration');
  }
}

export const audioManager = new AudioManager();

export function useAudioManager() {
  return audioManager;
}

export async function playLetterSound(letter: string, harakat: 'fatha' | 'damma' | 'kasra') {
  await audioManager.playLetterSound(letter, harakat);
}

export async function playWordSound(word: string) {
  await audioManager.playWordSound(word);
}

export async function playCelebrationSound() {
  await audioManager.playCelebrationSound();
}
