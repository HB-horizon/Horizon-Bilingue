import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAccessibility, type DyslexiaFont, type BgMode, type LetterSpacing, type LineHeight } from "@/lib/accessibility-provider";
import Animated, { FadeIn } from "react-native-reanimated";
import { useState } from "react";

type Option<T> = { label: string; value: T; desc: string };

const FONT_OPTIONS: Option<DyslexiaFont>[] = [
  { label: "Police par défaut", value: "default", desc: "Police système par défaut" },
  { label: "Lexend", value: "lexend", desc: "Conçue pour une lecture facile" },
  { label: "Atkinson Hyperlegible", value: "atkinson", desc: "Police très lisible" },
];

const BG_OPTIONS: Option<BgMode>[] = [
  { label: "Fond par défaut", value: "default", desc: "Selon le thème clair/sombre" },
  { label: "Crème doux", value: "cream", desc: "#FEFCF3 — réduit la fatigue visuelle" },
  { label: "Bleu doux", value: "soft-blue", desc: "#F0F4FF — apaise les yeux" },
];

const SPACING_OPTIONS: Option<LetterSpacing>[] = [
  { label: "Normal", value: "normal", desc: "Espacement par défaut" },
  { label: "Élargi", value: "wide", desc: "0.05em entre les lettres" },
  { label: "Très élargi", value: "wider", desc: "0.10em entre les lettres" },
];

const LINE_HEIGHT_OPTIONS: Option<LineHeight>[] = [
  { label: "Normal", value: "normal", desc: "Hauteur de ligne par défaut" },
  { label: "Détendu", value: "relaxed", desc: "Plus d'espace entre les lignes" },
  { label: "Large", value: "loose", desc: "Encore plus d'espace" },
];

function ChipGroup<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View className="mb-5">
      <Text className="text-sm font-extrabold mb-2" style={{ color: "#F1F5F9" }}>{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.8}
              className="rounded-xl px-3.5 py-2.5"
              style={{
                backgroundColor: active ? "#6366F1" : "#1E293B",
                borderWidth: 1,
                borderColor: active ? "#6366F1" : "#334155",
              }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: active ? "#FFFFFF" : "#94A3B8" }}
              >
                {opt.label}
              </Text>
              <Text
                className="text-[10px] mt-0.5"
                style={{ color: active ? "#C7D2FE" : "#64748B" }}
              >
                {opt.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ToggleRow({ label, desc, value, onChange }: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 px-4 rounded-2xl mb-3" style={{ backgroundColor: "#1E293B" }}>
      <View className="flex-1 mr-3">
        <Text className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{label}</Text>
        <Text className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#334155", true: "#6366F1" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function AccessibilityScreen() {
  const router = useRouter();
  const { settings, update, reset } = useAccessibility();
  const [preview, setPreview] = useState(false);

  const previewStyle = preview ? {
    letterSpacing: settings.letterSpacing !== "normal" ? (settings.letterSpacing === "wide" ? 1 : 2) : 0,
    lineHeight: settings.lineHeight !== "normal" ? (settings.lineHeight === "relaxed" ? 22 : 26) : 18,
  } : {};

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2">
            <Text className="text-xl" style={{ color: "#94A3B8" }}>←</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-sm font-semibold" style={{ color: "#64748B" }}>Accessibilité</Text>
            <Text className="text-xl font-extrabold" style={{ color: "#F1F5F9" }}>Lecture & Dyslexie</Text>
          </View>
        </View>

        {/* Intro */}
        <Animated.View entering={FadeIn.duration(400)} className="rounded-2xl p-4 mb-6" style={{ backgroundColor: "#1E293B", borderLeftWidth: 4, borderLeftColor: "#6366F1" }}>
          <Text className="text-sm leading-6" style={{ color: "#CBD5E1" }}>
            Personnalise l&apos;application pour une lecture plus confortable. Ces réglages sont conçus pour aider les enfants dyslexiques et tous ceux qui préfèrent une lecture plus aérée.
          </Text>
        </Animated.View>

        {/* Font Family */}
        <View className="mb-2">
          <ChipGroup
            label="Police d'écriture"
            options={FONT_OPTIONS}
            value={settings.fontFamily}
            onChange={(v) => update({ fontFamily: v })}
          />
        </View>

        {/* Background */}
        <View className="mb-2">
          <ChipGroup
            label="Couleur de fond"
            options={BG_OPTIONS}
            value={settings.bgMode}
            onChange={(v) => update({ bgMode: v })}
          />
        </View>

        {/* Letter Spacing */}
        <View className="mb-2">
          <ChipGroup
            label="Espacement des lettres"
            options={SPACING_OPTIONS}
            value={settings.letterSpacing}
            onChange={(v) => update({ letterSpacing: v })}
          />
        </View>

        {/* Line Height */}
        <View className="mb-2">
          <ChipGroup
            label="Espacement des lignes"
            options={LINE_HEIGHT_OPTIONS}
            value={settings.lineHeight}
            onChange={(v) => update({ lineHeight: v })}
          />
        </View>

        {/* Toggles */}
        <Text className="text-sm font-extrabold mb-3 mt-4" style={{ color: "#F1F5F9" }}>Options supplémentaires</Text>

        <ToggleRow
          label="Texte agrandi"
          desc="Augmente la taille du texte dans toute l'application"
          value={settings.largeText}
          onChange={(v) => update({ largeText: v })}
        />
        <ToggleRow
          label="Réduire les animations"
          desc="Désactive les mouvements et transitions animées"
          value={settings.reduceMotion}
          onChange={(v) => update({ reduceMotion: v })}
        />
        <ToggleRow
          label="Guide de lecture"
          desc="Affiche un guide visuel pour suivre le texte (bientôt disponible)"
          value={settings.readingGuide}
          onChange={(v) => update({ readingGuide: v })}
        />

        {/* Preview */}
        <TouchableOpacity
          onPress={() => setPreview((p) => !p)}
          className="rounded-2xl p-4 mt-4"
          style={{ backgroundColor: "#0F172A", borderWidth: 1, borderColor: "#334155" }}
        >
          <Text className="text-xs font-semibold mb-2" style={{ color: "#64748B" }}>
            {preview ? "Masquer" : "Voir"} un aperçu
          </Text>
          {preview && (
            <Animated.View entering={FadeIn.duration(300)}>
              <Text className="text-base mb-2" style={{ color: "#F1F5F9", letterSpacing: settings.letterSpacing !== "normal" ? (settings.letterSpacing === "wide" ? 0.8 : 1.6) : 0, lineHeight: settings.lineHeight !== "normal" ? (settings.lineHeight === "relaxed" ? 26 : 30) : 20 }}>
                Voici un exemple de texte avec tes réglages actuels. Les voyelles et les lettres sont plus espacées pour une lecture plus facile.
              </Text>
              <Text className="text-xl font-bold text-center" style={{ color: "#FF6B6B", letterSpacing: settings.letterSpacing !== "normal" ? (settings.letterSpacing === "wide" ? 2 : 3) : 0 }}>
                بَسْمَلَة
              </Text>
              <Text className="text-xs text-center mt-1" style={{ color: "#64748B" }}>
                {'"basmala" — exemple en arabe'}
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>

        {/* Reset */}
        <TouchableOpacity
          onPress={reset}
          className="py-3 px-6 rounded-2xl mt-6 items-center"
          style={{ backgroundColor: "#7F1D1D", borderWidth: 1, borderColor: "#EF4444" }}
        >
          <Text className="text-sm font-bold" style={{ color: "#FCA5A5" }}>↺ Réinitialiser les réglages</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
