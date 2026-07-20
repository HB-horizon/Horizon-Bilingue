/**
 * Types pour les leçons d'apprentissage de l'arabe
 */

export type ReadingRule = {
  name: string; // 'Alif', 'Hamza', 'Prolongation'
  description: string;
  example: string; // exemple en arabe
  explanation: string; // explication
  audioUrl?: string; // URL du son
};

export type HarakatExample = {
  arabic: string;
  trans: string;
  audioUrl?: string; // URL du son pour cette harakat
};

export type LetterForms = {
  isolated: string;
  beginning: string;
  middle: string;
  end: string;
};

export type ElongationExercise = {
  arabic: string;
  trans: string;
  type: 'Fat7a' | 'Damma' | 'Kasra' | 'Combiné';
};

export type ExerciseWord = {
  arabic: string;
  latin: string;
  image: string | null;
};

export type DayLesson = {
  dayNumber: number;
  letter: string;
  latinName: string;
  exampleWord: string;
  exampleLatin: string;
  exampleImage: string;
  forms: LetterForms;
  harakatExamples: HarakatExample[];
  hasElongation?: boolean;
  elongationExercises?: ElongationExercise[];
  exerciseWords: ExerciseWord[];
  // Champs spéciaux pour les 4 premiers jours
  storyTitle?: string;
  storyContent?: string;
  storyCharacter?: string;
  mnemonicTip?: string;
  isSpecialDay?: boolean; // Pour les jalons (jours 10, 15, 20, 25, 29)
  // Règles de lecture
  readingRules?: ReadingRule[];
}

export type FatihaVerse = {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
};

export type Day30Data = {
  dayNumber: 30;
  title: string;
  verses: FatihaVerse[];
  explanation: string;
};

export type UserProgress = {
  currentDay: number;
  completedDays: number[];
  badges: { [day: number]: boolean };
  lastVisit: Date;
  totalTime: number; // en secondes
  dayStartTimes: { [day: number]: number }; // timestamps
};

export type LessonStep = 
  | 'story'
  | 'letter-presentation'
  | 'sounds'
  | 'reading-rules'
  | 'forms'
  | 'elongation'
  | 'exercises'
  | 'game'
  | 'celebration';

export type GameType =
  | 'letter-recognition'
  | 'sound-matching'
  | 'memory-pairs'
  | 'short-long-sound'
  | 'syllable-builder';

export type BadgeType = 
  | 'regular'
  | 'special-milestone'
  | 'champion-4-days'
  | 'final-achievement';
