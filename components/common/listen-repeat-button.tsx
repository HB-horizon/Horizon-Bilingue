import { TouchableOpacity, Text, View } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { speechListen, isSpeechSupported } from '@/lib/speech-recognition';

type ListenRepeatButtonProps = {
  expectedText: string;
  onResult?: (correct: boolean) => void;
  disabled?: boolean;
};

type MicState = 'idle' | 'listening' | 'checking' | 'correct' | 'incorrect';

export function ListenRepeatButton({ expectedText, onResult, disabled }: ListenRepeatButtonProps) {
  const [micState, setMicState] = useState<MicState>('idle');
  const [feedback, setFeedback] = useState<string>('');
  const busyRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isSpeechSupported()) return null;

  const handlePress = async () => {
    if (busyRef.current || micState === 'listening' || micState === 'checking') return;
    busyRef.current = true;
    setMicState('listening');
    setFeedback('');

    try {
      const result = await speechListen(expectedText, { lang: 'ar' });
      if (result.isCorrect) {
        setMicState('correct');
        setFeedback(`✓ "${result.transcript}"`);
        onResult?.(true);
      } else {
        setMicState('incorrect');
        setFeedback(`"${result.transcript}" — essaie encore !`);
        onResult?.(false);
      }
    } catch (e: any) {
      setMicState('idle');
      setFeedback(e.message ?? 'Erreur');
    } finally {
      busyRef.current = false;
      timeoutRef.current = setTimeout(() => {
        setMicState((prev) => (prev === 'correct' || prev === 'incorrect') ? 'idle' : prev);
        setFeedback('');
      }, 3000);
    }
  };

  const getStyle = () => {
    switch (micState) {
      case 'idle': return { bg: '#6366F1', pulse: false };
      case 'listening': return { bg: '#F59E0B', pulse: true };
      case 'checking': return { bg: '#6366F1', pulse: false };
      case 'correct': return { bg: '#10B981', pulse: false };
      case 'incorrect': return { bg: '#EF4444', pulse: false };
    }
  };

  const s = getStyle();

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || micState === 'listening' || micState === 'checking'}
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
        <Text className="text-3xl">
          {micState === 'listening' ? '🎤' : micState === 'correct' ? '✓' : micState === 'incorrect' ? '✗' : '🎤'}
        </Text>
      </TouchableOpacity>

      <Text className="text-xs mt-2 font-medium" style={{ color: s.bg }}>
        {micState === 'idle' && 'Répète après le son'}
        {micState === 'listening' && 'Écoute... Parle !'}
        {micState === 'checking' && 'Vérification...'}
        {micState === 'correct' && 'Bravo ! ✓'}
        {micState === 'incorrect' && 'Essaie encore'}
      </Text>

      {feedback ? (
        <Text
          className="text-xs mt-1 text-center px-4"
          style={{ color: micState === 'correct' ? '#6EE7B7' : micState === 'incorrect' ? '#FCA5A5' : '#94A3B8' }}
          numberOfLines={2}
        >
          {feedback}
        </Text>
      ) : null}
    </View>
  );
}
