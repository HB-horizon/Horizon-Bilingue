import { View, Text } from 'react-native';
import { Badge, BadgeTier } from '@/types/rewards';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

type BadgeDisplayProps = {
  badge: Badge;
  isNew?: boolean;
};

/**
 * Composant pour afficher un badge
 */
export function BadgeDisplay({ badge, isNew = false }: BadgeDisplayProps) {
  const tierColors: Record<BadgeTier, { bg: string; border: string; text: string }> = {
    bronze: {
      bg: '#CD7F32',
      border: '#8B4513',
      text: '#FFFFFF',
    },
    silver: {
      bg: '#C0C0C0',
      border: '#808080',
      text: '#000000',
    },
    gold: {
      bg: '#FFD700',
      border: '#DAA520',
      text: '#000000',
    },
    platinum: {
      bg: '#E5E4E2',
      border: '#C0C0C0',
      text: '#000000',
    },
  };

  const colors = tierColors[badge.tier];

  return (
    <Animated.View
      entering={isNew ? ZoomIn.springify() : FadeIn}
      className="items-center"
    >
      <View
        className="w-20 h-20 rounded-full items-center justify-center border-4 shadow-lg"
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
        }}
      >
        <Text className="text-4xl">{badge.icon}</Text>
      </View>
      <Text className="text-sm font-bold text-center mt-2 text-foreground">
        {badge.name}
      </Text>
      <Text className="text-xs text-center text-muted mt-1">
        {badge.description}
      </Text>
    </Animated.View>
  );
}

/**
 * Composant pour afficher un badge verrouillé
 */
export function LockedBadgeDisplay({ badge }: { badge: Badge }) {
  return (
    <View className="items-center">
      <View className="w-20 h-20 rounded-full items-center justify-center border-4 border-border bg-surface opacity-50">
        <Text className="text-4xl opacity-50">🔒</Text>
      </View>
      <Text className="text-sm font-bold text-center mt-2 text-muted">
        {badge.name}
      </Text>
      <Text className="text-xs text-center text-muted/50 mt-1">
        {badge.description}
      </Text>
    </View>
  );
}

/**
 * Composant pour afficher la notification de nouveau badge
 */
export function BadgeUnlockedNotification({ badge }: { badge: Badge }) {
  const tierEmojis: Record<BadgeTier, string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '👑',
  };

  return (
    <Animated.View
      entering={ZoomIn.springify()}
      className="bg-success p-6 rounded-2xl items-center mb-6 border-2 border-success/50"
    >
      <Text className="text-5xl mb-4">
        {tierEmojis[badge.tier]}
      </Text>
      <Text className="text-2xl font-bold text-white text-center mb-2">
        Nouveau Badge Débloqué !
      </Text>
      <Text className="text-xl font-bold text-white text-center mb-1">
        {badge.icon} {badge.name}
      </Text>
      <Text className="text-white text-center text-sm">
        {badge.description}
      </Text>
    </Animated.View>
  );
}
