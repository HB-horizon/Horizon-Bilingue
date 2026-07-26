import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useProgress } from "@/hooks/use-progress";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 300);

interface DrawerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS: Array<{
  label: string;
  route: string;
  icon: string;
  color: string;
  minProgress?: number;
  useCurrentDay?: boolean;
}> = [
  { label: "Apprentissage des lettres", route: "/lesson/", icon: "🔤", color: "#FF6B6B", useCurrentDay: true },
  { label: "Lire Al-Fatiha", route: "/lesson/30", icon: "📖", color: "#F59E0B", minProgress: 15 },
  { label: "Tableau de bord", route: "/dashboard", icon: "📊", color: "#10B981" },
  { label: "Vocabulaire", route: "/vocabulary", icon: "📚", color: "#8B5CF6" },
  { label: "Révision", route: "/revision", icon: "🔄", color: "#06B6D4" },
  { label: "Révision SRS", route: "/revision/srs", icon: "🧠", color: "#6366F1" },
  { label: "Jeux", route: "/games", icon: "🎮", color: "#10B981", minProgress: 4 },
  { label: "Récompenses", route: "/rewards", icon: "🏆", color: "#FCD34D", minProgress: 1 },
];

const BOTTOM_ITEMS = [
  { label: "Guide pour parents", route: "/parent-guide", icon: "👨‍👩‍👧" },
  { label: "Accessibilité", route: "/accessibility", icon: "♿" },
] as const;

