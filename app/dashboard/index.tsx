import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BadgeCard } from "@/components/common/badge-card";
import { useProgress } from "@/hooks/use-progress";
import { allLessons } from "@/data/all-lessons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function DashboardScreen() {
  const router = useRouter();
  const { progress, loading, isDayUnlocked, getProgressPercentage, reload } = useProgress();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (loading || !progress) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Chargement...</Text>
      </ScreenContainer>
    );
  }

  const progressPercentage = getProgressPercentage();
  const nextDay = progress.currentDay;
  const completed = progress.completedDays.length;

  const handleBadgePress = (dayNumber: number) => {
    router.push(`/lesson/${dayNumber}` as any);
  };

  const handleContinue = () => {
    router.push(nextDay <= 29 ? `/lesson/${nextDay}` : "/lesson/30");
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 220 }}>
        {/* Header */}
        <View style={{ backgroundColor: "#0F172A" }} className="px-5 pt-6 pb-8">
          <Text className="text-2xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
            Ton Aventure Arabe
          </Text>
          <Text className="text-xs text-center mb-5" style={{ color: "#64748B" }}>
            {completed === 0
              ? "Commence ta première leçon"
              : completed === 29
                ? "Toutes les lettres sont apprises !"
                : `${completed} lettres apprises — continue !`}
          </Text>

          {/* Progress bar */}
          <View className="mb-3">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-xs font-semibold" style={{ color: "#94A3B8" }}>
                {completed}/29 lettres
              </Text>
              <Text className="text-xs font-bold" style={{ color: "#FF6B6B" }}>
                {progressPercentage}%
              </Text>
            </View>
            <View className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#334155" }}>
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: progressPercentage === 100 ? "#10B981" : "#FF6B6B",
                }}
              />
            </View>
          </View>

          {/* Quick stats */}
          <View className="flex-row justify-center gap-6 mt-2">
            <View className="items-center">
              <Text className="text-lg font-extrabold" style={{ color: "#FCD34D" }}>{completed}</Text>
              <Text className="text-xs" style={{ color: "#64748B" }}>lettres</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-extrabold" style={{ color: "#34D399" }}>{progressPercentage}%</Text>
              <Text className="text-xs" style={{ color: "#64748B" }}>complété</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-extrabold" style={{ color: "#A78BFA" }}>{29 - completed}</Text>
              <Text className="text-xs" style={{ color: "#64748B" }}>restantes</Text>
            </View>
          </View>
        </View>

        {/* Badge grid */}
        <View className="px-4 pt-5 pb-4">
          <Text className="text-sm font-bold text-center mb-4" style={{ color: "#CBD5E1" }}>
            Alphabet Arabe — 29 Lettres
          </Text>

          <View className="flex-row flex-wrap justify-center gap-2.5">
            {allLessons.map((lesson) => (
              <BadgeCard
                key={lesson.dayNumber}
                dayNumber={lesson.dayNumber}
                letter={lesson.letter}
                isUnlocked={isDayUnlocked(lesson.dayNumber)}
                isCompleted={progress.completedDays.includes(lesson.dayNumber)}
                isCurrent={lesson.dayNumber === nextDay}
                isSpecial={lesson.isSpecialDay}
                onPress={() => handleBadgePress(lesson.dayNumber)}
              />
            ))}
          </View>
        </View>

        {/* Motivation */}
        {completed > 0 && completed < 29 && (
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            className="mx-5 mb-4 rounded-2xl p-4"
            style={{ backgroundColor: "#064E3B", borderWidth: 1, borderColor: "#10B981" }}
          >
            <Text className="text-sm text-center font-semibold" style={{ color: "#6EE7B7" }}>
              {completed < 10
                ? `💪 Super ! Tu connais déjà ${completed} lettre${completed > 1 ? "s" : ""} !`
                : completed < 20
                  ? `🔥 Impressionnant ! ${completed} lettres maîtrisées !`
                  : `🌟 Tu y es presque ! Plus que ${29 - completed} lettres !`}
            </Text>
          </Animated.View>
        )}

        {completed === 29 && (
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            className="mx-5 mb-4 rounded-2xl p-4"
            style={{ backgroundColor: "#78350F", borderWidth: 1, borderColor: "#F59E0B" }}
          >
            <Text className="text-sm text-center font-bold" style={{ color: "#FCD34D" }}>
              🎉 Bravo ! Il est temps de lire la Sourate Al-Fatiha !
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Floating bottom panel */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-3"
        style={{
          backgroundColor: "#0F172A",
          borderTopWidth: 1,
          borderTopColor: "#1E293B",
        }}
      >
        {/* Quick action grid */}
        {completed >= 1 && (
          <View className="flex-row gap-2 mb-3">
            <QuickAction
              icon="🏆"
              label="Récompenses"
              color="#F59E0B"
              onPress={() => router.push("/rewards")}
            />
            <QuickAction
              icon="📚"
              label="Révision"
              color="#06B6D4"
              onPress={() => router.push("/revision")}
            />
            <QuickAction
              icon="📖"
              label="Vocabulaire"
              color="#8B5CF6"
              onPress={() => router.push("/vocabulary")}
            />
            {completed >= 4 && (
              <QuickAction
                icon="🎮"
                label="Jeux"
                color="#10B981"
                onPress={() => router.push("/games")}
              />
            )}
          </View>
        )}

        {/* Main CTA */}
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.85}
          className="py-4 rounded-2xl"
          style={{
            backgroundColor: "#FF6B6B",
            shadowColor: "#FF6B6B",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text className="text-white text-base font-bold text-center">
            {nextDay <= 29 ? `Continuer — Jour ${nextDay}` : "Lire Al-Fatiha 🌟"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

function QuickAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 items-center py-3 rounded-xl"
      style={{ backgroundColor: `${color}20` }}
    >
      <Text className="text-xl mb-1">{icon}</Text>
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
