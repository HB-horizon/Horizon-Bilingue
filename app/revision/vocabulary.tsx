import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useMemo } from 'react';
import { quranVocabulary, vocabularyCategories, getWordsByCategory } from '@/data/quran-vocabulary';
import VocabularyCard from '@/components/vocabulary/vocabulary-card';
import type { VocabularyCategory } from '@/types/vocabulary';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function VocabularyRevisionScreen() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(vocabularyCategories.map(c => c.id))
  );
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRandom, setIsRandom] = useState(false);

  const filteredWords = useMemo(() => {
    if (selectedCategories.size === 0) return [];
    return quranVocabulary.filter(w => selectedCategories.has(w.category));
  }, [selectedCategories]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleStart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStarted(true);
  };

  const handleFlip = () => setIsFlipped(f => !f);

  const handlePrev = () => {
    setCurrentIndex(i => (i - 1 + filteredWords.length) % filteredWords.length);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (isRandom) {
      setCurrentIndex(Math.floor(Math.random() * filteredWords.length));
    } else {
      setCurrentIndex(i => (i + 1) % filteredWords.length);
    }
    setIsFlipped(false);
  };

  if (!started) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View className="bg-surface border-b border-border px-4 py-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="active:opacity-70">
              <Text className="text-primary text-lg font-bold">← Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/')} className="active:opacity-70 p-2">
              <Text className="text-xl">🏠</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="flex-1 p-6">
          <View className="items-center mb-6">
            <Text className="text-4xl mb-2">📚</Text>
            <Text className="text-2xl font-bold text-foreground text-center mb-2">
              Révision du Vocabulaire
            </Text>
            <Text className="text-base text-muted text-center">
              Choisis les catégories à réviser ({filteredWords.length} mots sélectionnés)
            </Text>
          </View>

          <View className="gap-2 mb-6">
            {vocabularyCategories.map(cat => {
              const wordCount = getWordsByCategory(cat.id).length;
              const isSelected = selectedCategories.has(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => toggleCategory(cat.id)}
                  className={`p-4 rounded-2xl border-2 flex-row items-center active:opacity-70 ${
                    isSelected ? 'bg-surface border-primary' : 'bg-muted/10 border-border'
                  }`}
                >
                  <Text className="text-2xl mr-3">{cat.emoji}</Text>
                  <View className="flex-1">
                    <Text className={`font-bold ${isSelected ? 'text-foreground' : 'text-muted'}`}>
                      {cat.name}
                    </Text>
                    <Text className={`text-sm ${isSelected ? 'text-muted' : 'text-muted/50'}`}>
                      {wordCount} mots
                    </Text>
                  </View>
                  <Text className={`text-xl ${isSelected ? 'text-primary' : 'text-muted/30'}`}>
                    {isSelected ? '✓' : '○'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleStart}
            disabled={filteredWords.length === 0}
            className={`rounded-full py-4 px-8 shadow-lg ${
              filteredWords.length > 0 ? 'bg-primary active:opacity-80' : 'bg-muted'
            }`}
          >
            <Text className="text-white text-xl font-bold text-center">
              Commencer la révision ({filteredWords.length} mots)
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const currentWord = filteredWords[currentIndex];

  return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <View className="bg-surface border-b border-border px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => setStarted(false)} className="active:opacity-70">
            <Text className="text-primary text-lg font-bold">← Catégories</Text>
          </TouchableOpacity>
          <Text className="text-foreground font-bold">
            {currentIndex + 1}/{filteredWords.length}
          </Text>
          <TouchableOpacity
            onPress={() => setIsRandom(r => !r)}
            className={`px-3 py-1 rounded-full ${isRandom ? 'bg-primary' : 'bg-muted'}`}
          >
            <Text className="text-white text-sm font-bold">
              {isRandom ? '🔀 Aléa' : '➡️ Ordre'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View entering={FadeIn.duration(600)} className="flex-1 items-center justify-center p-6">
        <Text className="text-base text-muted mb-6 text-center">
          Clique sur la carte pour la retourner
        </Text>

        <VocabularyCard
          word={currentWord}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />

        <View className="flex-row gap-4 mt-8">
          <TouchableOpacity
            onPress={handlePrev}
            className="bg-surface border-2 border-primary rounded-full w-16 h-16 items-center justify-center active:opacity-70"
          >
            <Text className="text-3xl">←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFlip}
            className="bg-primary rounded-full px-8 py-4 items-center justify-center active:opacity-80"
          >
            <Text className="text-white text-lg font-bold">🔄 Retourner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-surface border-2 border-primary rounded-full w-16 h-16 items-center justify-center active:opacity-70"
          >
            <Text className="text-3xl">→</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScreenContainer>
  );
}
