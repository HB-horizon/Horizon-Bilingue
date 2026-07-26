import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInDown } from "react-native-reanimated";

type StoryCardProps = {
  title: string;
  content: string;
  character: string;
  onNext: () => void;
};

export function StoryCard({ title, content, character, onNext }: StoryCardProps) {
  return (
    <Animated.View entering={FadeIn.duration(500)} className="flex-1 px-5 pt-4">
      <Animated.View entering={FadeInDown.delay(100).duration(400)} className="flex-row items-center justify-center gap-2 mb-4">
        <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
        <Text className="text-xs font-bold" style={{ color: "#F59E0B" }}>
          Histoire
        </Text>
        <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
      </Animated.View>

      <View className="flex-1 justify-center">
        <Animated.View
          entering={SlideInDown.delay(200).springify()}
          className="items-center mb-6"
        >
          <View className="relative">
            <View
              className="absolute -inset-8 rounded-full"
              style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
            />
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{
                backgroundColor: "#1E293B",
                borderWidth: 2,
                borderColor: "#F59E0B",
                shadowColor: "#F59E0B",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Text className="text-5xl">{character}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          className="items-center mb-5"
        >
          <Text className="text-2xl font-extrabold text-center mb-1" style={{ color: "#F1F5F9" }}>
            {title}
          </Text>
          <View className="w-12 h-0.5 rounded-full mt-2" style={{ backgroundColor: "#F59E0B60" }} />
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(500)}
          className="rounded-2xl p-5"
          style={{
            backgroundColor: "#1E293B",
            borderWidth: 1,
            borderColor: "#F59E0B30",
            shadowColor: "#F59E0B",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-sm text-center leading-6" style={{ color: "#CBD5E1" }}>
            {content}
          </Text>
        </Animated.View>

        <View className="items-center mt-5">
          <View className="flex-row gap-1.5">
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F59E0B60" }} />
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: "#F59E0B30" }} />
          </View>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(400)}>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.85}
          className="py-4 rounded-2xl mb-6"
          style={{
            backgroundColor: "#FF6B6B",
            shadowColor: "#FF6B6B",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text className="text-white text-base font-bold text-center">
            Découvrir la lettre →
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
