import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { day30Fatiha } from '@/data/day-30-fatiha';
import { useProgress } from '@/hooks/use-progress';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { playWordSound } from '@/lib/audio-manager';

export default function Day30Screen() {
  const router = useRouter();
  const { progress, completeDay } = useProgress();
  const [showCelebration, setShowCelebration] = useState(false);
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);

  const completed = progress?.completedDays.length ?? 0;
  const allCompleted = completed >= 29;
  const percentage = Math.round((completed / 29) * 100);

  const handleFinish = async () => {
    await completeDay(30);
    setShowCelebration(true);
  };

  const handleBackToDashboard = () => {
    router.replace('/dashboard');
  };

  const handlePlayVerse = async (verseNumber: number, arabic: string) => {
    if (playingVerse !== null) return;
    setPlayingVerse(verseNumber);
    try {
      await playWordSound(arabic);
    } catch (e) {
      console.warn('[Day30] Verse audio failed:', e);
    }
    setPlayingVerse(null);
  };

  if (showCelebration) {
    return (
      <ScreenContainer>
        <Animated.View
          entering={FadeIn.duration(800)}
          className="flex-1 p-6 justify-center items-center"
        >
          <View className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <Text
                key={i}
                className="text-4xl absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                {['🎉', '⭐', '✨', '🌟', '💫', '🏆'][Math.floor(Math.random() * 6)]}
              </Text>
            ))}
          </View>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="items-center"
          >
            <Text className="text-5xl mb-6">🏆</Text>
            <Text className="text-4xl font-bold text-center mb-4" style={{ color: "#F1F5F9" }}>
              FÉLICITATIONS !
            </Text>
            <Text className="text-xl text-center mb-6" style={{ color: "#FCD34D" }}>
              {allCompleted
                ? "Tu as terminé les 30 jours !"
                : "Tu as découvert Al-Fatiha !"}
            </Text>

            <View className="p-8 rounded-2xl mb-8" style={{ backgroundColor: "#1E293B", borderWidth: 2, borderColor: "#FCD34D" }}>
              <Text className="text-xl text-center font-bold mb-4" style={{ color: "#F1F5F9" }}>
                {allCompleted ? "🎓 Diplôme d'Excellence" : "📖 Découverte"}
              </Text>
              <Text className="text-base text-center leading-relaxed" style={{ color: "#94A3B8" }}>
                {allCompleted
                  ? "Tu as maîtrisé les 29 lettres de l'alphabet arabe et tu peux maintenant lire la Sourate Al-Fatiha !"
                  : "Tu as découvert les versets de la Fatiha. Continue à apprendre les lettres pour les lire par toi-même !"}
              </Text>
              {allCompleted && (
                <Text className="text-center mt-4 text-lg" style={{ color: "#FCD34D" }}>
                  ✨ Tu es un champion ! ✨
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleBackToDashboard}
              className="py-4 px-8 rounded-full"
              style={{ backgroundColor: "#10B981" }}
            >
              <Text className="text-white text-xl font-bold">
                Retour au tableau de bord
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-6" style={{ backgroundColor: "#0F172A" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4"
          >
            <Text style={{ color: "#94A3B8" }} className="text-base">← Retour</Text>
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-center mb-2" style={{ color: "#F1F5F9" }}>
            Sourate Al-Fatiha
          </Text>
          <Text className="text-lg text-center" style={{ color: "#94A3B8" }}>
            L&apos;Ouverture
          </Text>
        </View>

        {/* Progress banner */}
        <View
          className="p-4 mx-6 mt-6 rounded-2xl"
          style={{
            backgroundColor: allCompleted ? "#064E3B" : "#78350F",
            borderWidth: 1,
            borderColor: allCompleted ? "#10B981" : "#F59E0B",
          }}
        >
          {allCompleted ? (
            <View className="items-center">
              <Text className="text-lg mb-1">🎉</Text>
              <Text className="text-sm font-bold text-center" style={{ color: "#6EE7B7" }}>
                Bravo ! Tu as appris les 29 lettres !
              </Text>
              <Text className="text-xs text-center mt-1" style={{ color: "#6EE7B7" }}>
                Tu peux maintenant lire la Fatiha par toi-même.
              </Text>
            </View>
          ) : (
            <View>
              <View className="flex-row items-center justify-center gap-2 mb-2">
                <Text className="text-lg">📚</Text>
                <Text className="text-sm font-bold" style={{ color: "#FDE68A" }}>
                  {completed}/29 lettres apprises ({percentage}%)
                </Text>
              </View>
              <View className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "#334155" }}>
                <View
                  className="h-full rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: "#F59E0B" }}
                />
              </View>
              <Text className="text-xs text-center" style={{ color: "#FDE68A" }}>
                Tu peux écouter la Fatiha, mais continue à apprendre les lettres pour la lire par toi-même !
              </Text>
            </View>
          )}
        </View>

        {/* Introduction */}
        <View className="p-6">
          <Text className="text-base text-center leading-6" style={{ color: "#CBD5E1" }}>
            {allCompleted
              ? "🎉 Félicitations ! Tu as appris les 29 lettres de l'alphabet arabe. Aujourd'hui, tu vas lire ta première sourate complète : Al-Fatiha !"
              : "📖 La Sourate Al-Fatiha est la première sourate du Coran et la plus importante. Elle est récitée dans chaque prière quotidienne. Tu peux l'écouter et lire les traductions pendant ton apprentissage."}
          </Text>
        </View>

        {/* Versets */}
        <View className="px-6">
          <Text className="text-xl font-bold mb-5 text-center" style={{ color: "#F1F5F9" }}>
            📖 Les 7 Versets
          </Text>

          {day30Fatiha.verses.map((verse, index) => (
            <Animated.View
              key={verse.number}
              entering={FadeIn.delay(index * 100)}
              className="mb-5"
            >
              <View
                className="p-5 rounded-2xl"
                style={{
                  backgroundColor: "#1E293B",
                  borderWidth: 1,
                  borderColor: "#334155",
                }}
              >
                <View className="items-center mb-3">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#FF6B6B" }}
                  >
                    <Text className="text-white font-bold text-sm">
                      {verse.number}
                    </Text>
                  </View>
                </View>

                <Text className="text-2xl text-center mb-3 leading-loose" style={{ color: "#F1F5F9" }}>
                  {verse.arabic}
                </Text>

                <Text className="text-sm text-center mb-3 italic" style={{ color: "#FF6B6B" }}>
                  {verse.transliteration}
                </Text>

                <View className="p-3 rounded-xl" style={{ backgroundColor: "#0F172A" }}>
                  <Text className="text-sm text-center leading-5" style={{ color: "#94A3B8" }}>
                    {verse.translation}
                  </Text>
                </View>

                <TouchableOpacity
                  className="mt-3 py-2.5 rounded-xl"
                  style={{
                    backgroundColor: playingVerse === verse.number ? "#334155" : "#FF6B6B",
                  }}
                  onPress={() => handlePlayVerse(verse.number, verse.arabic)}
                  disabled={playingVerse !== null}
                >
                  <Text className="text-white text-center font-bold text-sm">
                    {playingVerse === verse.number ? '⏳ Écoute...' : '🔊 Écouter'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Section adaptée au progrès */}
        {allCompleted ? (
          <Animated.View
            entering={FadeInDown.delay(400)}
            className="mx-6 mt-4 p-5 rounded-2xl"
            style={{ backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#10B981" }}
          >
            <Text className="text-lg font-bold mb-3 text-center" style={{ color: "#F1F5F9" }}>
              💡 Ce que tu as accompli
            </Text>
            <View className="gap-2">
              {[
                { icon: "✅", text: "29 lettres maîtrisées" },
                { icon: "✅", text: "Plus de 180 mots pratiqués" },
                { icon: "✅", text: "Les 3 voyelles (Fat7a, Damma, Kasra)" },
                { icon: "✅", text: "Les prolongations" },
                { icon: "✅", text: "Les 4 formes de chaque lettre" },
              ].map((item, i) => (
                <View key={i} className="flex-row items-center gap-2">
                  <Text>{item.icon}</Text>
                  <Text className="text-sm" style={{ color: "#CBD5E1" }}>{item.text}</Text>
                </View>
              ))}
            </View>

            <Text className="text-lg font-bold mt-5 mb-2 text-center" style={{ color: "#F1F5F9" }}>
              🚀 Prochaines étapes
            </Text>
            <View className="gap-2">
              {[
                "Continue à pratiquer la lecture",
                "Révise régulièrement les lettres",
                "Apprends d'autres sourates courtes",
                "Pratique l'écriture sur papier",
              ].map((item, i) => (
                <View key={i} className="flex-row items-center gap-2">
                  <Text style={{ color: "#10B981" }}>•</Text>
                  <Text className="text-sm" style={{ color: "#CBD5E1" }}>{item}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.delay(400)}
            className="mx-6 mt-4 p-5 rounded-2xl"
            style={{ backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#F59E0B" }}
          >
            <Text className="text-lg font-bold mb-2 text-center" style={{ color: "#F1F5F9" }}>
              💡 En savoir plus
            </Text>
            <Text className="text-sm text-center leading-5 mb-4" style={{ color: "#CBD5E1" }}>
              La Fatiha comprend 7 versets en arabe. Pour la lire par toi-même, tu dois d&apos;abord apprendre les 29 lettres de l&apos;alphabet arabe.
            </Text>

            <Text className="text-sm font-bold mb-2" style={{ color: "#F59E0B" }}>
              Ce qu&apos;il te reste à apprendre :
            </Text>
            <View className="gap-1.5">
              {[
                `Encore ${29 - completed} lettre${29 - completed > 1 ? "s" : ""} à découvrir`,
                "Les formes de chaque lettre (début, milieu, fin)",
                "Les voyelles et les règles de lecture",
                "L'écriture de chaque lettre",
              ].map((item, i) => (
                <View key={i} className="flex-row items-center gap-2">
                  <Text style={{ color: "#F59E0B" }}>•</Text>
                  <Text className="text-xs" style={{ color: "#CBD5E1" }}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => router.push("/dashboard")}
              className="mt-4 py-3 rounded-xl"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              <Text className="text-white text-center font-bold text-sm">
                Continuer l&apos;apprentissage →
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {allCompleted && (
          <View className="p-6">
            <TouchableOpacity
              onPress={handleFinish}
              className="py-5 rounded-full"
              style={{
                backgroundColor: "#10B981",
                shadowColor: "#10B981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text className="text-white text-xl font-bold text-center">
                🎓 Terminer le programme
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
}
