import { DayLesson } from '../types/lesson';
import { firstFourDaysLessons } from './lessons-days-1-4';
import { days5to29Lessons } from './lessons-days-5-29';

/**
 * Toutes les leçons de l'application (jours 1 à 29)
 */
export const allLessons: DayLesson[] = [
  ...firstFourDaysLessons,
  ...days5to29Lessons,
];

/**
 * Obtenir une leçon par numéro de jour
 */
export function getLessonByDay(dayNumber: number): DayLesson | undefined {
  return allLessons.find(lesson => lesson.dayNumber === dayNumber);
}

/**
 * Obtenir les leçons complétées
 */
export function getCompletedLessons(completedDays: number[]): DayLesson[] {
  return allLessons.filter(lesson => completedDays.includes(lesson.dayNumber));
}

/**
 * Obtenir la prochaine leçon à faire
 */
export function getNextLesson(completedDays: number[]): DayLesson | undefined {
  return allLessons.find(lesson => !completedDays.includes(lesson.dayNumber));
}

/**
 * Vérifier si un jour est débloqué
 */
export function isDayUnlocked(dayNumber: number, completedDays: number[]): boolean {
  if (dayNumber === 1) return true;
  return completedDays.includes(dayNumber - 1);
}

/**
 * Calculer le pourcentage de progression
 */
export function calculateProgress(completedDays: number[]): number {
  return Math.round((completedDays.length / allLessons.length) * 100);
}

/**
 * Récupérer toutes les lettres des jours complétés
 */
export function getAllCompletedLetters(completedDays: number[]): Array<{ letter: string; latinName: string }> {
  return allLessons
    .filter(lesson => completedDays.includes(lesson.dayNumber))
    .map(lesson => ({
      letter: lesson.letter,
      latinName: lesson.latinName,
    }));
}
