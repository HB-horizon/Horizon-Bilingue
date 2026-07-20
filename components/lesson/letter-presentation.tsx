import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { playLetterSound } from "@/lib/audio-manager";

type LetterPresentationProps = {
  letter: string;
  latinName: string;
  mnemonicTip?: string;
  onNext: () => void;
};

export function LetterPresentation({
  letter,
  latinName,
  mnemonicTip,
  onNext,
}: LetterPresentationProps) {
  const scale = useSharedValue(1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withSpring(1.08, { damping: 8, stiffness: 120 }),
        withSpring(1, { damping: 8, stiffness: 120 })
      ),
      -1,
      false
    );
    playLetterSound(letter, "fatha").catch(() => {});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSpeak = async () => {
    if (playing) return;
    setPlaying(true);
    await playLetterSound(letter, "fatha");
    setTimeout(() => setPlaying(false), 500);
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-6 pt-6">
      <View className="flex-1 items-center justify-center">
        {/* Title */}
        <Text className="text-sm font-semibold mb-6" style={{ color: "#64748B" }}>
          Découvre la lettre
        </Text>

        {/* Letter with glow */}
        <Animated.View
          entering={ZoomIn.delay(300).springify()}
          style={animatedStyle}
          className="items-center mb-8"
        >
          <View className="relative">
            <View className="absolute -inset-10 rounded-full" style={{ backgroundColor: "rgba(255,107,107,0.12)" }} />
            <View className="relative w-40 h-40 rounded-full items-center justify-center" style={{ backgroundColor: "#1E293B", borderWidth: 3, borderColor: "#FF6B6B" }}>
              <Text className="text-center" style={{ fontSize: 80, color: "#F1F5F9" }}>
                {letter}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Audio button */}
        <TouchableOpacity
          onPress={handleSpeak}
          activeOpacity={0.7}
          className="w-14 h-14 rounded-full items-center justify-center mb-6"
          style={{
            backgroundColor: playing ? "#10B981" : "#FF6B6B",
            shadowColor: "#FF6B6B",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-2xl">{playing ? "✓" : "🔊"}</Text>
        </TouchableOpacity>

        {/* Latin name */}
        <Text className="text-2xl font-extrabold text-center mb-6" style={{ color: "#FF6B6B" }}>
          {latinName}
        </Text>

        {/* Mnemonic tip */}
        {mnemonicTip && (
          <Animated.View
            entering={FadeIn.delay(600)}
            className="w-full rounded-2xl p-4"
            style={{ backgroundColor: "#78350F", borderWidth: 1, borderColor: "#F59E0B" }}
          >
            <Text className="text-sm text-center leading-5" style={{ color: "#FDE68A" }}>
              💡 {mnemonicTip}
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Next button */}
      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.85}
        className="py-4 rounded-2xl mb-8"
        style={{ backgroundColor: "#FF6B6B" }}
      >
        <Text className="text-white text-base font-bold text-center">Suivant →</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
