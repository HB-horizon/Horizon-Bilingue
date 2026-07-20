import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '@/types/lesson';
import * as ProgressManager from '@/lib/progress-manager';

/**
 * Hook personnalisé pour gérer la progression utilisateur
 */
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Charger la progression - DOIT être défini avant useEffect
  const loadProgressData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProgressManager.loadProgress();
      setProgress(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger la progression au montage
  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  // Marquer un jour comme complété
  const completeDay = useCallback(async (dayNumber: number) => {
    try {
      const updatedProgress = await ProgressManager.completeDay(dayNumber);
      setProgress(updatedProgress);
      return updatedProgress;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  // Démarrer un jour
  const startDay = useCallback(async (dayNumber: number) => {
    try {
      await ProgressManager.startDay(dayNumber);
      await loadProgressData();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [loadProgressData]);

  // Vérifier si un jour est débloqué
  const isDayUnlocked = useCallback((dayNumber: number): boolean => {
    if (!progress) return dayNumber === 1;
    if (dayNumber === 1) return true;
    return progress.completedDays.includes(dayNumber - 1);
  }, [progress]);

  // Obtenir le pourcentage de progression
  const getProgressPercentage = useCallback((): number => {
    if (!progress) return 0;
    return Math.round((progress.completedDays.length / 29) * 100);
  }, [progress]);

  // Réinitialiser la progression
  const resetProgress = useCallback(async () => {
    try {
      await ProgressManager.resetProgress();
      await loadProgressData();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, [loadProgressData]);

  return {
    progress,
    loading,
    error,
    completeDay,
    startDay,
    isDayUnlocked,
    getProgressPercentage,
    resetProgress,
    reload: loadProgressData,
  };
}
