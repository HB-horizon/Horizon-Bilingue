import { View, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useAccessibility } from "@/lib/accessibility-provider";
import { cn } from "@/lib/utils";

export interface ScreenContainerProps extends ViewProps {
  edges?: Edge[];
  className?: string;
  containerClassName?: string;
  safeAreaClassName?: string;
}

export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  style,
  ...props
}: ScreenContainerProps) {
  const { settings } = useAccessibility();

  const fontFamily = settings.fontFamily === "lexend"
    ? "Lexend, system-ui, -apple-system, sans-serif"
    : settings.fontFamily === "atkinson"
      ? "Atkinson Hyperlegible, system-ui, -apple-system, sans-serif"
      : undefined;

  const letterSpacing = settings.letterSpacing === "wide" ? 0.5
    : settings.letterSpacing === "wider" ? 1
      : undefined;

  const lineHeight = settings.lineHeight === "relaxed" ? 26
    : settings.lineHeight === "loose" ? 30
      : undefined;

  const fontSize = settings.largeText ? 18 : undefined;

  return (
    <View
      className={cn(
        "flex-1",
        "bg-background",
        containerClassName
      )}
      {...props}
    >
      <SafeAreaView
        edges={edges}
        className={cn("flex-1", safeAreaClassName)}
        style={[
          style,
          fontFamily ? { fontFamily } as any : undefined,
          letterSpacing ? { letterSpacing } as any : undefined,
          lineHeight ? { lineHeight } as any : undefined,
          fontSize ? { fontSize } as any : undefined,
        ].filter(Boolean)}
      >
        <View className={cn("flex-1", className)}>{children}</View>
      </SafeAreaView>
    </View>
  );
}
