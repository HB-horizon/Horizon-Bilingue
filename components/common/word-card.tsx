import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState } from 'react';

type WordCardProps = {
  arabic: string;
  latin: string;
  image?: string | null;
  onPress?: () => void;
};

export function WordCard({ arabic, latin, image, onPress }: WordCardProps) {
  const [played, setPlayed] = useState(false);

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <TouchableOpacity
        onPress={() => {
          setPlayed(true);
          onPress?.();
        }}
        className="bg-surface p-5 rounded-xl border-2 border-primary active:opacity-70"
      >
        <View className="flex-row items-center">
          {image && <Text className="text-4xl mr-4">{image}</Text>}
          <View className="flex-1">
            <Text className="text-3xl text-foreground mb-1">{arabic}</Text>
            <Text className="text-lg text-muted">{latin}</Text>
          </View>
          <View className={`w-14 h-14 rounded-full items-center justify-center ${played ? 'bg-success' : 'bg-primary'}`}>
            <Text className="text-2xl">{played ? '✓' : '🔊'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
