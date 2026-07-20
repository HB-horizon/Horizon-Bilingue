import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { day30Fatiha } from '@/data/day-30-fatiha';
import { useProgress } from '@/hooks/use-progress';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useState } from 'react';

/**
 * Écran Jour 30 - Sourate Al-Fatiha
 * 
 * Le couronnement de l'apprentissage avec :
 * - Présentation de la Fatiha complète
 * - Lecture verset par verset
 * - Traductions
 * - Grande célébration finale
 */
export default function Day30Screen() {
  const router = useRouter();
  const { completeDay } = useProgress();
  const [showCelebration, setShowCelebration] = useState(false);
  
  const handleFinish = async () => {
    await completeDay(30);
    setShowCelebration(true);
  };
  
  const handleBackToDashboard = () => {
    router.replace('/dashboard');
  };
  
  if (showCelebration) {
    return (
      <ScreenContainer className="bg-gradient-to-b from-[#FFD700]/30 to-background">
        <Animated.View
          entering={FadeIn.duration(800)}
          className="flex-1 p-6 justify-center items-center"
        >
          {/* Confettis et étoiles */}
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
            entering={SlideInDown.delay(200).springify()}
            className="items-center"
          >
            <Text className="text-5xl mb-6">🏆</Text>
            <Text className="text-4xl font-bold text-center text-foreground mb-4">
              FÉLICITATIONS !
            </Text>
            <Text className="text-2xl text-center text-primary mb-6">
              Tu as terminé les 30 jours !
            </Text>
            
            <View className="bg-surface p-8 rounded-2xl border-4 border-[#FFD700] mb-8">
              <Text className="text-xl text-center text-foreground font-bold mb-4">
                🎓 Diplôme d'Excellence
              </Text>
              <Text className="text-base text-center text-muted leading-relaxed">
                Tu as maîtrisé les 29 lettres de l'alphabet arabe et tu peux maintenant lire la Sourate Al-Fatiha !
              </Text>
              <Text className="text-center text-foreground mt-4 text-lg">
                ✨ Tu es un champion ! ✨
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={handleBackToDashboard}
              className="bg-success rounded-full py-4 px-8 shadow-lg active:opacity-80"
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
        {/* En-tête */}
        <View className="bg-primary p-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-4"
          >
            <Text className="text-white text-base">← Retour</Text>
          </TouchableOpacity>
          
          <Text className="text-3xl font-bold text-white text-center mb-2">
            Jour 30
          </Text>
          <Text className="text-xl text-white/90 text-center">
            {day30Fatiha.title}
          </Text>
        </View>
        
        {/* Introduction */}
        <View className="p-6 bg-[#FFD700]/10">
          <Text className="text-lg text-center text-foreground leading-relaxed mb-4">
            🎉 Félicitations ! Tu as appris les 29 lettres de l'alphabet arabe. Aujourd'hui, tu vas lire ta première sourate complète : <Text className="font-bold">Al-Fatiha</Text> !
          </Text>
        </View>
        
        {/* Versets */}
        <View className="p-6">
          <Text className="text-2xl font-bold text-foreground mb-6 text-center">
            📖 Les 7 Versets
          </Text>
          
          {day30Fatiha.verses.map((verse, index) => (
            <Animated.View
              key={verse.number}
              entering={FadeIn.delay(index * 100)}
              className="mb-6"
            >
              <View className="bg-surface p-6 rounded-2xl border-2 border-primary">
                {/* Numéro du verset */}
                <View className="items-center mb-4">
                  <View className="bg-primary w-10 h-10 rounded-full items-center justify-center">
                    <Text className="text-white font-bold text-lg">
                      {verse.number}
                    </Text>
                  </View>
                </View>
                
                {/* Texte arabe */}
                <Text className="text-3xl text-center text-foreground mb-4 leading-loose">
                  {verse.arabic}
                </Text>
                
                {/* Translittération */}
                <Text className="text-base text-center text-primary mb-3 italic">
                  {verse.transliteration}
                </Text>
                
                {/* Traduction */}
                <View className="bg-[#FFE66D]/20 p-4 rounded-xl border border-[#FFD700]">
                  <Text className="text-base text-center text-foreground leading-relaxed">
                    {verse.translation}
                  </Text>
                </View>
                
                {/* Bouton audio */}
                <TouchableOpacity
                  className="mt-4 bg-primary rounded-full py-3 px-6 active:opacity-80"
                  onPress={() => console.log('Play verse', verse.number)}
                >
                  <Text className="text-white text-center font-bold">
                    🔊 Écouter
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>
        
        {/* Explication */}
        <View className="p-6 bg-surface">
          <Text className="text-2xl font-bold text-foreground mb-4 text-center">
            💡 Ce que tu as accompli
          </Text>
          
          <Text className="text-base text-foreground leading-relaxed whitespace-pre-line">
            {day30Fatiha.explanation}
          </Text>
        </View>
        
        {/* Bouton terminer */}
        <View className="p-6">
          <TouchableOpacity
            onPress={handleFinish}
            className="bg-success rounded-full py-5 px-8 shadow-lg active:opacity-80"
          >
            <Text className="text-white text-2xl font-bold text-center">
              🎓 Terminer le programme
            </Text>
          </TouchableOpacity>
        </View>
        
        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
}
