import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

type BadgeCardProps = {
  dayNumber: number;
  letter: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  isSpecial?: boolean;
  onPress?: () => void;
};

const BADGE_SIZE = 72;

export function BadgeCard({
  dayNumber,
  letter,
  isUnlocked,
  isCompleted,
  isCurrent,
  isSpecial = false,
  onPress,
}: BadgeCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isUnlocked ? 1 : 0.4);

  useEffect(() => {
    if (isCurrent && isUnlocked) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.08, { damping: 8, stiffness: 120 }),
          withSpring(1, { damping: 8, stiffness: 120 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withSpring(1);
    }
    opacity.value = withTiming(isUnlocked ? 1 : 0.4, { duration: 300 });
  }, [isCurrent, isUnlocked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getColors = () => {
    if (!isUnlocked) return { bg: "#1E293B", border: "#334155", text: "#475569" };
    if (isCompleted) return { bg: "#064E3B", border: "#10B981", text: "#6EE7B7" };
    if (isCurrent) return { bg: "#7F1D1D", border: "#EF4444", text: "#FCA5A5" };
    if (isSpecial) return { bg: "#78350F", border: "#F59E0B", text: "#FCD34D" };
    return { bg: "#1E293B", border: "#6366F1", text: "#A5B4FC" };
  };

  const c = getColors();

  return (
    <TouchableOpacity
      onPress={() => isUnlocked && onPress?.()}
      disabled={!isUnlocked}
      activeOpacity={0.7}
    >
      <Animated.View style={animatedStyle}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: c.bg,
              borderColor: c.border,
            },
          ]}
        >
          <Text style={[styles.letter, { color: isUnlocked ? "#F1F5F9" : "#475569" }]}>
            {isUnlocked ? letter : "🔒"}
          </Text>
          <Text style={[styles.dayNumber, { color: c.text }]}>
            {dayNumber}
          </Text>

          {isCompleted && (
            <View style={styles.checkBadge}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          )}

          {isCurrent && isUnlocked && (
            <View style={styles.currentRing} />
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  letter: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  dayNumber: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 1,
  },
  checkBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  currentRing: {
    position: "absolute",
    inset: -4,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#EF4444",
    opacity: 0.5,
  },
});
