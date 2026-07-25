import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ExerciseWord } from "@/types/lesson";
import Animated, { FadeIn, SlideInUp, BounceIn } from "react-native-reanimated";
import { useState, useCallback } from "react";
import { playWordSound } from "@/lib/audio-manager";
import { ListenRepeatButton } from "@/components/common/listen-repeat-button";

type ExerciseSectionProps = {
  words: ExerciseWord[];
  onNext: () => void;
};

export function ExerciseSection({ words, onNext }: ExerciseSectionProps) {
  const [playedWords, setPlayedWords] = useState<Set<number>>(new Set());
  const [speechResults, setSpeechResults] = useState<Record<number, boolean>>({});

  const handleWordPlay = async (index: number) => {
    await playWordSound(words[index].arabic);
    setPlayedWords((prev) => new Set(prev).add(index));
  };

  const handleSpeechResult = useCallback((index: number, correct: boolean) => {
    setSpeechResults((prev) => ({ ...prev, [index]: correct }));
  }, []);

  const allPlayed = playedWords.size === words.length;
  const correctCount = Object.values(speechResults).filter(Boolean).length;

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-6 pt-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-semibold text-center mb-1" style={{ color: "#64748B" }}>
          Entraîne-toi
        </Text>
        <Text className="text-xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
          Écoute et Répète
        </Text>
        <Text className="text-xs text-center mb-6" style={{ color: "#94A3B8" }}>
          Clique sur chaque mot pour l&apos;entendre
        </Text>

        <View className="gap-2.5 mb-6">
          {words.map((word, index) => {
            const played = playedWords.has(index);
            const speechResult = speechResults[index];
            return (
              <Animated.View
                key={index}
                entering={SlideInUp.delay(index * 80).springify()}
              >
                <TouchableOpacity
                  onPress={() => handleWordPlay(index)}
                  activeOpacity={0.8}
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: "#1E293B",
                    borderWidth: 2,
                    borderColor: speechResult === true ? "#10B981" : speechResult === false ? "#EF4444" : played ? "#334155" : "#334155",
                  }}
                >
                  <View className="flex-row items-center">
                    {word.image && (
                      <Text className="text-3xl mr-3">{word.image}</Text>
                    )}

                    <View className="flex-1">
                      <Text className="text-center" style={{ fontSize: 32, color: "#F1F5F9" }}>
                        {word.arabic}
                      </Text>
                      <Text className="text-xs text-center mt-0.5" style={{ color: "#94A3B8" }}>
                        {word.latin}
                      </Text>
                    </View>

                    <View
                      className="w-11 h-11 rounded-full items-center justify-center"
                      style={{ backgroundColor: speechResult === true ? "#10B981" : speechResult === false ? "#EF4444" : played ? "#FF6B6B" : "#FF6B6B" }}
                    >
                      <Text className="text-lg">
                        {speechResult === true ? "✓" : speechResult === false ? "✗" : "🔊"}
                      </Text>
                    </View>
                  </View>

                  {played ? (
                    <Animated.View entering={BounceIn.springify()} className="mt-3">
                      <ListenRepeatButton
                        expectedText={word.arabic}
                        onResult={(correct) => handleSpeechResult(index, correct)}
                      />
                    </Animated.View>
                  ) : null}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Status */}
        <View
          className="rounded-2xl p-4"
          style={{
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "#334155",
          }}
        >
          <Text className="text-sm text-center font-semibold" style={{ color: "#94A3B8" }}>
            {allPlayed
              ? `✅ ${correctCount}/${words.length} mots prononcés correctement`
              : `🔊 Écoute les ${words.length} mots pour continuer`}
          </Text>
        </View>
      </ScrollView>

      {/* Next */}
      <TouchableOpacity
        onPress={onNext}
        disabled={!allPlayed}
        activeOpacity={0.85}
        className="py-4 rounded-2xl mb-8 mt-4"
        style={{ backgroundColor: allPlayed ? "#FF6B6B" : "#334155" }}
      >
        <Text className="text-base font-bold text-center" style={{ color: allPlayed ? "#fff" : "#64748B" }}>
          Suivant →
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
