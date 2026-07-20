import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ExerciseWord } from "@/types/lesson";
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated";
import { useState } from "react";
import { playWordSound } from "@/lib/audio-manager";

type ExerciseSectionProps = {
  words: ExerciseWord[];
  onNext: () => void;
};

export function ExerciseSection({ words, onNext }: ExerciseSectionProps) {
  const [playedWords, setPlayedWords] = useState<Set<number>>(new Set());

  const handleWordPlay = async (index: number) => {
    await playWordSound(words[index].arabic);
    setPlayedWords((prev) => new Set(prev).add(index));
  };

  const allPlayed = playedWords.size === words.length;

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
                    borderColor: played ? "#10B981" : "#334155",
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
                      style={{ backgroundColor: played ? "#10B981" : "#FF6B6B" }}
                    >
                      <Text className="text-lg">{played ? "✓" : "🔊"}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Status */}
        <View
          className="rounded-2xl p-4"
          style={{
            backgroundColor: allPlayed ? "#064E3B" : "#78350F",
            borderWidth: 1,
            borderColor: allPlayed ? "#10B981" : "#F59E0B",
          }}
        >
          <Text className="text-sm text-center font-semibold" style={{ color: allPlayed ? "#6EE7B7" : "#FDE68A" }}>
            {allPlayed
              ? "🎉 Excellent ! Tous les mots sont pratiqués !"
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
