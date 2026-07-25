import { View, Text, TouchableOpacity, Image, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useEffect, useRef, useState } from "react";
import { loadProgress } from "@/lib/progress-manager";

const STARS = Array.from({ length: 40 }, (_, i) =>
  ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    size: 1 + (i % 3),
    opacity: 0.2 + ((i * 17) % 80) / 100,
    delay: (i * 120) % 2000,
  }) as const
);

export default function HomeScreen() {
  const router = useRouter();
  const [nextDay, setNextDay] = useState(1);

  const logoScale = useRef(new Animated.Value(0.6)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonY = useRef(new Animated.Value(40)).current;
  const moonRotation = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProgress().then((progress) => {
      setNextDay(progress.currentDay);
    });

    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonY, {
        toValue: 0,
        duration: 600,
        delay: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(moonRotation, {
        toValue: 1,
        duration: 2000,
        delay: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(starOpacity, {
        toValue: 1,
        duration: 1500,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.06,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const timer = setTimeout(() => pulse.start(), 1500);
    return () => {
      clearTimeout(timer);
      pulse.stop();
    };
  }, []);

  return (
    <ScreenContainer
      edges={["top", "bottom", "left", "right"]}
      containerClassName="bg-navy"
    >
      {/* Gradient overlay */}
      <View className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.3)" }} />

      {/* Decorative geometric pattern - top right */}
      <View className="absolute top-0 right-0 w-48 h-48 opacity-10">
        <View
          className="absolute top-8 right-8 w-32 h-32 border-2 border-gold rounded-full"
          style={{ transform: [{ rotate: "45deg" }] }}
        />
        <View className="absolute top-16 right-16 w-16 h-16 border border-gold rounded-full" />
      </View>

      {/* Decorative geometric pattern - bottom left */}
      <View className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
        <View className="absolute bottom-12 left-8 w-24 h-24 border-2 border-gold rounded-full" />
        <View className="absolute bottom-24 left-20 w-8 h-8 border border-gold rounded-full" />
      </View>

      {/* Animated stars */}
      <Animated.View className="absolute inset-0" style={{ opacity: starOpacity }}>
        {STARS.map((star) => (
          <View
            key={star.id}
            className="absolute bg-gold rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </Animated.View>

      {/* Crescent moon decoration */}
      <Animated.View
        className="absolute top-12 right-8"
        style={{
          transform: [
            { rotate: moonRotation.interpolate({ inputRange: [0, 1], outputRange: ["-30deg", "0deg"] }) },
          ],
          opacity: moonRotation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.6, 0.4] }),
        }}
      >
        <Text style={{ fontSize: 48, color: "#FCD34D" }}>☪</Text>
      </Animated.View>

      {/* Main content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Logo with glow effect */}
        <Animated.View
          style={{ transform: [{ scale: logoScale }] }}
          className="items-center mb-6"
        >
          <View className="relative">
            <View className="absolute -inset-6 bg-gold/20 rounded-full blur-xl" />
            <View className="w-36 h-36 items-center justify-center bg-navy/80 rounded-full border-2 border-gold/40">
              <Image
                source={require("@/assets/images/icon.png")}
                className="w-28 h-28"
                resizeMode="contain"
              />
            </View>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleY }],
          }}
          className="items-center mb-8"
        >
          <Text
            className="text-4xl font-extrabold text-center mb-2"
            style={{ color: "#FCD34D" }}
          >
            Horizon Bilingue
          </Text>
          <View className="w-16 h-0.5 bg-gold/60 rounded-full mb-3" />
          <Text
            className="text-lg text-center italic mb-1"
            style={{ color: "#FDE68A" }}
          >
            Apprends l&apos;arabe en 30 jours
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: "#94A3B8" }}>
            Découvre les 29 lettres de l&apos;alphabet arabe
          </Text>
        </Animated.View>

        {/* Mascot */}
        <View className="items-center mb-8">
          <View className="bg-surface/10 rounded-2xl px-6 py-3 border border-gold/20">
            <Text className="text-4xl mb-1">🦉</Text>
            <Text className="text-xs font-medium text-center" style={{ color: "#FDE68A" }}>
              Houda t&apos;attend !
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [{ translateY: buttonY }],
          }}
          className="w-full max-w-sm gap-3"
        >
          <TouchableOpacity
            onPress={() => router.push("/dashboard")}
            className="py-4 px-8 rounded-2xl active:opacity-80"
            style={{
              backgroundColor: "#FF6B6B",
              shadowColor: "#FF6B6B",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Text className="text-white text-lg font-bold text-center">
              {nextDay === 1
                ? "Commencer l'aventure"
                : `Continuer — Jour ${nextDay}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/parent-guide")}
            className="py-3 px-6 rounded-2xl border active:opacity-70"
            style={{ borderColor: "rgba(252,211,77,0.4)" }}
          >
            <Text className="text-sm font-semibold text-center" style={{ color: "#FCD34D" }}>
              📖 Guide
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom tagline */}
      <View className="pb-8 px-6">
        <Text className="text-xs text-center" style={{ color: "#64748B" }}>
          ✨ Chaque jour, une nouvelle lettre, un nouveau badge ✨
        </Text>
      </View>
    </ScreenContainer>
  );
}
