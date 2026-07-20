import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { playCelebrationSound } from "@/lib/audio-manager";

type CelebrationScreenProps = {
  dayNumber: number;
  letter: string;
  isSpecial?: boolean;
  onFinish: () => void;
};

const CONFETTI = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  emoji: ["🎉", "⭐", "✨", "🌟", "💫", "🎊"][i % 6],
  left: `${(i * 31 + 7) % 100}%`,
  top: `${(i * 47 + 13) % 100}%`,
}));

export function CelebrationScreen({
  dayNumber,
  letter,
  isSpecial = false,
  onFinish,
}: CelebrationScreenProps) {
  const badgeScale = useSharedValue(0);
  const confettiOpacity = useSharedValue(1);

  useEffect(() => {
    playCelebrationSound();
    badgeScale.value = withSequence(
      withTiming(1.3, { duration: 400 }),
      withTiming(1, { duration: 200 })
    );
    confettiOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-6 pt-6" style={{ backgroundColor: "#0F172A" }}>
      {/* Confetti */}
      <Animated.View className="absolute inset-0" style={confettiStyle} pointerEvents="none">
        {CONFETTI.map((c) => (
          <Text
            key={c.id}
            className="absolute text-2xl"
            style={{ left: c.left, top: c.top }}
          >
            {c.emoji}
          </Text>
        ))}
      </Animated.View>

      <View className="flex-1 justify-center items-center">
        {/* Title */}
        <Text className="text-2xl font-extrabold text-center mb-8" style={{ color: "#FCD34D" }}>
          {isSpecial ? "🏆 Bravo Champion !" : "🎉 Félicitations !"}
        </Text>

        {/* Badge */}
        <Animated.View
          entering={ZoomIn.delay(300).springify()}
          style={badgeStyle}
          className="items-center mb-8"
        >
          <View className="relative">
            <View
              className="absolute -inset-6 rounded-full"
              style={{ backgroundColor: isSpecial ? "rgba(245,158,11,0.15)" : "rgba(255,107,107,0.15)" }}
            />
            <View
              className="relative w-36 h-36 rounded-full items-center justify-center"
              style={{
                backgroundColor: "#1E293B",
                borderWidth: 4,
                borderColor: isSpecial ? "#F59E0B" : "#FF6B6B",
              }}
            >
              <Text style={{ fontSize: 64, color: "#F1F5F9" }}>{letter}</Text>
            </View>
          </View>
          <Text className="text-sm font-bold mt-3" style={{ color: "#94A3B8" }}>
            Jour {dayNumber}
          </Text>
        </Animated.View>

        {/* Message */}
        <View
          className="rounded-2xl p-5 mb-6 w-full"
          style={{ backgroundColor: "#064E3B", borderWidth: 1, borderColor: "#10B981" }}
        >
          <Text className="text-lg text-center font-bold mb-2" style={{ color: "#6EE7B7" }}>
            Tu as terminé le jour {dayNumber} !
          </Text>
          <Text className="text-sm text-center leading-5" style={{ color: "#94A3B8" }}>
            {isSpecial
              ? "Tu es un vrai champion ! Continue comme ça !"
              : "Nouveau badge débloqué ! Continue ton aventure demain !"}
          </Text>
        </View>

        {/* Progress */}
        <View className="rounded-2xl px-5 py-3" style={{ backgroundColor: "#1E293B" }}>
          <Text className="text-sm text-center" style={{ color: "#94A3B8" }}>
            📊 Progression : {dayNumber}/29 lettres
          </Text>
        </View>
      </View>

      {/* Finish button */}
      <TouchableOpacity
        onPress={onFinish}
        activeOpacity={0.85}
        className="py-4 rounded-2xl mb-8"
        style={{ backgroundColor: "#10B981" }}
      >
        <Text className="text-white text-base font-bold text-center">Terminer ✓</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
