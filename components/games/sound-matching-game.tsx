import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Animated, { FadeIn, SlideInRight, BounceIn } from 'react-native-reanimated';
import { playLetterSound } from '@/lib/audio-manager';

type SoundMatchingGameProps = {
  letters: Array<{ letter: string; latinName: string }>;
  onComplete: () => void;
};

const TOTAL_ROUNDS = 10;

export function SoundMatchingGame({ letters, onComplete }: SoundMatchingGameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<Array<{ letter: string; latinName: string }>>([]);
  const [correctAnswer, setCorrectAnswer] = useState<{ letter: string; latinName: string } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [autoPlayed, setAutoPlayed] = useState(false);

  const pickRandomLetters = useCallback(() => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];
    const wrongOptions = shuffled.slice(1, 4);
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    setCorrectAnswer(correct);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
    setAutoPlayed(false);
  }, [letters]);

  useEffect(() => {
    if (round < TOTAL_ROUNDS) {
      pickRandomLetters();
    } else {
      setGameOver(true);
    }
  }, [round, pickRandomLetters]);

  useEffect(() => {
    if (correctAnswer && !autoPlayed) {
      const timer = setTimeout(() => {
        playLetterSound(correctAnswer.letter, 'fatha');
        setAutoPlayed(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [correctAnswer, autoPlayed]);

  const handleReplay = () => {
    if (correctAnswer) {
      playLetterSound(correctAnswer.letter, 'fatha');
    }
  };

  const handleSelect = (letter: string) => {
    if (showResult) return;
    setSelectedAnswer(letter);
    setShowResult(true);
    if (letter === correctAnswer?.letter) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setRound(prev => prev + 1);
  };

  const handleRestart = () => {
    setRound(0);
    setScore(0);
    setGameOver(false);
  };

  if (gameOver) {
    const percentage = Math.round((score / TOTAL_ROUNDS) * 100);
    return (
      <Animated.View entering={FadeIn.duration(600)} className="flex-1 p-6 items-center justify-center">
        <Text className="text-6xl mb-4">{percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '💪'}</Text>
        <Text className="text-2xl font-bold text-center text-foreground mb-2">Résultat</Text>
        <Text className="text-5xl font-bold text-primary mb-4">{score}/{TOTAL_ROUNDS}</Text>
        <Text className="text-lg text-center text-muted mb-8">
          {percentage >= 80 ? 'Bravo ! Tu es un maître des sons !' :
           percentage >= 50 ? 'Bon travail ! Continue à t\'entraîner !' :
           'Entraîne-toi encore un peu, tu vas progresser !'}
        </Text>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={handleRestart} className="bg-primary rounded-full py-3 px-8 active:opacity-80">
            <Text className="text-white text-lg font-bold">🔄 Rejouer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onComplete} className="bg-surface border-2 border-primary rounded-full py-3 px-8 active:opacity-70">
            <Text className="text-primary text-lg font-bold">Terminer</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(600)} className="flex-1 p-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-foreground">Son {round + 1}/{TOTAL_ROUNDS}</Text>
        <Text className="text-lg font-bold text-primary">Score : {score}</Text>
      </View>

      <View className="bg-primary/10 p-4 rounded-xl items-center mb-6">
        <Text className="text-base text-muted mb-3">Quelle lettre correspond à ce son ?</Text>
        <TouchableOpacity onPress={handleReplay} className="bg-primary w-20 h-20 rounded-full items-center justify-center shadow-lg active:opacity-70">
          <Text className="text-4xl">{autoPlayed ? '🔊' : '⏳'}</Text>
        </TouchableOpacity>
        <Text className="text-sm text-muted mt-2">{autoPlayed ? 'Réécouter' : 'Écoute...'}</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="gap-3">
          {options.map((opt, index) => {
            const isCorrect = opt.letter === correctAnswer?.letter;
            const isSelected = selectedAnswer === opt.letter;
            let bgColor = 'bg-surface border-primary';
            if (showResult) {
              if (isCorrect) bgColor = 'bg-success/20 border-success';
              else if (isSelected) bgColor = 'bg-red/20 border-red';
            }
            return (
              <Animated.View key={opt.letter} entering={SlideInRight.delay(index * 80).springify()}>
                <TouchableOpacity
                  onPress={() => handleSelect(opt.letter)}
                  disabled={showResult}
                  className={`p-5 rounded-2xl border-2 active:opacity-70 ${bgColor}`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 items-center">
                      <Text className="text-5xl mb-1">{opt.letter}</Text>
                      <Text className="text-lg text-muted">{opt.latinName}</Text>
                    </View>
                    {showResult && (
                      <Text className="text-3xl">{isCorrect ? '✅' : isSelected ? '❌' : ''}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {showResult && (
        <Animated.View entering={BounceIn} className="mt-4">
          <TouchableOpacity onPress={handleNext} className="bg-primary rounded-full py-4 px-8 shadow-lg active:opacity-80">
            <Text className="text-white text-xl font-bold text-center">Suivant →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}
