import { TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { playLetterSound } from '@/lib/audio-manager';

type AudioButtonProps = {
  letter: string;
  harakat?: 'fatha' | 'damma' | 'kasra';
  size?: 'sm' | 'md' | 'lg';
  onPlay?: () => void;
};

const sizeMap = {
  sm: { container: 'w-10 h-10', icon: 'text-xl' },
  md: { container: 'w-14 h-14', icon: 'text-2xl' },
  lg: { container: 'w-16 h-16', icon: 'text-3xl' },
};

export function AudioButton({ letter, harakat = 'fatha', size = 'md', onPlay }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);

  const handlePress = async () => {
    if (playing) return;
    setPlaying(true);
    await playLetterSound(letter, harakat);
    onPlay?.();
    setTimeout(() => setPlaying(false), 600);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${sizeMap[size].container} rounded-full items-center justify-center shadow-lg active:opacity-70 ${
        playing ? 'bg-success' : 'bg-primary'
      }`}
    >
      <Text className={sizeMap[size].icon}>{playing ? '✓' : '🔊'}</Text>
    </TouchableOpacity>
  );
}
