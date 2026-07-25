import { withSpring, withTiming, withSequence, Easing, type AnimatableValue } from "react-native-reanimated";

export const SPRING_BOUNCE = { damping: 10, stiffness: 200, mass: 0.5 };

export function popIn() {
  return withSpring(1, { damping: 8, stiffness: 250, mass: 0.4 });
}

export function pressIn() {
  return withSpring(0.92, { damping: 15, stiffness: 300 });
}

export function pressOut() {
  return withSpring(1, { damping: 10, stiffness: 200 });
}

export function pulseLoop() {
  return withSequence(withSpring(1.06, SPRING_BOUNCE), withSpring(1, SPRING_BOUNCE));
}

export function slideUp(delay = 0, duration = 400) {
  return { entering: { delay, duration, easing: Easing.out(Easing.cubic) } };
}

export function staggerIndex(index: number, baseDelay = 80) {
  return index * baseDelay;
}

export function glowPulse() {
  return withSequence(
    withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
    withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
  );
}

export const EASING_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
