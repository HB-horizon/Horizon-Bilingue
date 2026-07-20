import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { HarakatExample } from "@/types/lesson";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { useState } from "react";
import { playLetterSound } from "@/lib/audio-manager";

type SoundsSectionProps = {
  sounds: HarakatExample[];
  onNext: () => void;
};

const SOUND_COLORS = ["#FF6B6B", "#F59E0B", "#06B6D4"];

export function SoundsSection({ sounds, onNext }: SoundsSectionProps) {
  const [playedSounds, setPlayedSounds] = useState<Set<number>>(new Set());

  const handleSoundPlay = async (index: number) => {
    const sound = sounds[index];
    const letter = sound.arabic.charAt(0);
    let harakat: "fatha" | "damma" | "kasra" = "fatha";
    if (sound.trans.includes("ou")) harakat = "damma";
    else if (sound.trans.includes("i")) harakat = "kasra";
    await playLetterSound(letter, harakat);
    setPlayedSounds((prev) => new Set(prev).add(index));
  };

  const allPlayed = playedSounds.size === sounds.length;

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-6 pt-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="text-sm font-semibold text-center mb-1" style={{ color: "#64748B" }}>
          Étape 2
        </Text>
        <Text className="text-xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
          Les 3 Sons
        </Text>
        <Text className="text-xs text-center mb-6" style={{ color: "#94A3B8" }}>
          Écoute chaque son et clique pour valider
        </Text>

        <View className="gap-3 mb-6">
          {sounds.map((sound, index) => {
            const played = playedSounds.has(index);
            const color = SOUND_COLORS[index % SOUND_COLORS.length];
            return (
              <Animated.View
                key={index}
                entering={SlideInRight.delay(index * 120).springify()}
              >
                <TouchableOpacity
                  onPress={() => handleSoundPlay(index)}
                  activeOpacity={0.8}
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "#1E293B",
                    borderWidth: 2,
                    borderColor: played ? "#10B981" : `${color}40`,
                  }}
                >
                  <View className="flex-row items-center">
                    {/* Arabic text */}
                    <View className="flex-1 items-center">
                      <Text className="text-center" style={{ fontSize: 52, color: "#F1F5F9" }}>
                        {sound.arabic}
                      </Text>
                      <Text className="text-sm mt-1" style={{ color: "#94A3B8" }}>
                        ({sound.trans})
                      </Text>
                    </View>

                    {/* Play button */}
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center"
                      style={{ backgroundColor: played ? "#10B981" : color }}
                    >
                      <Text className="text-2xl">{played ? "✓" : "🔊"}</Text>
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
              ? "🎉 Bravo ! Tous les sons sont maîtrisés !"
              : `🔊 Écoute les ${sounds.length} sons pour continuer`}
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
