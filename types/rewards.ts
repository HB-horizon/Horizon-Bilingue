/**
 * Types pour le système de récompenses
 */

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type RewardType = 'game_score' | 'lesson_completion' | 'daily_streak' | 'milestone' | 'games_played';

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: BadgeTier;
  icon: string;
  unlockedAt?: number; // timestamp
  requirement: {
    type: RewardType;
    value: number; // score minimum, jours complétés, etc.
  };
}

export interface GameScore {
  gameType: 'memory' | 'quiz';
  score: number;
  maxScore: number;
  date: number; // timestamp
  tier: BadgeTier; // Déterminé par le score
}

export interface UserRewards {
  totalPoints: number;
  badges: Badge[];
  gameScores: GameScore[];
  streakDays: number;
  bestGameScore: GameScore | null;
  totalGamesPlayed: number;
}

/**
 * Fonction pour déterminer le tier d'un badge basé sur le score
 */
export function getScoreTier(score: number, maxScore: number): BadgeTier {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return 'platinum';
  if (percentage >= 80) return 'gold';
  if (percentage >= 60) return 'silver';
  return 'bronze';
}

/**
 * Fonction pour calculer les points basés sur le tier
 */
export function getPointsForTier(tier: BadgeTier): number {
  const points: Record<BadgeTier, number> = {
    bronze: 10,
    silver: 25,
    gold: 50,
    platinum: 100,
  };
  return points[tier];
}

/**
 * Badges prédéfinis
 */
export const PREDEFINED_BADGES: Record<string, Omit<Badge, 'unlockedAt'>> = {
  first_game: {
    id: 'first_game',
    name: '🎮 Premier Jeu',
    description: 'Joue à ton premier mini-jeu',
    tier: 'bronze',
    icon: '🎮',
    requirement: { type: 'game_score', value: 1 },
  },
  memory_master: {
    id: 'memory_master',
    name: '🧠 Maître Memory',
    description: 'Obtiens un score parfait au jeu Memory',
    tier: 'platinum',
    icon: '🧠',
    requirement: { type: 'game_score', value: 100 },
  },
  quiz_champion: {
    id: 'quiz_champion',
    name: '🏆 Champion Quiz',
    description: 'Obtiens 90% au jeu Quiz',
    tier: 'gold',
    icon: '🏆',
    requirement: { type: 'game_score', value: 90 },
  },
  week_warrior: {
    id: 'week_warrior',
    name: '⚔️ Guerrier de la Semaine',
    description: 'Complète 7 jours consécutifs',
    tier: 'silver',
    icon: '⚔️',
    requirement: { type: 'daily_streak', value: 7 },
  },
  alphabet_master: {
    id: 'alphabet_master',
    name: '📚 Maître de l\'Alphabet',
    description: 'Complète les 29 lettres',
    tier: 'platinum',
    icon: '📚',
    requirement: { type: 'lesson_completion', value: 29 },
  },
  fatiha_reader: {
    id: 'fatiha_reader',
    name: '📖 Lecteur de la Fatiha',
    description: 'Lis la Sourate Al-Fatiha complète',
    tier: 'platinum',
    icon: '📖',
    requirement: { type: 'milestone', value: 30 },
  },
  game_collector: {
    id: 'game_collector',
    name: '🎯 Collectionneur de Jeux',
    description: 'Joue 10 fois aux mini-jeux',
    tier: 'silver',
    icon: '🎯',
    requirement: { type: 'games_played', value: 10 },
  },
  perfect_score: {
    id: 'perfect_score',
    name: '⭐ Score Parfait',
    description: 'Obtiens un score parfait au Quiz',
    tier: 'gold',
    icon: '⭐',
    requirement: { type: 'game_score', value: 100 },
  },
};
