import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { HarakatExample } from "@/types/lesson";
import Animated, { FadeIn, SlideInRight, BounceIn } from "react-native-reanimated";
import { useState, useCallback } from "react";
import { playDecomposedLetterSound } from "@/lib/audio-manager";
import { ListenRepeatButton } from "@/components/common/listen-repeat-button";

type SoundsSectionProps = {
  sounds: HarakatExample[];
  onNext: () => void;
};

const SOUND_COLORS = ["#FF6B6B", "#F59E0B", "#06B6D4"];

export function SoundsSection({ sounds, onNext }: SoundsSectionProps) {
  const [playedSounds, setPlayedSounds] = useState<Set<number>>(new Set());
  const [speechResults, setSpeechResults] = useState<Record<number, boolean>>({});
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handleSoundPlay = async (index: number) => {
    if (playingIndex !== null) return;
    const sound = sounds[index];
    const letter = sound.arabic.charAt(0);
    let harakat: "fatha" | "damma" | "kasra" = "fatha";
    if (sound.trans.includes("ou")) harakat = "damma";
    else if (sound.trans.includes("i")) harakat = "kasra";
    setPlayingIndex(index);
    await playDecomposedLetterSound(letter, harakat);
    setPlayingIndex(null);
    setPlayedSounds((prev) => new Set(prev).add(index));
  };

  const handleSpeechResult = useCallback((index: number, correct: boolean) => {
    setSpeechResults((prev) => ({ ...prev, [index]: correct }));
  }, []);

  const allPlayed = playedSounds.size === sounds.length;
  const correctCount = Object.values(speechResults).filter(Boolean).length;

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-6 pt-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.Text
          entering={FadeIn.duration(400)}
          className="text-sm font-semibold text-center mb-1"
          style={{ color: "#64748B" }}
        >
          Étape 2
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(100).duration(400)}
          className="text-xl font-extrabold text-center mb-1"
          style={{ color: "#F1F5F9" }}
        >
          Les 3 Sons
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(200).duration(400)}
          className="text-xs text-center mb-6"
          style={{ color: "#94A3B8" }}
        >
          Écoute chaque son et clique pour valider
        </Animated.Text>

        <View className="gap-3 mb-6">
          {sounds.map((sound, index) => {
            const played = playedSounds.has(index);
            const isPlaying = playingIndex === index;
            const color = SOUND_COLORS[index % SOUND_COLORS.length];
            const speechResult = speechResults[index];
            return (
              <Animated.View
                key={index}
                entering={SlideInRight.delay(index * 150).springify()}
              >
                <TouchableOpacity
                  onPress={() => handleSoundPlay(index)}
                  activeOpacity={0.85}
                  disabled={isPlaying}
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "#1E293B",
                    borderWidth: 2,
                    borderColor: speechResult === true ? "#10B981" : speechResult === false ? "#EF4444" : isPlaying ? color : played ? "#10B981" : `${color}40`,
                    transform: [{ scale: isPlaying ? 0.97 : 1 }],
                  }}
                >
                  <View className="flex-row items-center">
                    <View className="flex-1 items-center">
                      <Text className="text-center" style={{ fontSize: 52, color: "#F1F5F9" }}>
                        {sound.arabic}
                      </Text>
                    </View>

                    <View
                      className="w-14 h-14 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: speechResult === true ? "#10B981" : speechResult === false ? "#EF4444" : isPlaying ? color : played ? "#10B981" : `${color}80`,
                        transform: [{ scale: isPlaying ? 1.15 : 1 }],
                      }}
                    >
                      <Animated.Text
                        entering={isPlaying ? BounceIn.springify() : undefined}
                        className="text-2xl"
                      >
                        {speechResult === true ? "✓" : speechResult === false ? "✗" : isPlaying ? "🔊" : "🔊"}
                      </Animated.Text>
                    </View>
                  </View>

                  {played ? (
                    <Animated.View entering={BounceIn.springify()} className="mt-3">
                      <ListenRepeatButton
                        expectedText={sound.arabic}
                        onResult={(result) => handleSpeechResult(index, result.isCorrect)}
                      />
                    </Animated.View>
                  ) : null}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Status */}
        <Animated.View
          entering={BounceIn.springify()}
          className="rounded-2xl p-4"
          style={{
            backgroundColor: allPlayed ? "#064E3B" : "#78350F",
            borderWidth: 1,
            borderColor: allPlayed ? "#10B981" : "#F59E0B",
          }}
        >
          <Text
            className="text-sm text-center font-semibold"
            style={{ color: allPlayed ? "#6EE7B7" : "#FDE68A" }}
          >
            {allPlayed
              ? `🎉 ${correctCount}/${sounds.length} sons prononcés correctement !`
              : `🔊 Écoute les ${sounds.length} sons pour continuer`}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Next */}
      <Animated.View entering={FadeIn.delay(300)}>
        <TouchableOpacity
          onPress={onNext}
          disabled={!allPlayed}
          activeOpacity={0.85}
          className="py-4 rounded-2xl mb-8 mt-4"
          style={{
            backgroundColor: allPlayed ? "#FF6B6B" : "#334155",
            shadowColor: allPlayed ? "#FF6B6B" : undefined,
            shadowOffset: allPlayed ? { width: 0, height: 4 } : undefined,
            shadowOpacity: allPlayed ? 0.4 : 0,
            shadowRadius: allPlayed ? 12 : 0,
            elevation: allPlayed ? 6 : 0,
          }}
        >
          <Text
            className="text-base font-bold text-center"
            style={{ color: allPlayed ? "#fff" : "#64748B" }}
          >
            Suivant →
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
