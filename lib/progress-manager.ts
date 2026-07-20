import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress } from '../types/lesson';

const PROGRESS_KEY = '@horizon_bilingue_progress';

/**
 * Gestionnaire de progression utilisateur
 */

export const defaultProgress: UserProgress = {
  currentDay: 1,
  completedDays: [],
  badges: {},
  lastVisit: new Date(),
  totalTime: 0,
  dayStartTimes: {},
};

/**
 * Charger la progression depuis AsyncStorage
 */
export async function loadProgress(): Promise<UserProgress> {
  try {
    const json = await AsyncStorage.getItem(PROGRESS_KEY);
    if (json) {
      const data = JSON.parse(json);
      // Convertir la date string en Date object
      data.lastVisit = new Date(data.lastVisit);
      return data;
    }
    return defaultProgress;
  } catch (error) {
    console.error('Erreur lors du chargement de la progression:', error);
    return defaultProgress;
  }
}

/**
 * Sauvegarder la progression dans AsyncStorage
 */
export async function saveProgress(progress: UserProgress): Promise<void> {
  try {
    const json = JSON.stringify(progress);
    await AsyncStorage.setItem(PROGRESS_KEY, json);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la progression:', error);
  }
}

/**
 * Marquer un jour comme complété
 */
export async function completeDay(dayNumber: number): Promise<UserProgress> {
  const progress = await loadProgress();
  
  if (!progress.completedDays.includes(dayNumber)) {
    progress.completedDays.push(dayNumber);
    progress.completedDays.sort((a, b) => a - b);
  }
  
  progress.badges[dayNumber] = true;
  progress.currentDay = dayNumber + 1;
  progress.lastVisit = new Date();
  
  // Calculer le temps passé sur ce jour
  if (progress.dayStartTimes[dayNumber]) {
    const timeSpent = Date.now() - progress.dayStartTimes[dayNumber];
    progress.totalTime += Math.floor(timeSpent / 1000); // en secondes
    delete progress.dayStartTimes[dayNumber];
  }
  
  await saveProgress(progress);
  return progress;
}

/**
 * Démarrer un jour (enregistrer le timestamp)
 */
export async function startDay(dayNumber: number): Promise<void> {
  const progress = await loadProgress();
  progress.dayStartTimes[dayNumber] = Date.now();
  progress.lastVisit = new Date();
  await saveProgress(progress);
}

/**
 * Obtenir le prochain jour à faire
 */
export async function getNextDay(): Promise<number> {
  const progress = await loadProgress();
  return progress.currentDay;
}

/**
 * Vérifier si un jour est débloqué
 */
export async function isDayUnlocked(dayNumber: number): Promise<boolean> {
  if (dayNumber === 1) return true;
  const progress = await loadProgress();
  return progress.completedDays.includes(dayNumber - 1);
}

/**
 * Obtenir le pourcentage de progression
 */
export async function getProgressPercentage(): Promise<number> {
  const progress = await loadProgress();
  return Math.round((progress.completedDays.length / 29) * 100);
}

/**
 * Réinitialiser la progression (pour tests ou nouveau départ)
 */
export async function resetProgress(): Promise<void> {
  await AsyncStorage.removeItem(PROGRESS_KEY);
}

/**
 * Exporter la progression en JSON
 */
export async function exportProgress(): Promise<string> {
  const progress = await loadProgress();
  return JSON.stringify(progress, null, 2);
}

/**
 * Importer la progression depuis JSON
 */
export async function importProgress(json: string): Promise<void> {
  try {
    const data = JSON.parse(json);
    data.lastVisit = new Date(data.lastVisit);
    await saveProgress(data);
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    throw new Error('Format JSON invalide');
  }
}
