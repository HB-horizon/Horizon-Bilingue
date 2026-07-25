import { TouchableOpacity, type TouchableOpacityProps, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { pressIn, pressOut } from "@/lib/animation-presets";

type AnimatedButtonProps = TouchableOpacityProps & {
  variant?: "primary" | "success" | "ghost";
  size?: "sm" | "md" | "lg";
  title: string;
  icon?: string;
  color?: string;
};

const VARIANT_STYLES = {
  primary: { bg: "#FF6B6B", text: "#FFFFFF" },
  success: { bg: "#10B981", text: "#FFFFFF" },
  ghost: { bg: "transparent", text: "#FF6B6B" },
};

const SIZE_STYLES = {
  sm: { py: 10, px: 20, fontSize: 13, iconSize: 16 },
  md: { py: 14, px: 28, fontSize: 15, iconSize: 20 },
  lg: { py: 16, px: 32, fontSize: 17, iconSize: 24 },
};

export function AnimatedButton({
  variant = "primary",
  size = "md",
  title,
  icon,
  color,
  style,
  onPress,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];
  const mainColor = color || variantStyle.bg;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    glowOpacity.value = withTiming(0.3, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    glowOpacity.value = withTiming(0, { duration: 200 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <View className="relative">
        <Animated.View
          className="absolute inset-0 rounded-2xl"
          style={[{ backgroundColor: mainColor }, glowStyle]}
        />
        <TouchableOpacity
          onPress={disabled ? undefined : onPress}
          onPressIn={disabled ? undefined : handlePressIn}
          onPressOut={disabled ? undefined : handlePressOut}
          activeOpacity={0.9}
          disabled={disabled}
          style={[
            {
              backgroundColor: disabled ? "#334155" : mainColor,
              paddingVertical: sizeStyle.py,
              paddingHorizontal: sizeStyle.px,
              borderRadius: 16,
              shadowColor: disabled ? undefined : mainColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: disabled ? 0 : 0.35,
              shadowRadius: 12,
              elevation: disabled ? 0 : 6,
              opacity: disabled ? 0.5 : 1,
            },
            style as any,
          ]}
          {...props}
        >
          <View className="flex-row items-center justify-center gap-2">
            {icon && <Text style={{ fontSize: sizeStyle.iconSize }}>{icon}</Text>}
            <Text
              style={{
                color: disabled ? "#64748B" : variantStyle.text,
                fontSize: sizeStyle.fontSize,
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
