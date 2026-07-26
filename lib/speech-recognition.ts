import { Platform } from 'react-native';

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const ARABIC_LETTERS = /[\u0600-\u06FF]/;
const SUKOON = '\u0652';
const SHADDA = '\u0651';

const CONFIDENCE_THRESHOLD = 0.55;
const SIMILARITY_THRESHOLD = 0.7;

function stripDiacritics(text: string): string {
  return text.replace(ARABIC_DIACRITICS, '');
}

function normalizeArabic(text: string): string {
  return stripDiacritics(text)
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .normalize('NFC')
    .trim();
}

function similarityScore(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1.0;
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function hasArabicLetters(text: string): boolean {
  return ARABIC_LETTERS.test(text);
}

export function isSpeechSupported(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function isLikelyMatch(spoken: string, expected: string): boolean {
  const a = normalizeArabic(spoken);
  const b = normalizeArabic(expected);
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  return similarityScore(a, b) >= SIMILARITY_THRESHOLD;
}

export function getPronunciationScore(spoken: string, expected: string): number {
  const a = normalizeArabic(spoken);
  const b = normalizeArabic(expected);
  if (a === b) return 100;
  const score = similarityScore(a, b);
  return Math.round(score * 100);
}

export type SpeechListenResult = {
  transcript: string;
  confidence: number;
  isCorrect: boolean;
  score: number;
};

export type SpeechListenOptions = {
  timeout?: number;
  lang?: string;
  onInterimResult?: (transcript: string) => void;
};

const RECOGNITION_TIMEOUT = 8000;

export function speechListen(
  expected: string,
  options?: SpeechListenOptions,
): Promise<SpeechListenResult> {
  const lang = options?.lang ?? 'ar-SA';
  const timeout = options?.timeout ?? RECOGNITION_TIMEOUT;
  const onInterim = options?.onInterimResult;

  return new Promise((resolve, reject) => {
    if (!isSpeechSupported()) {
      reject(new Error('Reconnaissance vocale non supportée sur ce navigateur'));
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      reject(new Error('API de reconnaissance vocale non disponible'));
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = !!onInterim;
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
        for (let j = 0; j < result.length; j++) {
          const alt = result[j];
          if (alt.confidence > bestConfidence) {
            bestConfidence = alt.confidence;
            bestTranscript = alt.transcript.trim();
          }
        }

        if (onInterim && !result.isFinal && result[0]?.transcript) {
          onInterim(result[0].transcript.trim());
        }
      }

      if (bestTranscript && event.results[event.results.length - 1].isFinal) {
        finished = true;
        clearTimeout(timer);
        recognition.stop();

        const score = getPronunciationScore(bestTranscript, expected);
        const isCorrect = bestConfidence >= CONFIDENCE_THRESHOLD && isLikelyMatch(bestTranscript, expected);

        resolve({
          transcript: bestTranscript,
          confidence: bestConfidence,
          isCorrect,
          score,
        });
      }
    };

    recognition.onerror = (event: any) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      recognition.stop();

      const errorMessages: Record<string, string> = {
        'no-speech': "Aucune parole détectée. Parle plus fort ou rapproche-toi du micro !",
        'aborted': 'Reconnaissance annulée.',
        'audio-capture': 'Erreur de capture audio. Vérifie ton microphone.',
        'network': 'Erreur réseau. Vérifie ta connexion internet.',
        'not-allowed': 'Accès au microphone refusé. Autorise l\'accès dans les paramètres du navigateur.',
        'service-not-allowed': 'Service de reconnaissance non autorisé.',
        'bad-grammar': 'Erreur de grammaire.',
        'language-not-supported': 'Langue non supportée.',
      };

      const msg = errorMessages[event.error] ?? `Erreur de reconnaissance : ${event.error}`;
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
      reject(new Error('Impossible de démarrer le microphone. Vérifie les permissions.'));
    }
  });
}