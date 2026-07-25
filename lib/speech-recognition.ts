import { Platform } from 'react-native';

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;

function stripDiacritics(text: string): string {
  return text.replace(ARABIC_DIACRITICS, '');
}

function normalizeForMatch(text: string): string {
  return stripDiacritics(text).normalize('NFC').trim();
}

export function isSpeechSupported(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function isLikelyMatch(spoken: string, expected: string): boolean {
  const a = normalizeForMatch(spoken);
  const b = normalizeForMatch(expected);
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  return false;
}

export type SpeechListenResult = {
  transcript: string;
  confidence: number;
  isCorrect: boolean;
};

export type SpeechListenOptions = {
  timeout?: number;
  lang?: string;
};

const RECOGNITION_TIMEOUT = 6000;

export function speechListen(
  expected: string,
  options?: SpeechListenOptions,
): Promise<SpeechListenResult> {
  const lang = options?.lang ?? 'ar';
  const timeout = options?.timeout ?? RECOGNITION_TIMEOUT;

  return new Promise((resolve, reject) => {
    if (!isSpeechSupported()) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      reject(new Error('SpeechRecognition not available'));
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    let finished = false;

    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        recognition.stop();
        reject(new Error('Délai dépassé. Essaie encore !'));
      }
    }, timeout);

    recognition.onresult = (event: any) => {
      if (finished) return;

      let bestTranscript = '';
      let bestConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result.isFinal) continue;
        for (let j = 0; j < result.length; j++) {
          const alt = result[j];
          if (alt.confidence > bestConfidence) {
            bestConfidence = alt.confidence;
            bestTranscript = alt.transcript.trim();
          }
        }
      }

      if (bestTranscript) {
        finished = true;
        clearTimeout(timer);
        recognition.stop();
        resolve({
          transcript: bestTranscript,
          confidence: bestConfidence,
          isCorrect: isLikelyMatch(bestTranscript, expected),
        });
      }
    };

    recognition.onerror = (event: any) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      recognition.stop();
      const msg = event.error === 'no-speech'
        ? "Je n'ai rien entendu. Parle dans le micro !"
        : event.error === 'aborted'
          ? 'Reconnaissance annulée.'
          : `Erreur : ${event.error}`;
      reject(new Error(msg));
    };

    recognition.onend = () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        reject(new Error("Je n'ai pas pu reconnaître le son. Essaie encore !"));
      }
    };

    try {
      recognition.start();
    } catch (e) {
      finished = true;
      clearTimeout(timer);
      reject(new Error('Impossible de démarrer le microphone.'));
    }
  });
}
