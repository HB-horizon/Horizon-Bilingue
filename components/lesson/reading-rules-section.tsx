import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ReadingRule } from "@/types/lesson";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { useState } from "react";
import { playWordSound } from "@/lib/audio-manager";

type ReadingRulesSectionProps = {
  rules: ReadingRule[];
  onNext: () => void;
};

export function ReadingRulesSection({ rules, onNext }: ReadingRulesSectionProps) {
  const [playingExample, setPlayingExample] = useState<number | null>(null);

  const handleExampleSpeak = async (index: number) => {
    if (!rules[index].example || playingExample !== null) return;
    setPlayingExample(index);
    try {
      await playWordSound(rules[index].example!);
    } catch (err) {
      console.error("Erreur TTS:", err);
    }
    setPlayingExample(null);
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-6 pt-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-semibold text-center mb-1" style={{ color: "#64748B" }}>
          Règles de Lecture
        </Text>
        <Text className="text-xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
          {rules.length === 1 ? rules[0].name : 'Les Règles de Lecture'}
        </Text>
        <Text className="text-xs text-center mb-6" style={{ color: "#94A3B8" }}>
          Écoute chaque règle et son exemple
        </Text>

        <View className="gap-3 mb-6">
          {rules.map((rule, index) => {
            return (
              <Animated.View
                key={index}
                entering={SlideInRight.delay(index * 120).springify()}
              >
                <View
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "#1E293B",
                    borderWidth: 2,
                    borderColor: "#334155",
                  }}
                >
                  {/* Header */}
                  <Text className="text-base font-bold mb-3" style={{ color: "#F1F5F9" }}>
                    {rule.name}
                  </Text>

                  {/* Description */}
                  <Text className="text-xs leading-5 mb-3" style={{ color: "#94A3B8" }}>
                    {rule.description}
                  </Text>

                  {/* Example */}
                  {rule.example && (
                    <View
                      className="rounded-xl p-3 flex-row items-center justify-between"
                      style={{ backgroundColor: "#0F172A" }}
                    >
                      <View className="flex-1 items-center">
                        <Text className="text-xs mb-1" style={{ color: "#64748B" }}>Exemple</Text>
                        <Text style={{ fontSize: 36, color: "#F1F5F9" }}>{rule.example}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleExampleSpeak(index)}
                        activeOpacity={0.7}
                        className="w-10 h-10 rounded-full items-center justify-center ml-3"
                        style={{ backgroundColor: playingExample === index ? "#334155" : "#FF6B6B" }}
                      >
                        <Text className="text-lg">{playingExample === index ? "⏳" : "🔊"}</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Explanation */}
                  <Text className="text-xs leading-5 mt-3" style={{ color: "#CBD5E1" }}>
                    {rule.explanation}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </View>

      </ScrollView>

      {/* Next */}
      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.85}
        className="py-4 rounded-2xl mb-8 mt-4"
        style={{ backgroundColor: "#FF6B6B" }}
      >
        <Text className="text-base font-bold text-center text-white">
          Suivant →
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
