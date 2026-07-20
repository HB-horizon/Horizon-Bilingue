/**
 * Types pour l'apprentissage du vocabulaire coranique
 */

export type VocabularyCategory =
  | 'noms-divins'
  | 'prepositions'
  | 'pronoms'
  | 'verbes-fondamentaux'
  | 'noms-courants'
  | 'adjectifs'
  | 'conjonctions'
  | 'adverbes'
  | 'expressions';

export type VocabularyWord = {
  id: number;
  arabic: string;
  transliteration: string;
  french: string;
  category: VocabularyCategory;
  frequency: number; // rang de fréquence (1 = plus fréquent)
  root?: string; // racine arabe optionnelle
  example?: string; // exemple d'utilisation en arabe
  exampleTranslation?: string; // traduction de l'exemple
  notes?: string; // notes supplémentaires
};

export type VocabularyCategoryInfo = {
  id: VocabularyCategory;
  name: string;
  emoji: string;
  description: string;
  color: string;
};

export type VocabularyProgress = {
  learnedWords: number[]; // IDs des mots appris
  currentCategory: VocabularyCategory | null;
  totalWords: number;
  streakDays: number;
  lastPracticeDate: string | null;
};

export type VocabularyQuizQuestion = {
  word: VocabularyWord;
  options: string[]; // 4 options de réponse
  correctIndex: number;
  type: 'arabic-to-french' | 'french-to-arabic' | 'transliteration-to-french';
};

export type QuizResult = {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  wordsLearned: number[];
};
