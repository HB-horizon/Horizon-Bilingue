import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { getWordsByCategory, getCategoryInfo, vocabularyCategories } from '@/data/quran-vocabulary';
import VocabularyCard from '@/components/vocabulary/vocabulary-card';
import VocabularyQuiz from '@/components/vocabulary/vocabulary-quiz';
import type { VocabularyCategory } from '@/types/vocabulary';
import Animated, { FadeIn } from 'react-native-reanimated';

type Mode = 'categories' | 'list' | 'flashcard' | 'quiz' | 'details';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const catInfo = vocabularyCategories.find(c => c.id === category);
  const words = category ? getWordsByCategory(category as VocabularyCategory) : [];

  const handleFlip = useCallback(() => setIsFlipped(f => !f), []);
  const handlePrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + words.length) % words.length);
    setIsFlipped(false);
  }, [words.length]);
  const handleNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % words.length);
    setIsFlipped(false);
  }, [words.length]);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    setQuizScore(score);
  }, []);

  if (!catInfo) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-2xl font-bold text-foreground mb-4">Catégorie introuvable</Text>
          <TouchableOpacity onPress={() => router.replace('/vocabulary')} className="bg-primary rounded-full py-3 px-8">
            <Text className="text-white text-lg font-bold">← Retour</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  if (words.length === 0) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-4xl mb-4">{catInfo.emoji}</Text>
          <Text className="text-xl font-bold text-foreground text-center mb-2">{catInfo.name}</Text>
          <Text className="text-base text-muted text-center mb-6">Aucun mot dans cette catégorie</Text>
          <TouchableOpacity onPress={() => router.replace('/vocabulary')} className="bg-primary rounded-full py-3 px-8">
            <Text className="text-white text-lg font-bold">← Retour</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <ScreenContainer edges={['top', 'left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: catInfo.name,
          headerStyle: { backgroundColor: catInfo.color },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/')} className="active:opacity-70 mr-4 p-2">
              <Text className="text-white text-xl">🏠</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Mode selector */}
      <View className="flex-row bg-surface border-b border-border">
        <TouchableOpacity
          onPress={() => { setMode('flashcard'); setIsFlipped(false); }}
          className={`flex-1 py-3 items-center ${mode === 'flashcard' ? 'border-b-2 border-primary' : ''}`}
        >
          <Text className={`font-bold ${mode === 'flashcard' ? 'text-primary' : 'text-muted'}`}>
            🃏 Flashcards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setMode('quiz'); setIsFlipped(false); }}
          className={`flex-1 py-3 items-center ${mode === 'quiz' ? 'border-b-2 border-primary' : ''}`}
        >
          <Text className={`font-bold ${mode === 'quiz' ? 'text-primary' : 'text-muted'}`}>
            ✍️ Quiz
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setMode('list'); setIsFlipped(false); }}
          className={`flex-1 py-3 items-center ${mode === 'list' ? 'border-b-2 border-primary' : ''}`}
        >
          <Text className={`font-bold ${mode === 'list' ? 'text-primary' : 'text-muted'}`}>
            📋 Liste
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info banner for 99 Noms d'Allah */}
      {category === 'noms-divins' && (
        <View className="mx-4 mt-3 mb-2 p-3 rounded-xl" style={{ backgroundColor: '#8B5CF620', borderLeftWidth: 4, borderLeftColor: '#8B5CF6' }}>
          <Text className="text-xs leading-relaxed" style={{ color: '#8B5CF6' }}>
            Les 103 entrées regroupent les 99 Noms d&apos;Allah (Asma&apos;ul Husna) ainsi que 4 noms divins supplémentaires (اللَّهُ, رَبّ, النَّاصِر, النَّذِير) qui apparaissent avec une fréquence élevée dans le Coran et méritent une entrée dédiée.
          </Text>
        </View>
      )}

      {mode === 'flashcard' && (
        <Animated.View entering={FadeIn.duration(400)} className="flex-1 items-center justify-center p-6">
          <View className="flex-row items-center gap-2 mb-6">
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: `${catInfo.color}20` }}>
              <Text className="text-sm">{catInfo.emoji}</Text>
            </View>
            <Text className="text-lg font-bold text-foreground">{catInfo.name}</Text>
          </View>

          <Text className="text-base text-muted mb-6 text-center">
            {currentIndex + 1}/{words.length} · Clique sur la carte pour la retourner
          </Text>

          <VocabularyCard
            word={currentWord}
            isFlipped={isFlipped}
            onFlip={handleFlip}
          />

          <View className="flex-row gap-4 mt-8">
            <TouchableOpacity
              onPress={handlePrev}
              className="bg-surface border-2 border-primary rounded-full w-14 h-14 items-center justify-center active:opacity-70"
            >
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleFlip}
              className="bg-primary rounded-full px-6 items-center justify-center active:opacity-80"
            >
              <Text className="text-white text-lg font-bold">🔄 Retourner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              className="bg-surface border-2 border-primary rounded-full w-14 h-14 items-center justify-center active:opacity-70"
            >
              <Text className="text-2xl">→</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {mode === 'quiz' && (
        <Animated.View entering={FadeIn.duration(400)} className="flex-1">
          <VocabularyQuiz
            availableWords={words}
            onComplete={handleQuizComplete}
            questionCount={Math.min(10, words.length)}
          />
        </Animated.View>
      )}

      {mode === 'list' && (
        <Animated.View entering={FadeIn.duration(400)} className="flex-1">
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {words.map((word, index) => (
              <TouchableOpacity
                key={word.id}
                onPress={() => {
                  setCurrentIndex(index);
                  setIsFlipped(true);
                  setMode('details');
                }}
                className="bg-surface rounded-xl p-4 mb-2 border border-border active:opacity-80"
              >
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center">
                    <Text className="text-xl">{word.arabic}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-foreground">{word.french}</Text>
                    <Text className="text-sm text-muted italic">{word.transliteration}</Text>
                  </View>
                  <Text className="text-xs text-muted">{word.frequency}×</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {mode === 'details' && (
        <Animated.View entering={FadeIn.duration(400)} className="flex-1 items-center justify-center p-6">
          <VocabularyCard word={currentWord} isFlipped={true} onFlip={() => setMode('list')} />
          <View className="flex-row gap-4 mt-8">
            <TouchableOpacity
              onPress={() => { setCurrentIndex(i => Math.max(0, i - 1)); setIsFlipped(true); }}
              className="bg-surface border-2 border-primary rounded-full w-14 h-14 items-center justify-center active:opacity-70"
            >
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('list')}
              className="bg-primary rounded-full px-6 items-center justify-center active:opacity-80"
            >
              <Text className="text-white text-lg font-bold">📋 Liste</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setCurrentIndex(i => Math.min(words.length - 1, i + 1)); setIsFlipped(true); }}
              className="bg-surface border-2 border-primary rounded-full w-14 h-14 items-center justify-center active:opacity-70"
            >
              <Text className="text-2xl">→</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ScreenContainer>
  );
}
