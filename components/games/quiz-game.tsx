import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import Animated, { FadeIn, SlideInRight, ZoomIn } from 'react-native-reanimated';
import { playLetterSound } from '@/lib/audio-manager';
import { rewardsManager } from '@/lib/rewards-manager';
import { BadgeUnlockedNotification } from '@/components/rewards/badge-display';
import type { Badge } from '@/types/rewards';

type QuizQuestion = {
  letter: string;
  latinName: string;
  options: string[];
  correctAnswer: string;
};

type QuizGameProps = {
  letters: Array<{ letter: string; latinName: string }>;
  onComplete: () => void;
};

/**
 * Jeu Quiz - Reconnaissance de lettres
 * 
 * Règles :
 * - Afficher une lettre arabe
 * - Proposer 4 options de noms latins
 * - Sélectionner la bonne réponse
 * - 10 questions au total
 */
export function QuizGame({ letters, onComplete }: QuizGameProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  
  // Enregistrer le score quand showResult change
  useEffect(() => {
    if (showResult) {
      handleRecordScore();
    }
  }, [showResult]);
  
  useEffect(() => {
    generateQuestions();
  }, [letters]);
  
  const generateQuestions = () => {
    const numQuestions = Math.min(10, letters.length);
    const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);
    
    const newQuestions: QuizQuestion[] = shuffledLetters
      .slice(0, numQuestions)
      .map((letter) => {
        // Créer 3 mauvaises réponses
        const wrongAnswers = letters
          .filter(l => l.latinName !== letter.latinName)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(l => l.latinName);
        
        // Mélanger toutes les options
        const options = [letter.latinName, ...wrongAnswers].sort(
          () => Math.random() - 0.5
        );
        
        return {
          letter: letter.letter,
          latinName: letter.latinName,
          options,
          correctAnswer: letter.latinName,
        };
      });
    
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };
  
  const handleAnswerSelect = async (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      await playLetterSound(currentQuestion.letter, 'fatha');
    }
    
    // Passer à la question suivante après 1.5 secondes
    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };
  
  const handleRestart = () => {
    generateQuestions();
  };
  
  const handleFinish = () => {
    onComplete();
  };

  const handleRecordScore = async () => {
    const { newBadges: badges } = await rewardsManager.recordGameScore(
      'quiz',
      score,
      questions.length
    );
    if (badges.length > 0) {
      setNewBadges(badges);
    }
  };
  
  if (questions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-muted">Chargement...</Text>
      </View>
    );
  }
  
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;
    
    return (
      <Animated.View
        entering={FadeIn.duration(600)}
        className="flex-1 p-6 justify-center"
      >
        <Animated.View
          entering={ZoomIn.delay(200).springify()}
          className="items-center"
        >
          {newBadges.map(badge => (
            <BadgeUnlockedNotification key={badge.id} badge={badge} />
          ))}
          
          <Text className="text-6xl mb-6">
            {isExcellent ? '🏆' : isGood ? '🎉' : '💪'}
          </Text>
          
          <Text className="text-3xl font-bold text-center text-foreground mb-4">
            {isExcellent
              ? 'Excellent !'
              : isGood
              ? 'Bien joué !'
              : 'Continue !'}
          </Text>
          
          <View className="bg-surface p-8 rounded-2xl border-2 border-primary mb-8">
            <Text className="text-base text-center text-muted mb-2">
              Ton score
            </Text>
            <Text className="text-5xl font-bold text-center text-primary mb-2">
              {score}/{questions.length}
            </Text>
            <Text className="text-2xl text-center text-foreground">
              {percentage}%
            </Text>
          </View>
          
          <View className="w-full gap-4">
            <TouchableOpacity
              onPress={handleRestart}
              className="bg-primary rounded-full py-4 px-8 active:opacity-80"
            >
              <Text className="text-white text-xl font-bold text-center">
                🔄 Rejouer
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleFinish}
              className="bg-success rounded-full py-4 px-8 active:opacity-80"
            >
              <Text className="text-white text-xl font-bold text-center">
                ✓ Terminer
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      className="flex-1 p-6"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-center text-foreground mb-2">
            🎯 Quiz de Reconnaissance
          </Text>
          <Text className="text-base text-center text-muted mb-4">
            Quel est le nom de cette lettre ?
          </Text>
          
          {/* Progression */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-muted">
                Question {currentQuestionIndex + 1}/{questions.length}
              </Text>
              <Text className="text-sm text-primary font-bold">
                Score: {score}
              </Text>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
        </View>
        
        {/* Lettre à identifier */}
        <Animated.View
          key={currentQuestionIndex}
          entering={ZoomIn.springify()}
          className="bg-surface p-12 rounded-2xl border-2 border-primary mb-6 items-center"
        >
          <Text className="text-8xl">{currentQuestion.letter}</Text>
        </Animated.View>
        
        {/* Options de réponse */}
        <View className="gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;
            
            return (
              <Animated.View
                key={option}
                entering={SlideInRight.delay(index * 100).springify()}
              >
                <TouchableOpacity
                  onPress={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`p-5 rounded-xl border-2 active:opacity-70 ${
                    showCorrect
                      ? 'bg-success/20 border-success'
                      : showWrong
                      ? 'bg-error/20 border-error'
                      : 'bg-surface border-primary'
                  }`}
                >
                  <Text
                    className={`text-xl font-bold text-center ${
                      showCorrect
                        ? 'text-success'
                        : showWrong
                        ? 'text-error'
                        : 'text-foreground'
                    }`}
                  >
                    {showCorrect && '✓ '}
                    {showWrong && '✗ '}
                    {option}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </Animated.View>
  );
}
