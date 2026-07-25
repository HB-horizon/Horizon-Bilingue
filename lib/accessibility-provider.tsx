import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ASYNC_KEY = "@horizon_bilingue_accessibility";

export type DyslexiaFont = "default" | "lexend" | "atkinson";
export type BgMode = "default" | "cream" | "soft-blue";
export type LetterSpacing = "normal" | "wide" | "wider";
export type LineHeight = "normal" | "relaxed" | "loose";

export type AccessibilitySettings = {
  fontFamily: DyslexiaFont;
  bgMode: BgMode;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;
  reduceMotion: boolean;
  readingGuide: boolean;
  largeText: boolean;
};

const DEFAULTS: AccessibilitySettings = {
  fontFamily: "default",
  bgMode: "default",
  letterSpacing: "normal",
  lineHeight: "normal",
  reduceMotion: false,
  readingGuide: false,
  largeText: false,
};

type AccessibilityContextType = {
  settings: AccessibilitySettings;
  update: (partial: Partial<AccessibilitySettings>) => Promise<void>;
  reset: () => Promise<void>;
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: DEFAULTS,
  update: async () => {},
  reset: async () => {},
});

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULTS);

  const applyCSS = useCallback((s: AccessibilitySettings) => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const root = document.documentElement;

    root.setAttribute("data-access-font", s.fontFamily);
    root.setAttribute("data-access-bg", s.bgMode);
    root.setAttribute("data-access-spacing", s.letterSpacing);
    root.setAttribute("data-access-lineheight", s.lineHeight);
    root.setAttribute("data-access-motion", s.reduceMotion ? "reduced" : "normal");
    root.setAttribute("data-access-large", s.largeText ? "yes" : "no");
  }, []);

  useEffect(() => {
    applyCSS(settings);
  }, [settings, applyCSS]);

  const update = useCallback(async (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const reset = useCallback(async () => {
    setSettings(DEFAULTS);
    AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(DEFAULTS)).catch(() => {});
  }, []);

  const value = useMemo(() => ({ settings, update, reset }), [settings, update, reset]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