export function DrawerOverlay({ isOpen, onClose }: DrawerOverlayProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { progress, loading } = useProgress();
  const completed = progress?.completedDays.length ?? 0;
  const percentage = loading ? 0 : Math.round((completed / 29) * 100);
  const [lockedMessage, setLockedMessage] = useState<{ label: string; needed: number } | null>(null);

  const translateX = useSharedValue(-DRAWER_WIDTH);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withSpring(0, {
        damping: 25,
        stiffness: 200,
        mass: 0.8,
      });
      overlayOpacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) });
    } else {
      translateX.value = withSpring(-DRAWER_WIDTH, {
        damping: 25,
        stiffness: 200,
        mass: 0.8,
      });
      overlayOpacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.cubic) });
    }
  }, [isOpen]);

  const closeWithHaptic = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const navigateTo = (route: string, useCurrentDay?: boolean) => {
    closeWithHaptic();
    const targetRoute = useCurrentDay ? `${route}${progress?.currentDay ?? 1}` : route;
    setTimeout(() => router.push(targetRoute as any), 200);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(-DRAWER_WIDTH, e.translationX);
        overlayOpacity.value = Math.max(0, 1 + e.translationX / DRAWER_WIDTH);
      }
    })
    .onEnd((e) => {
      if (e.translationX < -DRAWER_WIDTH * 0.4 || e.velocityX < -300) {
        runOnJS(closeWithHaptic)();
      } else {
        translateX.value = withSpring(0, { damping: 25, stiffness: 200 });
        overlayOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (!isOpen && translateX.value === -DRAWER_WIDTH) return null;

  return (
    <View style={styles.root} pointerEvents={isOpen ? "auto" : "none"}>
      {/* Backdrop */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeWithHaptic} activeOpacity={1} />
      </Animated.View>

      {/* Drawer panel */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.drawer,
            drawerStyle,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>🦉</Text>
            </View>
            <Text style={styles.appName}>Horizon Bilingue</Text>
            <Text style={styles.subtitle}>Apprends l&apos;arabe en 30 jours</Text>

            <View style={styles.progressPill}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percentage}%` },
                    percentage === 100 && { backgroundColor: "#10B981" },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {completed}/29 lettres · {percentage}%
              </Text>
            </View>
          </View>

          {/* Nav items */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Navigation</Text>
            {NAV_ITEMS.map((item) => {
              const isLocked = item.minProgress !== undefined && completed < item.minProgress;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.navItem, isLocked && { opacity: 0.6 }]}
                  onPress={() => {
                    if (isLocked && item.minProgress) {
                      setLockedMessage({ label: item.label, needed: item.minProgress });
                    } else if (!isLocked) {
                      navigateTo(item.route, item.useCurrentDay);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.navIcon, { backgroundColor: `${item.color}20` }]}>
                    <Text style={styles.navEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.navLabel, isLocked && { color: "#475569" }]}>
                    {item.label}
                  </Text>
                  {isLocked ? (
                    <Text style={styles.lockIcon}>🔒</Text>
                  ) : (
                    <Text style={styles.navArrow}>›</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {lockedMessage && (
            <TouchableOpacity
              style={styles.lockedBanner}
              onPress={() => setLockedMessage(null)}
              activeOpacity={0.8}
            >
              <View style={styles.lockedBannerHeader}>
                <Text style={styles.lockedBannerIcon}>🔒</Text>
                <Text style={styles.lockedBannerTitle}>{lockedMessage.label}</Text>
              </View>
              <Text style={styles.lockedBannerText}>
                Tu dois apprendre <Text style={{ color: "#FCD34D", fontWeight: "bold" }}>{lockedMessage.needed} lettres</Text> pour débloquer cette fonctionnalité.
              </Text>
              <Text style={styles.lockedBannerSubtext}>
                {lockedMessage.needed - completed > 0
                  ? `Encore ${lockedMessage.needed - completed} lettre${lockedMessage.needed - completed > 1 ? "s" : ""} à apprendre !`
                  : "Continue à apprendre !"}
              </Text>
              <View style={styles.lockedBannerProgress}>
                <View style={styles.lockedBannerProgressBar}>
                  <View
                    style={[
                      styles.lockedBannerProgressFill,
                      { width: `${Math.min((completed / lockedMessage.needed) * 100, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.lockedBannerProgressText}>
                  {completed}/{lockedMessage.needed}
                </Text>
              </View>
              <Text style={styles.lockedBannerClose}>Appuye pour fermer</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />

          {/* Bottom items */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Plus</Text>
            {BOTTOM_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.navItem}
                onPress={() => navigateTo(item.route)}
                activeOpacity={0.6}
              >
                <View style={[styles.navIcon, { backgroundColor: "#334155" }]}>
                  <Text style={styles.navEmoji}>{item.icon}</Text>
                </View>
                <Text style={styles.navLabel}>{item.label}</Text>
                <Text style={styles.navArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Horizon Bilingue v1.0</Text>
            <Text style={styles.footerSubtext}>🌍 Chaque lettre est une porte</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#0F172A",
    borderRightWidth: 1,
    borderRightColor: "#1E293B",
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#FCD34D",
  },
  avatarEmoji: {
    fontSize: 30,
  },
  appName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F1F5F9",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  progressPill: {
    marginTop: 14,
    backgroundColor: "#1E293B",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  progressBar: {
    height: 5,
    backgroundColor: "#334155",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B6B",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 12,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 1,
  },
  navIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  navEmoji: {
    fontSize: 16,
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
  },
  navArrow: {
    fontSize: 18,
    color: "#475569",
    fontWeight: "300",
  },
  lockIcon: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: "auto",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
    fontWeight: "500",
  },
  footerSubtext: {
    fontSize: 10,
    color: "#334155",
    textAlign: "center",
    marginTop: 2,
  },
  lockedBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F59E0B50",
  },
  lockedBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  lockedBannerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  lockedBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F1F5F9",
    flex: 1,
  },
  lockedBannerText: {
    fontSize: 12,
    color: "#CBD5E1",
    lineHeight: 18,
    marginBottom: 4,
  },
  lockedBannerSubtext: {
    fontSize: 11,
    color: "#F59E0B",
    fontWeight: "600",
    marginBottom: 10,
  },
  lockedBannerProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  lockedBannerProgressBar: {
    flex: 1,
    height: 5,
    backgroundColor: "#334155",
    borderRadius: 3,
    overflow: "hidden",
  },
  lockedBannerProgressFill: {
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: 3,
  },
  lockedBannerProgressText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },
  lockedBannerClose: {
    fontSize: 10,
    color: "#475569",
    textAlign: "center",
  },
});
