import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { BadgeCard } from "@/components/common/badge-card";
import { useProgress } from "@/hooks/use-progress";
import { allLessons } from "@/data/all-lessons";
import { getDueSRSCount } from "@/lib/srs-manager";
import Animated, {
  FadeInDown,
  FadeIn,
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { HamburgerButton } from "@/components/drawer/hamburger-button";
import { useDrawer } from "@/components/drawer/drawer-provider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DashboardScreen() {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const { progress, loading, isDayUnlocked, getProgressPercentage, reload } = useProgress();
  const [srsDueCount, setSrsDueCount] = useState(0);
  const progressAnim = useSharedValue(0);
  const barGlow = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      reload();
      getDueSRSCount().then(setSrsDueCount);
    }, [reload]),
  );

  useEffect(() => {
    if (!loading && progress) {
      const pct = getProgressPercentage();
      progressAnim.value = withSpring(pct / 100, { damping: 15, stiffness: 80 });
      barGlow.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [loading, progress]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: barGlow.value,
  }));

  if (loading || !progress) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Animated.Text
          entering={FadeIn.duration(600)}
          className="text-lg text-muted"
        >
          Chargement...
        </Animated.Text>
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
          {/* Hamburger menu */}
          <View className="flex-row justify-between items-center mb-4">
            <HamburgerButton onPress={openDrawer} />
            <TouchableOpacity
              onPress={() => router.push('/')}
              className="active:opacity-70 p-2"
            >
              <Text className="text-xl">🏠</Text>
            </TouchableOpacity>
          </View>
          <Animated.Text
            entering={FadeInDown.duration(400).springify()}
            className="text-2xl font-extrabold text-center mb-1"
            style={{ color: "#F1F5F9" }}
          >
            Ton Aventure Arabe
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(100).duration(400).springify()}
            className="text-xs text-center mb-5"
            style={{ color: "#64748B" }}
          >
            {completed === 0
              ? "Commence ta première leçon"
              : completed === 29
                ? "Toutes les lettres sont apprises !"
                : `${completed} lettres apprises — continue !`}
          </Animated.Text>

          {/* Animated Progress bar */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="mb-3"
          >
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-xs font-semibold" style={{ color: "#94A3B8" }}>
                {completed}/29 lettres
              </Text>
              <Text className="text-xs font-bold" style={{ color: "#FF6B6B" }}>
                {progressPercentage}%
              </Text>
            </View>
            <View
              className="h-3 rounded-full overflow-hidden relative"
              style={{ backgroundColor: "#334155" }}
            >
              <Animated.View
                className="h-full rounded-full"
                style={[
                  progressBarStyle,
                  {
                    backgroundColor:
                      progressPercentage === 100 ? "#10B981" : "#FF6B6B",
                  },
                ]}
              />
              <Animated.View
                className="absolute inset-0 h-full rounded-full"
                style={[
                  glowStyle,
                  {
                    backgroundColor:
                      progressPercentage === 100
                        ? "rgba(16,185,129,0.3)"
                        : "rgba(255,107,107,0.2)",
                  },
                ]}
              />
            </View>
            {progressPercentage > 0 && progressPercentage % 25 === 0 && (
              <Animated.View entering={BounceIn} className="items-center mt-1">
                <Text style={{ fontSize: 16 }}>
                  {progressPercentage === 25
                    ? "🔥"
                    : progressPercentage === 50
                      ? "⚡"
                      : progressPercentage === 75
                        ? "💪"
                        : "🎯"}
                </Text>
          </Animated.View>
        )}

        {/* Accessibility Settings Link */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <TouchableOpacity
            onPress={() => router.push("/accessibility" as any)}
            className="flex-row items-center rounded-2xl p-3"
            style={{ backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#334155" }}
          >
            <Text className="text-lg mr-3">♿</Text>
            <View className="flex-1">
              <Text className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>Lecture & Dyslexie</Text>
              <Text className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>Police, espacement, fond apaisant</Text>
            </View>
            <Text className="text-lg" style={{ color: "#64748B" }}>→</Text>
          </TouchableOpacity>
        </Animated.View>
          </Animated.View>

          {/* Quick stats */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="flex-row justify-center gap-6 mt-2"
          >
            <StatItem value={completed} label="lettres" color="#FCD34D" />
            <StatItem value={`${progressPercentage}%`} label="complété" color="#34D399" />
            <StatItem value={29 - completed} label="restantes" color="#A78BFA" />
          </Animated.View>
        </View>

        {/* Badge grid */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          className="px-4 pt-5 pb-4"
        >
          <Text className="text-sm font-bold text-center mb-4" style={{ color: "#CBD5E1" }}>
            Alphabet Arabe — 29 Lettres
          </Text>

          <View className="flex-row flex-wrap justify-center gap-2.5">
            {allLessons.map((lesson, index) => (
              <Animated.View
                key={lesson.dayNumber}
                entering={FadeInDown.delay(500 + index * 50).duration(300).springify()}
              >
                <BadgeCard
                  dayNumber={lesson.dayNumber}
                  letter={lesson.letter}
                  isUnlocked={isDayUnlocked(lesson.dayNumber)}
                  isCompleted={progress.completedDays.includes(lesson.dayNumber)}
                  isCurrent={lesson.dayNumber === nextDay}
                  isSpecial={lesson.isSpecialDay}
                  onPress={() => handleBadgePress(lesson.dayNumber)}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Motivation */}
        {completed > 0 && completed < 29 && (
          <Animated.View
            entering={BounceIn.delay(600).springify()}
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
            entering={BounceIn.delay(600).springify()}
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
        {completed >= 1 && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="flex-row gap-2 mb-3"
          >
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
              icon="🧠"
              label={srsDueCount > 0 ? `SRS (${srsDueCount})` : "SRS"}
              color="#6366F1"
              badge={srsDueCount > 0 ? srsDueCount : undefined}
              onPress={() => router.push("/revision/srs")}
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
          </Animated.View>
        )}

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

function StatItem({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <View className="items-center">
      <Text className="text-lg font-extrabold" style={{ color }}>
        {value}
      </Text>
      <Text className="text-xs" style={{ color: "#64748B" }}>
        {label}
      </Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  color,
  badge,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  badge?: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 items-center py-3 rounded-xl relative"
      style={{ backgroundColor: `${color}20` }}
    >
      {badge ? (
        <View
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
          style={{ backgroundColor: "#EF4444" }}
        >
          <Text className="text-white text-xs font-bold">{badge}</Text>
        </View>
      ) : null}
      <Text className="text-xl mb-1">{icon}</Text>
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
