import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AudioButton } from './audio-button';

type LetterCardProps = {
  letter: string;
  latinName: string;
  harakat?: 'fatha' | 'damma' | 'kasra';
  onPress?: () => void;
  showAudio?: boolean;
  variant?: 'default' | 'compact';
};

export function LetterCard({
  letter,
  latinName,
  harakat = 'fatha',
  onPress,
  showAudio = true,
  variant = 'default',
}: LetterCardProps) {
  if (variant === 'compact') {
    return (
      <Animated.View entering={FadeIn.duration(400)}>
        <TouchableOpacity
          onPress={onPress}
          className="bg-surface p-3 rounded-xl border-2 border-primary active:opacity-70 flex-row items-center gap-3"
        >
          <Text className="text-3xl">{letter}</Text>
          <Text className="text-base text-muted flex-1">{latinName}</Text>
          {showAudio && <AudioButton letter={letter} harakat={harakat} size="sm" />}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <TouchableOpacity
        onPress={onPress}
        className="bg-surface p-6 rounded-2xl border-2 border-primary active:opacity-70 items-center"
      >
        <Text className="text-7xl mb-3">{letter}</Text>
        <View className="bg-primary px-4 py-2 rounded-full mb-4">
          <Text className="text-white font-bold text-lg">{latinName}</Text>
        </View>
        {showAudio && <AudioButton letter={letter} harakat={harakat} size="md" />}
      </TouchableOpacity>
    </Animated.View>
  );
}
