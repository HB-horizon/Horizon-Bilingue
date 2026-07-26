import { TouchableOpacity, StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface HamburgerButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
}

export function HamburgerButton({
  onPress,
  style,
  color = "#F1F5F9",
}: HamburgerButtonProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? 0.9 : 1) }],
  }));

  const handlePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Animated.View style={[styles.inner, animatedStyle]}>
        <Animated.View style={[styles.bar, { backgroundColor: color }, { marginTop: 0 }]} />
        <Animated.View style={[styles.bar, { backgroundColor: color }, { marginTop: 6 }]} />
        <Animated.View style={[styles.bar, { backgroundColor: color }, { marginTop: 6, width: 16 }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.6)",
  },
  inner: {
    alignItems: "flex-start",
  },
  bar: {
    height: 2,
    borderRadius: 1,
    width: 20,
  },
});
