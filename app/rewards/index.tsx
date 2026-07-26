import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { BadgeDisplay, LockedBadgeDisplay } from "@/components/rewards/badge-display";
import { useEffect, useState, useCallback } from "react";
import { rewardsManager } from "@/lib/rewards-manager";
import { UserRewards, PREDEFINED_BADGES } from "@/types/rewards";
import Animated, { FadeInDown } from "react-native-reanimated";
import { HamburgerButton } from "@/components/drawer/hamburger-button";
import { useDrawer } from "@/components/drawer/drawer-provider";

export default function RewardsScreen() {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [rewards, setRewards] = useState<UserRewards | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRewards = useCallback(async () => {
    try {
      setRewards(await rewardsManager.loadRewards());
    } catch (e) {
      console.error("Error loading rewards:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRewards(); }, [loadRewards]);
  useFocusEffect(useCallback(() => { loadRewards(); }, [loadRewards]));

  if (loading || !rewards) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">Chargement...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const unlockedIds = new Set(rewards.badges.map((b) => b.id));
  const unlocked = rewards.badges;
  const locked = Object.values(PREDEFINED_BADGES).filter((b) => !unlockedIds.has(b.id));

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ backgroundColor: "#0F172A" }} className="px-5 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <HamburgerButton onPress={openDrawer} />
            <TouchableOpacity onPress={() => router.back()} className="active:opacity-70">
              <Text style={{ color: "#94A3B8" }} className="text-sm">← Retour</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push('/')} className="active:opacity-70 p-2">
            <Text className="text-xl">🏠</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
          🏆 Mes Récompenses
        </Text>
        <Text className="text-xs text-center" style={{ color: "#64748B" }}>
          Collecte des badges en jouant et en apprenant
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Stats */}
        <View className="flex-row gap-2 px-5 mt-5 mb-5">
          <StatBox label="Points" value={rewards.totalPoints} icon="⭐" color="#F59E0B" />
          <StatBox label="Badges" value={rewards.badges.length} icon="🏅" color="#10B981" />
          <StatBox label="Jeux" value={rewards.totalGamesPlayed} icon="🎮" color="#8B5CF6" />
        </View>

        {/* Best score */}
        {rewards.bestGameScore && (
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            className="mx-5 mb-5 rounded-2xl p-4"
            style={{ backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#334155" }}
          >
            <Text className="text-xs text-center mb-1" style={{ color: "#64748B" }}>Meilleur score</Text>
            <Text className="text-2xl font-extrabold text-center" style={{ color: "#FF6B6B" }}>
              {Math.round((rewards.bestGameScore.score / rewards.bestGameScore.maxScore) * 100)}%
            </Text>
            <Text className="text-xs text-center mt-0.5" style={{ color: "#94A3B8" }}>
              au {rewards.bestGameScore.gameType === "memory" ? "Memory" : "Quiz"}
            </Text>
          </Animated.View>
        )}

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-6">
            <Text className="text-sm font-bold px-5 mb-3" style={{ color: "#6EE7B7" }}>
              ✅ Débloqués ({unlocked.length})
            </Text>
            <View className="flex-row flex-wrap justify-around gap-4 px-5">
              {unlocked.map((badge) => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-6">
            <Text className="text-sm font-bold px-5 mb-3" style={{ color: "#64748B" }}>
              🔒 À débloquer ({locked.length})
            </Text>
            <View className="flex-row flex-wrap justify-around gap-4 px-5">
              {locked.map((badge) => (
                <LockedBadgeDisplay key={badge.id} badge={badge} />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Motivation */}
        <View className="mx-5 rounded-2xl p-4 mb-4" style={{ backgroundColor: "#78350F", borderWidth: 1, borderColor: "#F59E0B" }}>
          <Text className="text-xs text-center" style={{ color: "#FDE68A" }}>
            💡 Continue à jouer et à apprendre pour débloquer tous les badges !
          </Text>
        </View>

        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          className="mx-5 py-4 rounded-2xl"
          style={{ backgroundColor: "#FF6B6B" }}
        >
          <Text className="text-white text-base font-bold text-center">← Retour au Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

function StatBox({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <View className="flex-1 items-center py-4 rounded-2xl" style={{ backgroundColor: `${color}15` }}>
      <Text className="text-xl mb-1">{icon}</Text>
      <Text className="text-2xl font-extrabold" style={{ color }}>{value}</Text>
      <Text className="text-xs mt-0.5" style={{ color: "#64748B" }}>{label}</Text>
    </View>
  );
}
