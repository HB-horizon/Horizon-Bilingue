import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import Animated, { FadeIn, BounceIn } from "react-native-reanimated";
import { LetterTrace } from "@/components/common/letter-trace";

type WritingSectionProps = {
  letter: string;
  latinName: string;
  onNext: () => void;
};

export function WritingSection({ letter, latinName, onNext }: WritingSectionProps) {
  const [score, setScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleComplete = (s: number) => {
    setScore(s);
    setAttempts((prev) => prev + 1);
  };

  const passed = score !== null && score >= 60;

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-6 pt-6">
      <View className="flex-1 items-center">
        <Text className="text-sm font-semibold text-center mb-1" style={{ color: "#64748B" }}>
          Étape 4
        </Text>
        <Text className="text-xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
          Trace la Lettre
        </Text>
        <Text className="text-xs text-center mb-6" style={{ color: "#94A3B8" }}>
          Suis le guide avec ton doigt pour tracer la lettre
        </Text>

        <LetterTrace letter={letter} latinName={latinName} onComplete={handleComplete} />

        {attempts > 1 && !passed && (
          <Animated.View entering={BounceIn.springify()} className="mt-4 rounded-2xl p-3" style={{ backgroundColor: "#78350F", borderWidth: 1, borderColor: "#F59E0B" }}>
            <Text className="text-xs text-center font-semibold" style={{ color: "#FDE68A" }}>
              💡 Regarde bien la lettre en transparence et suis ses contours avec ton doigt.
            </Text>
          </Animated.View>
        )}
      </View>

      {passed ? (
        <Animated.View entering={FadeIn.duration(300)}>
          <TouchableOpacity
            onPress={onNext}
            activeOpacity={0.85}
            className="py-4 rounded-2xl mb-8 mt-4"
            style={{
              backgroundColor: "#FF6B6B",
              shadowColor: "#FF6B6B",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Text className="text-white text-base font-bold text-center">Suivant →</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.85}
          className="py-4 rounded-2xl mb-8 mt-4"
          style={{ backgroundColor: "#334155" }}
        >
          <Text className="text-base font-bold text-center" style={{ color: "#64748B" }}>
            Passer (optionnel)
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
