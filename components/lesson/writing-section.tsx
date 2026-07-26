import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import Animated, { FadeIn, FadeInDown, BounceIn } from "react-native-reanimated";
import { LetterTrace } from "@/components/common/letter-trace";
import { LetterForms } from "@/types/lesson";

type WritingSectionProps = {
  letter: string;
  latinName: string;
  forms: LetterForms;
  onNext: () => void;
};

type FormKey = keyof LetterForms;

const FORM_META: Record<FormKey, { label: string; description: string; color: string }> = {
  isolated: { label: "Seule", description: "La lettre toute seule", color: "#FF6B6B" },
  beginning: { label: "Début", description: "En début de mot", color: "#F59E0B" },
  middle: { label: "Milieu", description: "Au milieu du mot", color: "#06B6D4" },
  end: { label: "Fin", description: "En fin de mot", color: "#8B5CF6" },
};

export function WritingSection({ letter, latinName, forms, onNext }: WritingSectionProps) {
  const [score, setScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [selectedForm, setSelectedForm] = useState<FormKey>("isolated");
  const [completedForms, setCompletedForms] = useState<Set<FormKey>>(new Set());

  const formKeys: FormKey[] = ["isolated", "beginning", "middle", "end"];
  const currentForm = forms[selectedForm];
  const currentMeta = FORM_META[selectedForm];

  const handleComplete = (s: number) => {
    setScore(s);
    setAttempts((prev) => prev + 1);
    if (s >= 60) {
      setCompletedForms((prev) => new Set(prev).add(selectedForm));
    }
  };

  const passed = score !== null && score >= 60;

  const handleFormSwitch = (key: FormKey) => {
    setSelectedForm(key);
    setScore(null);
    setAttempts(0);
  };

  const allCompleted = formKeys.every((k) => completedForms.has(k));
  const completedCount = formKeys.filter((k) => completedForms.has(k)).length;

  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-5 pt-4">
      <Animated.View entering={FadeInDown.delay(100).duration(400)} className="flex-row items-center justify-center gap-2 mb-3">
        <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: "#8B5CF6" }} />
        <Text className="text-xs font-bold" style={{ color: "#8B5CF6" }}>
          Étape 4 · Écriture
        </Text>
        <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: "#8B5CF6" }} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} className="items-center mb-4">
        <Text className="text-xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
          Trace la Lettre
        </Text>
        <Text className="text-xs text-center" style={{ color: "#94A3B8" }}>
          {completedCount}/{formKeys.length} formes maîtrisées
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(400)} className="flex-row gap-2 mb-4 px-1">
        {formKeys.map((key) => {
          const meta = FORM_META[key];
          const isSelected = key === selectedForm;
          const isDone = completedForms.has(key);
          return (
            <TouchableOpacity
              key={key}
              onPress={() => handleFormSwitch(key)}
              activeOpacity={0.7}
              className="flex-1 py-2.5 rounded-xl items-center"
              style={{
                backgroundColor: isSelected ? `${meta.color}25` : "#1E293B",
                borderWidth: 1.5,
                borderColor: isSelected ? meta.color : isDone ? "#10B981" : "#334155",
              }}
            >
              <Text
                className="text-lg font-bold"
                style={{ color: isSelected ? meta.color : isDone ? "#10B981" : "#64748B" }}
              >
                {forms[key]}
              </Text>
              <Text
                className="text-[10px] font-semibold mt-0.5"
                style={{ color: isSelected ? meta.color : "#94A3B8" }}
              >
                {meta.label}
              </Text>
              {isDone && (
                <Text className="text-[10px]" style={{ color: "#10B981" }}>✓</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(400)}
        className="rounded-xl p-3 mb-4 mx-1"
        style={{ backgroundColor: `${currentMeta.color}15`, borderLeftWidth: 3, borderLeftColor: currentMeta.color }}
      >
        <Text className="text-xs font-semibold" style={{ color: currentMeta.color }}>
          {currentMeta.label} — {currentMeta.description}
        </Text>
        <Text className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
          Trace : <Text style={{ color: "#F1F5F9", fontWeight: "bold" }}>{currentForm}</Text>
        </Text>
      </Animated.View>

      <View className="flex-1 items-center">
        <LetterTrace
          letter={currentForm}
          latinName={latinName}
          onComplete={handleComplete}
        />

        {attempts > 1 && !passed && (
          <Animated.View entering={BounceIn.springify()} className="mt-3 rounded-2xl p-3" style={{ backgroundColor: "#78350F", borderWidth: 1, borderColor: "#F59E0B" }}>
            <Text className="text-xs text-center font-semibold" style={{ color: "#FDE68A" }}>
              💡 Regarde bien la lettre en transparence et suis ses contours avec ton doigt.
            </Text>
          </Animated.View>
        )}
      </View>

      {allCompleted ? (
        <Animated.View entering={FadeIn.duration(300)}>
          <TouchableOpacity
            onPress={onNext}
            activeOpacity={0.85}
            className="py-4 rounded-2xl mb-6 mt-3"
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
          className="py-4 rounded-2xl mb-6 mt-3"
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
