import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  BounceIn,
  LightSpeedInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { ConfettiSystem } from "@/components/ui/confetti-system";

type CelebrationScreenProps = {
  dayNumber: number;
  letter: string;
  isSpecial?: boolean;
  onFinish: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function CelebrationScreen({
  dayNumber,
  letter,
  isSpecial = false,
  onFinish,
}: CelebrationScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const badgeScale = useSharedValue(0);
  const badgeGlow = useSharedValue(0);
  const star1Rotate = useSharedValue(0);
  const star2Rotate = useSharedValue(0);

  useEffect(() => {
    setShowConfetti(true);

    badgeScale.value = withSequence(
      withSpring(1.4, { damping: 6, stiffness: 180 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );

    badgeGlow.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    star1Rotate.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1
    );
    star2Rotate.value = withRepeat(
      withTiming(-360, { duration: 5000, easing: Easing.linear }),
      -1
    );
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: badgeGlow.value,
  }));

  const star1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${star1Rotate.value}deg` }],
  }));

  const star2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${star2Rotate.value}deg` }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <ConfettiSystem active={showConfetti} count={40} />

      <View className="flex-1 justify-center items-center px-6">
        <Animated.Text
          entering={BounceIn.delay(200).springify()}
          className="text-2xl font-extrabold text-center mb-4"
          style={{ color: "#FCD34D" }}
        >
          {isSpecial ? "🏆 BRAVO CHAMPION !" : "🎉 FÉLICITATIONS !"}
        </Animated.Text>

        <Animated.Text
          entering={FadeIn.delay(500).duration(600)}
          className="text-center mb-6"
          style={{ color: "#94A3B8", fontSize: 13 }}
        >
          {isSpecial
            ? "Tu es un vrai champion !"
            : "Nouveau badge débloqué !"}
        </Animated.Text>

        <View className="items-center mb-8">
          <Animated.View style={badgeStyle} className="relative items-center">
            <Animated.View
              className="absolute w-48 h-48 rounded-full"
              style={[
                glowStyle,
                {
                  backgroundColor: isSpecial
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(255,107,107,0.15)",
                },
              ]}
            />

            <Animated.View
              entering={LightSpeedInRight.delay(800).springify()}
              style={star1Style}
              className="absolute -top-4 -right-4 z-10"
            >
              <Text style={{ fontSize: 28 }}>⭐</Text>
            </Animated.View>

            <Animated.View
              entering={LightSpeedInRight.delay(1000).springify()}
              style={star2Style}
              className="absolute -bottom-2 -left-4 z-10"
            >
              <Text style={{ fontSize: 22 }}>🌟</Text>
            </Animated.View>

            <View
              className="w-40 h-40 rounded-full items-center justify-center"
              style={{
                backgroundColor: "#1E293B",
                borderWidth: 4,
                borderColor: isSpecial ? "#F59E0B" : "#FF6B6B",
                shadowColor: isSpecial ? "#F59E0B" : "#FF6B6B",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 20,
                elevation: 12,
              }}
            >
              <Text style={{ fontSize: 72, color: "#F1F5F9" }}>{letter}</Text>
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeIn.delay(1200).duration(500)}
            className="text-sm font-bold mt-4"
            style={{ color: "#64748B" }}
          >
            Jour {dayNumber}
          </Animated.Text>
        </View>

        <Animated.View
          entering={BounceIn.delay(1500).springify()}
          className="w-full rounded-2xl p-5 mb-6"
          style={{
            backgroundColor: isSpecial ? "#78350F" : "#064E3B",
            borderWidth: 1,
            borderColor: isSpecial ? "#F59E0B" : "#10B981",
          }}
        >
          <View className="flex-row items-center justify-center gap-2 mb-2">
            <Text style={{ fontSize: 24 }}>{isSpecial ? "🏆" : "✅"}</Text>
            <Text
              className="text-lg font-bold text-center"
              style={{ color: isSpecial ? "#FCD34D" : "#6EE7B7" }}
            >
              Jour {dayNumber} terminé !
            </Text>
          </View>
          {dayNumber === 4 && (
            <Text
              className="text-sm text-center leading-5"
              style={{ color: "#FDE68A" }}
            >
              Tu as complété 4 jours — quel champion ! Continue comme ça !
            </Text>
          )}
          {dayNumber === 10 && (
            <Text
              className="text-sm text-center leading-5"
              style={{ color: "#FDE68A" }}
            >
              Double chiffre ! 10 lettres maîtrisées ! Impressionnant !
            </Text>
          )}
          {dayNumber === 29 && (
            <Text
              className="text-sm text-center leading-5"
              style={{ color: "#FDE68A" }}
            >
              Toutes les lettres sont apprises ! Prêt pour Al-Fatiha ! 🌟
            </Text>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(1800).duration(500)}
          className="rounded-2xl px-6 py-3"
          style={{ backgroundColor: "#1E293B" }}
        >
          <Text className="text-sm text-center" style={{ color: "#94A3B8" }}>
            📊 Progression : {dayNumber}/29 lettres
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeIn.delay(2200).duration(500)}
        className="px-6 pb-8"
      >
        <TouchableOpacity
          onPress={onFinish}
          activeOpacity={0.85}
          className="py-4 rounded-2xl"
          style={{
            backgroundColor: "#10B981",
            shadowColor: "#10B981",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text className="text-white text-base font-bold text-center">
            Terminer ✓
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
