import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { VocabularyWord } from "@/types/vocabulary";
import { playWordSound } from "@/lib/audio-manager";

type Props = {
  word: VocabularyWord;
  onFlip?: () => void;
  isFlipped: boolean;
  showTransliteration?: boolean;
};

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = Math.min(screenWidth - 64, 340);
const cardHeight = cardWidth * 1.35;

export default function VocabularyCard({ word, onFlip, isFlipped, showTransliteration = true }: Props) {
  const flipAnim = useSharedValue(isFlipped ? 1 : 0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    flipAnim.value = withTiming(isFlipped ? 1 : 0, { duration: 400 });
  }, [isFlipped]);

  const handleSpeak = async () => {
    if (playing) return;
    setPlaying(true);
    try {
      await playWordSound(word.arabic);
    } catch (e) {
      console.warn("[VocabCard] Speech failed:", e);
    }
    setPlaying(false);
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(flipAnim.value, [0, 1], [0, 180])}deg` }],
    backfaceVisibility: "hidden" as const,
    width: "100%",
    height: "100%",
    backgroundColor: "#1E293B",
    borderWidth: 2,
    borderColor: "#6366F1",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(flipAnim.value, [0, 1], [180, 360])}deg` }],
    backfaceVisibility: "hidden" as const,
    position: "absolute" as const,
    width: "100%",
    height: "100%",
    backgroundColor: "#064E3B",
    borderWidth: 2,
    borderColor: "#10B981",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  }));

  return (
    <TouchableOpacity
      onPress={() => onFlip?.()}
      activeOpacity={0.9}
      style={{ width: cardWidth, height: cardHeight }}
    >
      <View style={{ width: "100%", height: "100%" }}>
        {/* Front */}
        <Animated.View style={frontStyle}>
          <Text className="text-center mb-4" style={{ fontSize: 56, color: "#F1F5F9" }}>
            {word.arabic}
          </Text>

          <TouchableOpacity
            onPress={handleSpeak}
            activeOpacity={0.7}
            className="w-11 h-11 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: playing ? "#334155" : "#6366F1" }}
          >
            <Text className="text-lg">{playing ? "⏳" : "🔊"}</Text>
          </TouchableOpacity>

          {showTransliteration && (
            <Text className="text-sm italic mt-1" style={{ color: "#94A3B8" }}>
              {word.transliteration}
            </Text>
          )}
          <Text className="text-xs mt-3" style={{ color: "#475569" }}>
            Clique pour voir le sens
          </Text>
        </Animated.View>

        {/* Back */}
        <Animated.View style={backStyle}>
          <Text className="text-center mb-3" style={{ fontSize: 40, color: "#F1F5F9" }}>
            {word.arabic}
          </Text>

          <View className="px-5 py-2 rounded-full mb-3" style={{ backgroundColor: "#10B981" }}>
            <Text className="text-base font-bold text-center" style={{ color: "#fff" }}>
              {word.french}
            </Text>
          </View>

          {showTransliteration && (
            <Text className="text-sm italic mb-2" style={{ color: "#6EE7B7" }}>
              {word.transliteration}
            </Text>
          )}

          {word.example && (
            <View className="mt-3 px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <Text className="text-base text-center" style={{ fontSize: 18, color: "#F1F5F9" }}>
                {word.example}
              </Text>
              {word.exampleTranslation && (
                <Text className="text-xs text-center mt-1" style={{ color: "#94A3B8" }}>
                  {word.exampleTranslation}
                </Text>
              )}
            </View>
          )}

          <Text className="text-xs mt-3" style={{ color: "#6EE7B7" }}>
            {word.frequency}× dans le Coran
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
