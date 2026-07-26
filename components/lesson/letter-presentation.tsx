import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
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
  exampleWord?: string;
  exampleLatin?: string;
  exampleImage?: string;
  storyContent?: string;
  storyCharacter?: string;
  dayNumber?: number;
  mnemonicTip?: string;
  onNext: () => void;
};

export function LetterPresentation({
  letter,
  latinName,
  exampleWord,
  exampleLatin,
  exampleImage,
  storyContent,
  storyCharacter,
  dayNumber,
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
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-5 pt-4">
      <Animated.View entering={FadeInDown.delay(100).duration(400)} className="flex-row items-center justify-center gap-2 mb-3">
        <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: "#FF6B6B" }} />
        <Text className="text-xs font-bold" style={{ color: "#FF6B6B" }}>
          {dayNumber ? `Jour ${dayNumber}` : "Apprentissage"}
        </Text>
        <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: "#FF6B6B" }} />
      </Animated.View>

      {storyContent && (
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#334155" }}
        >
          <View className="flex-row items-start gap-3">
            {storyCharacter && (
              <Text className="text-3xl">{storyCharacter}</Text>
            )}
            <View className="flex-1">
              <Text className="text-xs font-semibold mb-1" style={{ color: "#F59E0B" }}>
                {storyCharacter ? "Histoire" : "Introduction"}
              </Text>
              <Text className="text-sm leading-5" style={{ color: "#CBD5E1" }}>
                {storyContent}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      <View className="flex-1 items-center justify-center">
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          className="items-center mb-4"
        >
          <Text className="text-sm font-semibold mb-2" style={{ color: "#64748B" }}>
            Découvre la lettre
          </Text>
        </Animated.View>

        <Animated.View
          entering={ZoomIn.delay(400).springify()}
          style={animatedStyle}
          className="items-center mb-5"
        >
          <View className="relative">
            <View
              className="absolute -inset-12 rounded-full"
              style={{ backgroundColor: "rgba(255,107,107,0.1)" }}
            />
            <View
              className="absolute -inset-8 rounded-full"
              style={{ backgroundColor: "rgba(255,107,107,0.08)" }}
            />
            <View
              className="relative w-36 h-36 rounded-full items-center justify-center"
              style={{
                backgroundColor: "#1E293B",
                borderWidth: 3,
                borderColor: "#FF6B6B",
                shadowColor: "#FF6B6B",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text className="text-center" style={{ fontSize: 76, color: "#F1F5F9" }}>
                {letter}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(500).duration(400)}
          className="items-center mb-4"
        >
          <TouchableOpacity
            onPress={handleSpeak}
            activeOpacity={0.7}
            className="w-14 h-14 rounded-full items-center justify-center mb-3"
            style={{
              backgroundColor: playing ? "#10B981" : "#FF6B6B",
              shadowColor: playing ? "#10B981" : "#FF6B6B",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text className="text-2xl">{playing ? "✓" : "🔊"}</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold" style={{ color: "#FF6B6B" }}>
            {latinName}
          </Text>
        </Animated.View>

        {exampleWord && (
          <Animated.View
            entering={FadeInUp.delay(600).duration(500)}
            className="rounded-2xl px-5 py-3 mb-4"
            style={{
              backgroundColor: "#1E293B",
              borderWidth: 1,
              borderColor: "#F59E0B40",
            }}
          >
            <View className="flex-row items-center gap-3">
              {exampleImage && <Text className="text-2xl">{exampleImage}</Text>}
              <View>
                <Text className="text-xs" style={{ color: "#64748B" }}>
                  Exemple
                </Text>
                <Text className="text-xl font-bold" style={{ color: "#FCD34D" }}>
                  {exampleWord}
                </Text>
                <Text className="text-xs" style={{ color: "#94A3B8" }}>
                  {exampleLatin}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {mnemonicTip && (
          <Animated.View
            entering={FadeInUp.delay(700).duration(500)}
            className="rounded-2xl p-3 w-full"
            style={{ backgroundColor: "#78350F", borderWidth: 1, borderColor: "#F59E0B" }}
          >
            <Text className="text-xs text-center leading-4" style={{ color: "#FDE68A" }}>
              💡 {mnemonicTip}
            </Text>
          </Animated.View>
        )}
      </View>

      <Animated.View entering={FadeInUp.delay(800).duration(400)}>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.85}
          className="py-4 rounded-2xl mb-6"
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
            Suivant →
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
