import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { vocabularyCategories, getWordsByCategory } from '@/data/quran-vocabulary';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function VocabularyScreen() {
  const router = useRouter();

  const totalWords = vocabularyCategories.reduce(
    (sum, cat) => sum + getWordsByCategory(cat.id).length, 0
  );

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-surface border-b border-border px-4 py-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="active:opacity-70">
              <Text className="text-primary text-lg font-bold">← Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/')} className="active:opacity-70 p-2">
              <Text className="text-xl">🏠</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground text-center mb-2">
            📖 Vocabulaire du Coran
          </Text>
          <Text className="text-base text-muted text-center mb-2">
            80% des mots du Coran
          </Text>
          <Text className="text-sm text-muted text-center mb-4">
            {totalWords} mots essentiels à connaître
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/revision/vocabulary')}
            className="bg-primary rounded-full py-3 px-6 flex-row items-center justify-center shadow-lg active:opacity-80"
          >
            <Text className="text-white text-lg font-bold mr-2">📚</Text>
            <Text className="text-white text-lg font-bold">Mode Révision Globale</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 gap-3">
          {vocabularyCategories.map((category, index) => {
            const words = getWordsByCategory(category.id);
            return (
              <Animated.View
                key={category.id}
                entering={FadeInDown.duration(400).delay(index * 80)}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/vocabulary/${category.id}`)}
                  className="bg-surface rounded-2xl p-5 border border-border active:opacity-80 shadow-sm"
                  style={{ borderLeftWidth: 4, borderLeftColor: category.color }}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className="w-14 h-14 rounded-xl items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Text className="text-2xl">{category.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-foreground">{category.name}</Text>
                      <Text className="text-sm text-muted mt-1">{category.description}</Text>
                      <Text className="text-xs text-primary font-semibold mt-1">
                        {words.length} mots
                      </Text>
                    </View>
                    <Text className="text-xl text-muted">→</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
