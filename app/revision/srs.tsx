import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import Animated, { FadeIn, SlideInRight, BounceIn } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { getDueSRSItems, reviewSRSItem, getSRSStats, type SRSItem } from "@/lib/srs-manager";
import { playDecomposedLetterSound, playWordSound } from "@/lib/audio-manager";
import { isSpeechSupported, speechListen } from "@/lib/speech-recognition";

type ReviewPhase = 'countdown' | 'front' | 'answer' | 'done';

export default function SRSRevisionScreen() {
  const router = useRouter();
  const [items, setItems] = useState<SRSItem[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<ReviewPhase>('countdown');
  const [stats, setStats] = useState({ total: 0, due: 0, mastered: 0, learning: 0 });
  const [loading, setLoading] = useState(true);
  const [speechFeedback, setSpeechFeedback] = useState<'idle' | 'listening' | 'correct' | 'incorrect'>('idle');

  const loadData = useCallback(async () => {
    const due = await getDueSRSItems();
    setItems(due);
    setStats(await getSRSStats());
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const current = items[index];
  const remaining = items.length - index;

  const handlePlay = async () => {
    if (!current) return;
    if (current.type === 'letter') {
      await playDecomposedLetterSound(current.text, 'fatha');
    } else {
      await playWordSound(current.text);
    }
  };

  const handleReveal = () => {
    setPhase('answer');
  };

  const handleGrade = async (quality: 1 | 3 | 5) => {
    if (!current) return;
    await reviewSRSItem(current.id, quality);
    if (index + 1 < items.length) {
      setIndex((i) => i + 1);
      setPhase('front');
      setSpeechFeedback('idle');
    } else {
      setPhase('done');
      setStats(await getSRSStats());
    }
  };

  const handleSpeech = async () => {
    if (!current || speechFeedback !== 'idle') return;
    setSpeechFeedback('listening');
    try {
      const result = await speechListen(current.text, { lang: 'ar' });
      if (result.isCorrect) {
        setSpeechFeedback('correct');
        setTimeout(() => handleGrade(5), 1200);
      } else {
        setSpeechFeedback('incorrect');
      }
    } catch {
      setSpeechFeedback('idle');
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-lg text-muted">Chargement...</Text>
      </ScreenContainer>
    );
  }

  if (items.length === 0 && phase !== 'done') {
    return (
      <ScreenContainer className="items-center justify-center px-6">
        <Animated.View entering={FadeIn.duration(500)} className="items-center">
          <Text className="text-6xl mb-4">🎉</Text>
          <Text className="text-xl font-extrabold text-center mb-2" style={{ color: "#F1F5F9" }}>
            Aucune révision pour le moment
          </Text>
          <Text className="text-sm text-center mb-8" style={{ color: "#94A3B8" }}>
            {stats.total > 0
              ? "Tout est à jour ! Reviens plus tard pour réviser."
              : "Termine une leçon pour commencer à réviser !"}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-3 px-8 rounded-2xl"
            style={{ backgroundColor: "#FF6B6B" }}
          >
            <Text className="text-white font-bold">Retour</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScreenContainer>
    );
  }

  if (phase === 'done') {
    return (
      <ScreenContainer className="items-center justify-center px-6">
        <Animated.View entering={FadeIn.duration(500)} className="items-center">
          <Text className="text-6xl mb-4">🏆</Text>
          <Text className="text-xl font-extrabold text-center mb-2" style={{ color: "#F1F5F9" }}>
            Révision terminée !
          </Text>
          <Text className="text-sm text-center mb-2" style={{ color: "#94A3B8" }}>
            {items.length} carte{items.length > 1 ? 's' : ''} révisée{items.length > 1 ? 's' : ''}
          </Text>
          <View className="flex-row gap-4 mt-4 mb-8">
            <StatBadge label="Maîtrisées" value={stats.mastered} color="#10B981" />
            <StatBadge label="En cours" value={stats.learning} color="#F59E0B" />
            <StatBadge label="Totales" value={stats.total} color="#6366F1" />
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-3 px-8 rounded-2xl"
            style={{ backgroundColor: "#10B981" }}
          >
            <Text className="text-white font-bold">Terminé ✓</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
        {/* Header */}
        <View className="w-full mb-6">
          <Text className="text-sm font-semibold" style={{ color: "#64748B" }}>
            Révision intelligente
          </Text>
          <Text className="text-xs mt-1" style={{ color: "#94A3B8" }}>
            {remaining} carte{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          </Text>
          <View className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: "#334155" }}>
            <View
              className="h-full rounded-full"
              style={{
                width: `${((index) / items.length) * 100}%`,
                backgroundColor: "#FF6B6B",
              }}
            />
          </View>
        </View>

        {/* Card */}
        <Animated.View
          entering={SlideInRight.duration(300).springify()}
          className="w-full rounded-3xl p-8 items-center"
          style={{
            maxWidth: 360,
            backgroundColor: "#1E293B",
            borderWidth: 2,
            borderColor: current?.type === 'letter' ? "#FF6B6B" : "#6366F1",
          }}
        >
          <Text className="text-sm font-semibold mb-3" style={{ color: "#94A3B8" }}>
            {current?.type === 'letter' ? 'Lettre' : 'Mot'}
          </Text>

          <Text className="text-center" style={{ fontSize: 72, color: "#F1F5F9" }}>
            {current?.text}
          </Text>

          {current?.latin ? (
            <Text className="text-sm mt-2" style={{ color: current?.type === 'letter' ? "#FF6B6B" : "#6366F1" }}>
              {current.latin}
            </Text>
          ) : null}

          {/* Speech recognition */}
          {isSpeechSupported() ? (
            <View className="mt-6 items-center">
              <TouchableOpacity
                onPress={handleSpeech}
                disabled={speechFeedback === 'listening'}
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{
                  backgroundColor: speechFeedback === 'correct' ? '#10B981' : speechFeedback === 'incorrect' ? '#EF4444' : speechFeedback === 'listening' ? '#F59E0B' : '#6366F1',
                }}
              >
                <Text className="text-3xl">
                  {speechFeedback === 'listening' ? '🎤' : speechFeedback === 'correct' ? '✓' : speechFeedback === 'incorrect' ? '✗' : '🎤'}
                </Text>
              </TouchableOpacity>
              <Text className="text-xs mt-2" style={{ color: "#94A3B8" }}>
                {speechFeedback === 'idle' && 'Prononce au micro'}
                {speechFeedback === 'listening' && 'Écoute...'}
                {speechFeedback === 'correct' && 'Bravo !'}
                {speechFeedback === 'incorrect' && 'Essaie encore'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handlePlay}
              className="mt-6 px-6 py-3 rounded-xl flex-row items-center gap-2"
              style={{ backgroundColor: "#334155" }}
            >
              <Text className="text-white font-semibold">🔊 Écouter</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Action buttons */}
        {phase === 'front' ? (
          <Animated.View entering={FadeIn.duration(400)} className="w-full items-center mt-8">
            <TouchableOpacity
              onPress={() => { handlePlay(); handleReveal(); }}
              className="py-3 px-10 rounded-2xl mb-4"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              <Text className="text-white font-bold text-base">Voir la réponse</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View entering={BounceIn.springify()} className="w-full items-center mt-8">
            <Text className="text-sm font-semibold mb-3" style={{ color: "#94A3B8" }}>
              Comment as-tu trouvé ?
            </Text>
            <View className="flex-row gap-3">
              <GradeButton label="Encore" color="#EF4444" onPress={() => handleGrade(1)} />
              <GradeButton label="Bien" color="#F59E0B" onPress={() => handleGrade(3)} />
              <GradeButton label="Facile" color="#10B981" onPress={() => handleGrade(5)} />
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View className="items-center">
      <Text className="text-2xl font-extrabold" style={{ color }}>{value}</Text>
      <Text className="text-xs" style={{ color: "#94A3B8" }}>{label}</Text>
    </View>
  );
}

function GradeButton({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="py-3 px-5 rounded-2xl"
      style={{ backgroundColor: `${color}30`, borderWidth: 1.5, borderColor: color }}
    >
      <Text className="font-bold text-sm" style={{ color }}>{label}</Text>
    </TouchableOpacity>
  );
}
