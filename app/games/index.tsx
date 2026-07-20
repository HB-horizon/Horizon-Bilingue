import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState } from 'react';
import { MemoryGame } from '@/components/games/memory-game';
import { QuizGame } from '@/components/games/quiz-game';
import { SoundMatchingGame } from '@/components/games/sound-matching-game';
import { useProgress } from '@/hooks/use-progress';
import { getAllCompletedLetters } from '@/data/all-lessons';
import Animated, { FadeIn } from 'react-native-reanimated';

type GameType = 'menu' | 'memory' | 'quiz' | 'sound-matching';

/**
 * Écran Mini-Jeux
 * 
 * Permet de jouer aux mini-jeux pour réviser les lettres apprises :
 * - Memory : Trouver les paires de lettres
 * - Quiz : Reconnaître les lettres
 * - Sound Matching : Associer son et lettre
 */
export default function GamesScreen() {
  const router = useRouter();
  const { progress } = useProgress();
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  
  // Récupérer les lettres apprises
  const completedLetters = progress ? getAllCompletedLetters(progress.completedDays) : [];
  
  const handleGameComplete = () => {
    setCurrentGame('menu');
  };
  
  const handleBack = () => {
    if (currentGame === 'menu') {
      router.back();
    } else {
      setCurrentGame('menu');
    }
  };
  
  if (completedLetters.length < 4) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View className="flex-1 p-6 justify-center items-center">
          <Text className="text-6xl mb-6">🎮</Text>
          <Text className="text-2xl font-bold text-center text-foreground mb-4">
            Mini-Jeux
          </Text>
          <Text className="text-base text-center text-muted mb-8">
            Complète au moins 4 jours pour débloquer les mini-jeux !
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary rounded-full py-3 px-8 active:opacity-80"
          >
            <Text className="text-white text-lg font-bold">
              ← Retour
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }
  
  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      {/* Barre de navigation */}
      <View className="bg-surface border-b border-border px-4 py-3">
        <TouchableOpacity
          onPress={handleBack}
          className="active:opacity-70"
        >
          <Text className="text-primary text-lg font-bold">
            ← {currentGame === 'menu' ? 'Retour' : 'Menu'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Contenu */}
      {currentGame === 'menu' && (
        <Animated.View
          entering={FadeIn.duration(600)}
          className="flex-1"
        >
          <ScrollView className="flex-1 p-6">
            {/* Titre */}
            <View className="items-center mb-8">
              <Text className="text-4xl mb-4">🎮</Text>
              <Text className="text-3xl font-bold text-center text-foreground mb-2">
                Mini-Jeux
              </Text>
              <Text className="text-base text-center text-muted">
                Révise en t'amusant avec {completedLetters.length} lettres apprises !
              </Text>
            </View>
            
            {/* Liste des jeux */}
            <View className="gap-4">
              {/* Memory */}
              <TouchableOpacity
                onPress={() => setCurrentGame('memory')}
                className="bg-surface p-6 rounded-2xl border-2 border-primary active:opacity-70"
              >
                <View className="flex-row items-center mb-3">
                  <Text className="text-5xl mr-4">🧠</Text>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-foreground mb-1">
                      Memory
                    </Text>
                    <Text className="text-sm text-muted">
                      Trouve les paires de lettres identiques
                    </Text>
                  </View>
                </View>
                <View className="bg-primary/10 p-3 rounded-xl">
                  <Text className="text-sm text-primary font-bold">
                    🎯 Entraîne ta mémoire visuelle
                  </Text>
                </View>
              </TouchableOpacity>
              
              {/* Quiz */}
              <TouchableOpacity
                onPress={() => setCurrentGame('quiz')}
                className="bg-surface p-6 rounded-2xl border-2 border-success active:opacity-70"
              >
                <View className="flex-row items-center mb-3">
                  <Text className="text-5xl mr-4">🎯</Text>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-foreground mb-1">
                      Quiz
                    </Text>
                    <Text className="text-sm text-muted">
                      Reconnais les lettres arabes
                    </Text>
                  </View>
                </View>
                <View className="bg-success/10 p-3 rounded-xl">
                  <Text className="text-sm text-success font-bold">
                    📚 Teste tes connaissances
                  </Text>
                </View>
              </TouchableOpacity>
              
              {/* Sound Matching */}
              <TouchableOpacity
                onPress={() => setCurrentGame('sound-matching')}
                className="bg-surface p-6 rounded-2xl border-2 border-[#9B59B6] active:opacity-70"
              >
                <View className="flex-row items-center mb-3">
                  <Text className="text-5xl mr-4">🔊</Text>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-foreground mb-1">
                      Association Son-Lettre
                    </Text>
                    <Text className="text-sm text-muted">
                      Trouve la lettre qui correspond au son
                    </Text>
                  </View>
                </View>
                <View className="bg-[#9B59B6]/10 p-3 rounded-xl">
                  <Text className="text-sm text-[#9B59B6] font-bold">
                    🎧 Entraîne ton oreille
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Statistiques */}
            <View className="mt-8 bg-[#FFE66D]/20 p-6 rounded-2xl border-2 border-[#FFD700]">
              <Text className="text-lg font-bold text-foreground mb-3 text-center">
                📊 Tes Progrès
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="text-3xl font-bold text-primary">
                    {completedLetters.length}
                  </Text>
                  <Text className="text-sm text-muted">Lettres</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold text-success">
                    {progress?.completedDays.length || 0}
                  </Text>
                  <Text className="text-sm text-muted">Jours</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold text-[#FFD700]">
                    {Math.round(((progress?.completedDays.length || 0) / 29) * 100)}%
                  </Text>
                  <Text className="text-sm text-muted">Progression</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      )}
      
      {currentGame === 'memory' && (
        <MemoryGame
          letters={completedLetters}
          onComplete={handleGameComplete}
        />
      )}
      
      {currentGame === 'quiz' && (
        <QuizGame
          letters={completedLetters}
          onComplete={handleGameComplete}
        />
      )}
      
      {currentGame === 'sound-matching' && (
        <SoundMatchingGame
          letters={completedLetters}
          onComplete={handleGameComplete}
        />
      )}
    </ScreenContainer>
  );
}
