import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ReadingRule } from "@/types/lesson";
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInRight } from "react-native-reanimated";
import { useState } from "react";
import { playWordSound } from "@/lib/audio-manager";

type ReadingRulesSectionProps = {
  rules: ReadingRule[];
  onNext: () => void;
};

const RULE_ACCENTS = ["#FF6B6B", "#06B6D4", "#8B5CF6", "#10B981", "#F59E0B"];

export function ReadingRulesSection({ rules, onNext }: ReadingRulesSectionProps) {
  const [playingExample, setPlayingExample] = useState<number | null>(null);
  const [expandedRule, setExpandedRule] = useState<number | null>(null);

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

  const toggleRule = (index: number) => {
    setExpandedRule(expandedRule === index ? null : index);
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-5 pt-4">
      <Animated.View entering={FadeInDown.delay(100).duration(400)} className="flex-row items-center justify-center gap-2 mb-3">
        <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: "#06B6D4" }} />
        <Text className="text-xs font-bold" style={{ color: "#06B6D4" }}>
          Règles de Lecture
        </Text>
        <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: "#06B6D4" }} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} className="items-center mb-5">
        <Text className="text-xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
          {rules.length === 1 ? rules[0].name : "Les Règles de Lecture"}
        </Text>
        <Text className="text-xs text-center" style={{ color: "#94A3B8" }}>
          Écoute, observe et comprends chaque règle
        </Text>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-3 mb-6">
          {rules.map((rule, index) => {
            const accent = RULE_ACCENTS[index % RULE_ACCENTS.length];
            const isExpanded = expandedRule === index;

            return (
              <Animated.View
                key={index}
                entering={SlideInRight.delay(index * 120).springify()}
              >
                <TouchableOpacity
                  onPress={() => toggleRule(index)}
                  activeOpacity={0.8}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: "#1E293B",
                    borderWidth: 1.5,
                    borderColor: isExpanded ? accent : "#334155",
                  }}
                >
                  <View className="p-4">
                    <View className="flex-row items-center gap-3 mb-2">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: `${accent}20` }}
                      >
                        <Text className="text-lg">📖</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold" style={{ color: "#F1F5F9" }}>
                          {rule.name}
                        </Text>
                        <Text className="text-xs" style={{ color: "#94A3B8" }}>
                          {rule.description}
                        </Text>
                      </View>
                      <Text className="text-lg" style={{ color: "#64748B" }}>
                        {isExpanded ? "−" : "+"}
                      </Text>
                    </View>
                  </View>

                  {isExpanded && (
                    <Animated.View
                      entering={FadeIn.duration(300)}
                      style={{ backgroundColor: "#0F172A" }}
                    >
                      <View className="p-4">
                        {rule.example && (
                          <View
                            className="rounded-xl p-4 mb-3"
                            style={{ backgroundColor: "#1E293B", borderWidth: 1, borderColor: `${accent}40` }}
                          >
                            <View className="flex-row items-center justify-between">
                              <View className="flex-1 items-center">
                                <Text className="text-xs mb-1" style={{ color: "#64748B" }}>
                                  Exemple
                                </Text>
                                <Text style={{ fontSize: 42, color: "#F1F5F9" }}>
                                  {rule.example}
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() => handleExampleSpeak(index)}
                                activeOpacity={0.7}
                                className="w-12 h-12 rounded-full items-center justify-center"
                                style={{
                                  backgroundColor: playingExample === index ? "#334155" : accent,
                                  shadowColor: accent,
                                  shadowOffset: { width: 0, height: 2 },
                                  shadowOpacity: 0.3,
                                  shadowRadius: 6,
                                  elevation: 4,
                                }}
                              >
                                <Text className="text-xl">
                                  {playingExample === index ? "⏳" : "🔊"}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}

                        <View
                          className="rounded-xl p-3"
                          style={{ backgroundColor: "#1E293B", borderLeftWidth: 3, borderLeftColor: accent }}
                        >
                          <Text className="text-xs leading-5" style={{ color: "#CBD5E1" }}>
                            {rule.explanation}
                          </Text>
                        </View>
                      </View>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(400).duration(400)}>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.85}
          className="py-4 rounded-2xl mb-6 mt-4"
          style={{
            backgroundColor: "#FF6B6B",
            shadowColor: "#FF6B6B",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text className="text-base font-bold text-center text-white">
            Suivant →
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
