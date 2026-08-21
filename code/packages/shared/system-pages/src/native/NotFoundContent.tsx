import { View, Text, Pressable, StyleSheet } from "react-native";
import type { NotFoundContentProps as BaseProps } from "../shared/types";
import { useColors } from "./theme";

export type NotFoundContentProps = BaseProps & {
  /** "Go home" action (RN nav — e.g. `router.replace("/")`). */
  onGoHome?: () => void;
};

/**
 * Presentational 404 screen (React Native). Same copy contract as the web
 * `NotFoundContent`; the app resolves the strings + owns navigation via `onGoHome`.
 * Themed from the shared tokens (`useColors`) so it is readable in light + dark and
 * self-sufficient (owns its background — the error boundary may not wrap it).
 */
export function NotFoundContent({
  eyebrow,
  title,
  description,
  homeLabel,
  onGoHome,
}: NotFoundContentProps) {
  const c = useColors();
  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <Text style={[styles.eyebrow, { color: c.brand }]}>{eyebrow}</Text>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: c.foreground }]}
      >
        {title}
      </Text>
      <Text style={[styles.body, { color: c["muted-foreground"] }]}>
        {description}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onGoHome}
        style={({ pressed }) => [
          styles.button,
          { borderColor: c.border, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.buttonLabel, { color: c.foreground }]}>
          {homeLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  eyebrow: {
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  title: { fontSize: 32, fontWeight: "600", textAlign: "center" },
  body: { fontSize: 16, textAlign: "center" },
  button: {
    marginTop: 16,
    minHeight: 44,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: { fontSize: 14, fontWeight: "500" },
});
