import { useEffect, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { View, Text, Dimensions } from "react-native";

type Particle = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  delay: number;
  duration: number;
  size: number;
};

type ConfettiSystemProps = {
  active: boolean;
  count?: number;
  emojis?: string[];
  onComplete?: () => void;
};

const EMOJI_SET = ["🎉", "⭐", "✨", "🌟", "💫", "🎊", "❤️", "🔥", "💥", "🌈"];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function ParticleView({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(-60);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.back(1.5)) });
    translateY.value = withDelay(
      particle.delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration: particle.duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    translateX.value = withRepeat(
      withSequence(
        withTiming(particle.x > SCREEN_WIDTH / 2 ? -40 : 40, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        withTiming(particle.x > SCREEN_WIDTH / 2 ? 40 : -40, { duration: 600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    rotate.value = withRepeat(
      withTiming(360, { duration: particle.duration / 2, easing: Easing.linear }),
      -1
    );
    opacity.value = withDelay(
      particle.delay + particle.duration - 500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    position: "absolute" as const,
    left: particle.x,
    top: particle.y,
  }));

  return (
    <Animated.View style={style} pointerEvents="none">
      <Text style={{ fontSize: particle.size }}>{particle.emoji}</Text>
    </Animated.View>
  );
}

export function ConfettiSystem({
  active,
  count = 30,
  emojis = EMOJI_SET,
  onComplete,
}: ConfettiSystemProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        emoji: emojis[i % emojis.length],
        x: Math.random() * SCREEN_WIDTH,
        y: -100 - Math.random() * 200,
        rotation: Math.random() * 360,
        delay: Math.random() * 800,
        duration: 2000 + Math.random() * 3000,
        size: 14 + Math.random() * 20,
      })),
    [count]
  );

  if (!active) return null;

  return (
    <View className="absolute inset-0" pointerEvents="none" style={{ zIndex: 9999 }}>
      {particles.map((p) => (
        <ParticleView key={p.id} particle={p} />
      ))}
    </View>
  );
}
