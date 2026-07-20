import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

type StoryCardProps = {
  title: string;
  content: string;
  character: string;
  onNext: () => void;
};

export function StoryCard({ title, content, character, onNext }: StoryCardProps) {
  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-6 pt-6">
      <View className="flex-1 justify-center">
        {/* Character */}
        <Animated.View
          entering={SlideInDown.delay(200).springify()}
          className="items-center mb-6"
        >
          <View className="w-24 h-24 rounded-full items-center justify-center" style={{ backgroundColor: "#1E293B", borderWidth: 2, borderColor: "#F59E0B" }}>
            <Text className="text-5xl">{character}</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Text className="text-2xl font-extrabold text-center mb-5" style={{ color: "#F1F5F9" }}>
          {title}
        </Text>

        {/* Story content */}
        <Animated.View
          entering={FadeIn.delay(400)}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#1E293B", borderWidth: 1, borderColor: "#F59E0B40" }}
        >
          <Text className="text-base text-center leading-6" style={{ color: "#CBD5E1" }}>
            {content}
          </Text>
        </Animated.View>

        {/* Decorative line */}
        <View className="items-center mt-6">
          <View className="w-12 h-0.5 rounded-full" style={{ backgroundColor: "#F59E0B60" }} />
        </View>
      </View>

      {/* Next */}
      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.85}
        className="py-4 rounded-2xl mb-8"
        style={{ backgroundColor: "#FF6B6B" }}
      >
        <Text className="text-white text-base font-bold text-center">Suivant →</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
