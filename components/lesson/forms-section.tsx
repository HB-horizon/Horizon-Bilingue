import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LetterForms } from '@/types/lesson';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

type FormsSectionProps = {
  forms: LetterForms;
  onNext: () => void;
};

const formLabels = {
  isolated: 'Isolée',
  beginning: 'Début',
  middle: 'Milieu',
  end: 'Fin',
};

/**
 * Composant FormsSection - Section des formes de la lettre
 * 
 * Affiche les 4 formes avec :
 * - Grille 2×2
 * - Labels explicatifs
 * - Animations
 */
export function FormsSection({ forms, onNext }: FormsSectionProps) {
  const formsArray = [
    { key: 'isolated', label: formLabels.isolated, form: forms.isolated },
    { key: 'beginning', label: formLabels.beginning, form: forms.beginning },
    { key: 'middle', label: formLabels.middle, form: forms.middle },
    { key: 'end', label: formLabels.end, form: forms.end },
  ];
  
  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      className="flex-1 p-6"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Titre */}
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          Les 4 Formes de la Lettre
        </Text>
        
        <Text className="text-base text-center text-muted mb-6">
          La lettre change selon sa position dans le mot
        </Text>
        
        {/* Grille de formes */}
        <View className="gap-4 mb-6">
          {formsArray.map((item, index) => (
            <Animated.View
              key={item.key}
              entering={ZoomIn.delay(index * 150).springify()}
              className="bg-surface p-6 rounded-2xl border-2 border-primary"
            >
              <View className="items-center">
                {/* Forme */}
                <Text className="text-7xl mb-3">{item.form}</Text>
                
                {/* Label */}
                <View className="bg-primary px-4 py-2 rounded-full">
                  <Text className="text-white font-bold text-lg">
                    {item.label}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
        
        {/* Explication */}
        <Animated.View
          entering={FadeIn.delay(600)}
          className="bg-[#FFE66D]/20 p-4 rounded-xl border-2 border-[#FFD700] mb-4"
        >
          <Text className="text-center text-foreground leading-relaxed">
            💡 En arabe, les lettres se connectent entre elles. C'est pourquoi chaque lettre a plusieurs formes !
          </Text>
        </Animated.View>
      </ScrollView>
      
      {/* Bouton Suivant */}
      <TouchableOpacity
        onPress={onNext}
        className="bg-primary rounded-full py-4 px-8 shadow-lg active:opacity-80"
      >
        <Text className="text-white text-xl font-bold text-center">
          Suivant →
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
