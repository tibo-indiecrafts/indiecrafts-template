import { View, Text, Pressable, StyleSheet } from "react-native";
import type { ErrorContentProps } from "../shared/types";
import { useColors } from "./theme";

export type { ErrorContentProps };

/**
 * Presentational 500 screen (React Native). Same copy contract as web; the app
 * owns `onRetry`. Themed from the shared tokens — retry is a filled brand button
 * (matches the web primary), readable in light + dark, self-sufficient background.
 */
export function ErrorContent({
  title,
  description,
  retryLabel,
  onRetry = () => undefined,
}: ErrorContentProps) {
  const c = useColors();
  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
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
        onPress={onRetry}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: c.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.buttonLabel, { color: c["primary-foreground"] }]}>
          {retryLabel}
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
  title: { fontSize: 28, fontWeight: "600", textAlign: "center" },
  body: { fontSize: 16, textAlign: "center" },
  button: {
    marginTop: 16,
    minHeight: 44,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: { fontSize: 14, fontWeight: "600" },
});
