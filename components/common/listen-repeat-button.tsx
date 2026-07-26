import { TouchableOpacity, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation, Easing } from 'react-native-reanimated';
import { useState, useRef, useEffect } from 'react';
import { speechListen, SpeechListenResult } from '@/lib/speech-recognition';
import { playWordSound, playDecomposedLetterSound } from '@/lib/audio-manager';

type ListenRepeatButtonProps = {
  expectedText: string;
  onResult?: (result: SpeechListenResult) => void;
  disabled?: boolean;
  mode?: 'repeat' | 'listen-repeat';
  letter?: string;
  harakat?: 'fatha' | 'damma' | 'kasra';
};

type MicState = 'idle' | 'listening' | 'checking' | 'correct' | 'incorrect' | 'playing-audio';

export function ListenRepeatButton({
  expectedText,
  onResult,
  disabled,
  mode = 'repeat',
  letter,
  harakat = 'fatha',
}: ListenRepeatButtonProps) {
  const [micState, setMicState] = useState<MicState>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const pulseAnim = useSharedValue(1);
  const busyRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cancelAnimation(pulseAnim);
    };
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const startPulse = () => {
    pulseAnim.value = withRepeat(
      withTiming(1.15, { duration: 500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  };

  const stopPulse = () => {
    cancelAnimation(pulseAnim);
    pulseAnim.value = 1;
  };

  const playAudio = async (): Promise<void> => {
    if (letter) {
      await playDecomposedLetterSound(letter, harakat);
    } else {
      await playWordSound(expectedText);
    }
  };

  const handlePress = async () => {
    if (busyRef.current || micState === 'listening' || micState === 'checking' || micState === 'playing-audio') return;
    busyRef.current = true;

    if (mode === 'listen-repeat') {
      setMicState('playing-audio');
      setFeedback('🔊 Écoute...');
      try {
        await playAudio();
      } catch (e) {
        console.warn('[ListenRepeatButton] Audio playback failed:', e);
      }
    }

    setMicState('listening');
    setFeedback('🎤 Parle maintenant !');
    setScore(null);
    setInterimTranscript('');
    startPulse();

    try {
      const result = await speechListen(expectedText, {
        lang: 'ar-SA',
        onInterimResult: setInterimTranscript,
      });

      stopPulse();

      if (result.isCorrect) {
        setMicState('correct');
        setFeedback(`✓ Excellent ! (${result.score}%)`);
        setScore(result.score);
        onResult?.(result);
      } else {
        setMicState('incorrect');
        setFeedback(`"${result.transcript}" — ${result.score}% — Essaie encore !`);
        setScore(result.score);
        onResult?.(result);
      }
    } catch (e: any) {
      stopPulse();
      setMicState('idle');
      setFeedback(e.message ?? 'Erreur');
      setScore(null);
    } finally {
      busyRef.current = false;
      timeoutRef.current = setTimeout(() => {
        setMicState((prev) => (prev === 'correct' || prev === 'incorrect') ? 'idle' : prev);
        setFeedback('');
        setScore(null);
        setInterimTranscript('');
      }, 4000);
    }
  };

  const getStyle = () => {
    switch (micState) {
      case 'idle': return { bg: '#6366F1', icon: '🎤' };
      case 'playing-audio': return { bg: '#3B82F6', icon: '🔊' };
      case 'listening': return { bg: '#F59E0B', icon: '🎤' };
      case 'checking': return { bg: '#6366F1', icon: '⏳' };
      case 'correct': return { bg: '#10B981', icon: '✓' };
      case 'incorrect': return { bg: '#EF4444', icon: '✗' };
    }
  };

  const s = getStyle();

  return (
    <View className="items-center">
      <Animated.View style={pulseStyle}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={disabled || micState === 'listening' || micState === 'checking' || micState === 'playing-audio'}
          activeOpacity={0.7}
          className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{
            backgroundColor: s.bg,
            shadowColor: s.bg,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-3xl">{s.icon}</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text className="text-xs mt-2 font-medium" style={{ color: s.bg }}>
        {micState === 'idle' && (mode === 'listen-repeat' ? '🔊 Écoute, puis répète' : 'Répète après le son')}
        {micState === 'playing-audio' && '🔊 Écoute...'}
        {micState === 'listening' && '🎤 Parle maintenant !'}
        {micState === 'checking' && 'Vérification...'}
        {micState === 'correct' && 'Bravo ! ✓'}
        {micState === 'incorrect' && 'Essaie encore'}
      </Text>

      {interimTranscript && micState === 'listening' && (
        <Text className="text-xs mt-1 text-center px-4" style={{ color: '#94A3B8' }}>
          {interimTranscript}
        </Text>
      )}

      {feedback && (
        <Text
          className="text-xs mt-1 text-center px-4"
          style={{
            color: micState === 'correct' ? '#6EE7B7' : micState === 'incorrect' ? '#FCA5A5' : '#94A3B8',
          }}
          numberOfLines={2}
        >
          {feedback}
        </Text>
      )}

      {score !== null && micState !== 'idle' && (
        <Text className="text-xs mt-1 font-bold" style={{ color: s.bg }}>
          Score : {score}%
        </Text>
      )}
    </View>
  );
}
