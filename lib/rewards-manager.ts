import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Badge,
  BadgeTier,
  GameScore,
  UserRewards,
  PREDEFINED_BADGES,
  getScoreTier,
  getPointsForTier,
} from '@/types/rewards';

const REWARDS_KEY = 'horizon_rewards';

/**
 * RewardsManager - Gestionnaire centralisé pour les récompenses et badges
 */
class RewardsManager {
  /**
   * Charger les récompenses de l'utilisateur
   */
  async loadRewards(): Promise<UserRewards> {
    try {
      const data = await AsyncStorage.getItem(REWARDS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return this.getDefaultRewards();
    } catch (error) {
      console.error('[RewardsManager] Error loading rewards:', error);
      return this.getDefaultRewards();
    }
  }

  /**
   * Sauvegarder les récompenses de l'utilisateur
   */
  async saveRewards(rewards: UserRewards): Promise<void> {
    try {
      await AsyncStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
      console.log('[RewardsManager] Rewards saved');
    } catch (error) {
      console.error('[RewardsManager] Error saving rewards:', error);
    }
  }

  /**
   * Obtenir les récompenses par défaut
   */
  private getDefaultRewards(): UserRewards {
    return {
      totalPoints: 0,
      badges: [],
      gameScores: [],
      streakDays: 0,
      bestGameScore: null,
      totalGamesPlayed: 0,
    };
  }

  /**
   * Enregistrer un score de jeu
   */
  async recordGameScore(
    gameType: 'memory' | 'quiz',
    score: number,
    maxScore: number
  ): Promise<{ newBadges: Badge[]; pointsEarned: number }> {
    const rewards = await this.loadRewards();
    const tier = getScoreTier(score, maxScore);
    const points = getPointsForTier(tier);

    // Créer le score
    const gameScore: GameScore = {
      gameType,
      score,
      maxScore,
      date: Date.now(),
      tier,
    };

    // Ajouter le score
    rewards.gameScores.push(gameScore);
    rewards.totalGamesPlayed += 1;
    rewards.totalPoints += points;

    // Mettre à jour le meilleur score
    if (
      !rewards.bestGameScore ||
      score / maxScore > rewards.bestGameScore.score / rewards.bestGameScore.maxScore
    ) {
      rewards.bestGameScore = gameScore;
    }

    // Vérifier les badges débloqués
    const newBadges = await this.checkAndUnlockBadges(rewards);

    // Sauvegarder
    await this.saveRewards(rewards);

    return { newBadges, pointsEarned: points };
  }

  /**
   * Vérifier et débloquer les badges
   */
  private async checkAndUnlockBadges(rewards: UserRewards): Promise<Badge[]> {
    const newBadges: Badge[] = [];
    const unlockedBadgeIds = new Set(rewards.badges.map(b => b.id));

    // Vérifier chaque badge prédéfini
    Object.values(PREDEFINED_BADGES).forEach(badgeTemplate => {
      if (unlockedBadgeIds.has(badgeTemplate.id)) {
        return; // Déjà débloqué
      }

      let shouldUnlock = false;

      switch (badgeTemplate.requirement.type) {
        case 'game_score':
          if (rewards.gameScores.length > 0) {
            const maxScore = Math.max(
              ...rewards.gameScores.map(gs => (gs.score / gs.maxScore) * 100)
            );
            shouldUnlock = maxScore >= badgeTemplate.requirement.value;
          }
          break;

        case 'daily_streak':
          shouldUnlock = rewards.streakDays >= badgeTemplate.requirement.value;
          break;

        case 'games_played':
          shouldUnlock = rewards.totalGamesPlayed >= badgeTemplate.requirement.value;
          break;

        case 'lesson_completion':
          shouldUnlock = rewards.totalPoints >= badgeTemplate.requirement.value;
          break;

        case 'milestone':
          shouldUnlock = rewards.totalPoints >= badgeTemplate.requirement.value;
          break;
      }

      if (shouldUnlock) {
        const badge: Badge = {
          ...badgeTemplate,
          unlockedAt: Date.now(),
        };
        rewards.badges.push(badge);
        newBadges.push(badge);
      }
    });

    return newBadges;
  }

  /**
   * Obtenir les statistiques des récompenses
   */
  async getRewardsStats(): Promise<{
    totalPoints: number;
    badgesCount: number;
    bestGameScore: number;
    totalGamesPlayed: number;
  }> {
    const rewards = await this.loadRewards();
    return {
      totalPoints: rewards.totalPoints,
      badgesCount: rewards.badges.length,
      bestGameScore: rewards.bestGameScore
        ? (rewards.bestGameScore.score / rewards.bestGameScore.maxScore) * 100
        : 0,
      totalGamesPlayed: rewards.totalGamesPlayed,
    };
  }

  /**
   * Réinitialiser les récompenses (pour le développement)
   */
  async resetRewards(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REWARDS_KEY);
      console.log('[RewardsManager] Rewards reset');
    } catch (error) {
      console.error('[RewardsManager] Error resetting rewards:', error);
    }
  }
}

// Instance singleton
export const rewardsManager = new RewardsManager();

/**
 * Hook React pour utiliser le gestionnaire de récompenses
 */
export function useRewardsManager() {
  return rewardsManager;
}
