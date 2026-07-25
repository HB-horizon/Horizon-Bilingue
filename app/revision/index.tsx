import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useState, useEffect } from 'react';
import { useProgress } from '@/hooks/use-progress';
import { getAllCompletedLetters } from '@/data/all-lessons';
import { playLetterSound } from '@/lib/audio-manager';
import Animated, { 
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

/**
 * Écran de Révision - Flashcards
 * 
 * Permet de réviser rapidement toutes les lettres apprises :
 * - Carte recto : lettre arabe
 * - Carte verso : nom latin + son
 * - Navigation entre les cartes
 * - Mode aléatoire
 */
export default function RevisionScreen() {
  const router = useRouter();
  const { progress } = useProgress();
  const [letters, setLetters] = useState<Array<{ letter: string; latinName: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  
  const flipAnimation = useSharedValue(0);
  
  useEffect(() => {
    if (progress) {
      const completedLetters = getAllCompletedLetters(progress.completedDays);
      setLetters(completedLetters);
    }
  }, [progress]);
  
  useEffect(() => {
    // Réinitialiser le flip quand on change de carte
    setIsFlipped(false);
    flipAnimation.value = 0;
  }, [currentIndex]);
  
  const handleFlip = async () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    
    flipAnimation.value = withTiming(newFlipped ? 1 : 0, { duration: 400 });
    
    // Jouer le son quand on retourne la carte
    if (newFlipped && letters[currentIndex]) {
      await playLetterSound(letters[currentIndex].letter, 'fatha');
    }
  };
  
  const handleNext = () => {
    if (isRandom) {
      setCurrentIndex(Math.floor(Math.random() * letters.length));
    } else {
      setCurrentIndex((currentIndex + 1) % letters.length);
    }
  };
  
  const handlePrevious = () => {
    if (isRandom) {
      setCurrentIndex(Math.floor(Math.random() * letters.length));
    } else {
      setCurrentIndex((currentIndex - 1 + letters.length) % letters.length);
    }
  };
  
  const toggleRandomMode = () => {
    setIsRandom(!isRandom);
    if (!isRandom) {
      // Activer le mode aléatoire et choisir une carte au hasard
      setCurrentIndex(Math.floor(Math.random() * letters.length));
    }
  };
  
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden' as const,
    };
  });
  
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden' as const,
      position: 'absolute' as const,
    };
  });
  
  if (!progress || letters.length === 0) {
    return (
      <ScreenContainer>
        <View className="flex-1 p-6 justify-center items-center">
          <Text className="text-6xl mb-6">📚</Text>
          <Text className="text-2xl font-bold text-center text-foreground mb-4">
            Mode Révision
          </Text>
          <Text className="text-base text-center text-muted mb-8">
            Complète au moins 1 jour pour commencer à réviser !
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
  
  const currentLetter = letters[currentIndex];
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = Math.min(screenWidth - 80, 350);
  const cardHeight = cardWidth * 1.4;
  
  return (
    <ScreenContainer>
      {/* Barre de navigation */}
      <View className="bg-surface border-b border-border px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="active:opacity-70"
          >
            <Text className="text-primary text-lg font-bold">
              ← Retour
            </Text>
          </TouchableOpacity>
          
          <Text className="text-foreground font-bold">
            {currentIndex + 1}/{letters.length}
          </Text>
          
          <TouchableOpacity
            onPress={toggleRandomMode}
            className={`px-3 py-1 rounded-full ${
              isRandom ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <Text className="text-white text-sm font-bold">
              {isRandom ? '🔀 Aléa' : '➡️ Ordre'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Contenu */}
      <Animated.View
        entering={FadeIn.duration(600)}
        className="flex-1 items-center justify-center p-6"
      >
        {/* Titre */}
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          📚 Mode Révision
        </Text>
        <Text className="text-base text-center text-muted mb-8">
          Clique sur la carte pour la retourner
        </Text>
        
        {/* Flashcard */}
        <TouchableOpacity
          onPress={handleFlip}
          activeOpacity={0.9}
          style={{
            width: cardWidth,
            height: cardHeight,
            marginBottom: 40,
          }}
        >
          <View style={{ width: '100%', height: '100%' }}>
            {/* Face avant (lettre arabe) */}
            <Animated.View
              style={[
                frontAnimatedStyle,
                {
                  width: '100%',
                  height: '100%',
                },
              ]}
              className="bg-primary/20 border-4 border-primary rounded-3xl items-center justify-center shadow-lg"
            >
              <Text className="text-9xl">{currentLetter.letter}</Text>
              <Text className="text-sm text-muted mt-4">
                Clique pour voir le nom
              </Text>
            </Animated.View>
            
            {/* Face arrière (nom latin) */}
            <Animated.View
              style={[
                backAnimatedStyle,
                {
                  width: '100%',
                  height: '100%',
                },
              ]}
              className="bg-success/20 border-4 border-success rounded-3xl items-center justify-center shadow-lg"
            >
              <Text className="text-9xl mb-6">{currentLetter.letter}</Text>
              <View className="bg-success px-6 py-3 rounded-full">
                <Text className="text-white text-3xl font-bold">
                  {currentLetter.latinName}
                </Text>
              </View>
              <Text className="text-sm text-muted mt-6">
                🔊 Écoute le son
              </Text>
            </Animated.View>
          </View>
        </TouchableOpacity>
        
        {/* Boutons de navigation */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={handlePrevious}
            className="bg-surface border-2 border-primary rounded-full w-16 h-16 items-center justify-center active:opacity-70"
          >
            <Text className="text-3xl">←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleFlip}
            className="bg-primary rounded-full px-8 py-4 items-center justify-center active:opacity-80"
          >
            <Text className="text-white text-lg font-bold">
              🔄 Retourner
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleNext}
            className="bg-surface border-2 border-primary rounded-full w-16 h-16 items-center justify-center active:opacity-70"
          >
            <Text className="text-3xl">→</Text>
          </TouchableOpacity>
        </View>
        
        {/* Astuce */}
        <View className="mt-8 bg-[#FFE66D]/20 p-4 rounded-xl border-2 border-[#FFD700]">
          <Text className="text-center text-foreground text-sm">
            💡 Astuce : Active le mode aléatoire pour un défi plus difficile !
          </Text>
        </View>
      </Animated.View>
      
      {/* SRS Revision Link */}
      <TouchableOpacity
        onPress={() => router.push('/revision/srs')}
        className="mx-6 mb-6 p-4 rounded-2xl flex-row items-center"
        style={{ backgroundColor: "#1E293B", borderWidth: 1.5, borderColor: "#6366F1" }}
      >
        <Text className="text-3xl mr-4">🧠</Text>
        <View className="flex-1">
          <Text className="font-bold text-base" style={{ color: "#F1F5F9" }}>Révision intelligente SRS</Text>
          <Text className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>Algorithme de répétition espacée</Text>
        </View>
        <Text className="text-xl" style={{ color: "#6366F1" }}>→</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
