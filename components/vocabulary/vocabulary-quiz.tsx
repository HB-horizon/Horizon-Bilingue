import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { VocabularyWord } from '@/types/vocabulary';
import { getRandomWords } from '@/data/quran-vocabulary';

type Props = {
  availableWords: VocabularyWord[];
  onComplete: (score: number, total: number) => void;
  questionCount?: number;
};

type Question = {
  word: VocabularyWord;
  options: string[];
  correctIndex: number;
};

function generateQuestion(word: VocabularyWord, allWords: VocabularyWord[]): Question {
  const wrongAnswers = allWords
    .filter(w => w.id !== word.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => w.french);

  const options = [word.french, ...wrongAnswers].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(word.french);

  return { word, options, correctIndex };
}

export default function VocabularyQuiz({ availableWords, onComplete, questionCount = 10 }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(questionCount, availableWords.length));
    const pool = availableWords.length >= 4 ? availableWords : [...availableWords, ...availableWords];
    setQuestions(selected.map(w => generateQuestion(w, pool)));
  }, [availableWords, questionCount]);

  const handleAnswer = useCallback((index: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIndex(index);
    if (index === questions[currentIndex].correctIndex) {
      setScore(s => s + 1);
    }
  }, [answered, currentIndex, questions]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setAnswered(false);
      setSelectedIndex(null);
    } else {
      setFinished(true);
      onComplete(score, questions.length);
    }
  }, [currentIndex, questions.length, score, onComplete]);

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-6xl mb-4">{percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}</Text>
        <Text className="text-2xl font-bold text-foreground text-center mb-2">Quiz terminé !</Text>
        <Text className="text-lg text-muted text-center mb-6">
          {score}/{questions.length} bonnes réponses ({percentage}%)
        </Text>
        <TouchableOpacity
          onPress={() => {
            setFinished(false);
            setCurrentIndex(0);
            setScore(0);
            setAnswered(false);
            setSelectedIndex(null);
            const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, Math.min(questionCount, availableWords.length));
            const pool = availableWords.length >= 4 ? availableWords : [...availableWords, ...availableWords];
            setQuestions(selected.map(w => generateQuestion(w, pool)));
          }}
          className="bg-primary rounded-full py-3 px-8 active:opacity-80"
        >
          <Text className="text-white text-lg font-bold">Recommencer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (questions.length === 0) return null;

  const question = questions[currentIndex];

  return (
    <View className="flex-1 p-6">
      <View className="items-center mb-6">
        <Text className="text-sm text-muted mb-2">
          {currentIndex + 1}/{questions.length}
        </Text>
        <View className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </View>
      </View>

      <View className="flex-1 items-center justify-center">
        <View className="bg-primary/20 border-2 border-primary rounded-3xl p-8 items-center mb-8 w-full max-w-sm">
          <Text className="text-5xl mb-3">{question.word.arabic}</Text>
          <Text className="text-base text-muted italic">{question.word.transliteration}</Text>
        </View>

        <Text className="text-lg font-bold text-foreground mb-4">Quel est le sens ?</Text>

        <View className="w-full max-w-sm gap-3">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctIndex;
            const isSelected = index === selectedIndex;
            let bgClass = 'bg-surface border-2 border-border';
            if (answered && isCorrect) bgClass = 'bg-success/20 border-2 border-success';
            else if (answered && isSelected && !isCorrect) bgClass = 'bg-error/20 border-2 border-error';

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(index)}
                disabled={answered}
                className={`rounded-xl py-4 px-6 active:opacity-70 ${bgClass}`}
              >
                <Text className={`text-base text-center font-semibold ${
                  answered && isCorrect ? 'text-success' :
                  answered && isSelected && !isCorrect ? 'text-error' :
                  'text-foreground'
                }`}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {answered && (
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary rounded-full py-3 px-8 items-center mt-6 active:opacity-80"
        >
          <Text className="text-white text-lg font-bold">
            {currentIndex < questions.length - 1 ? 'Suivant →' : 'Voir le résultat'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
