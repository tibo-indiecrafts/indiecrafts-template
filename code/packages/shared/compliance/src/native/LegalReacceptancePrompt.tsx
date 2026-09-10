import { View, StyleSheet } from "react-native";
import {
  Button,
  ThemedText,
  useTheme,
} from "@indiecrafts/packages-mobile-ui-native";
import type { LegalReacceptanceCopy } from "../shared/legal";

/**
 * "Our legal documents changed — please review & accept" popup (React Native). Mount it
 * at the shell root ONLY when re-acceptance is due (`needsReacceptance(store.get(),
 * currentVersion)`). `onReview` opens the legal screen (the Phase-2 link-out); `onAccept`
 * persists a `LegalAcceptanceRecord`. Themed from the shared tokens.
 */
export function LegalReacceptancePrompt({
  copy,
  onReview,
  onAccept,
}: {
  copy: LegalReacceptanceCopy;
  onReview: () => void;
  onAccept: () => void;
}) {
  const { theme } = useTheme();
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.root,
        {
          backgroundColor: theme.color.card,
          borderColor: theme.color.border,
          borderRadius: theme.radius,
        },
      ]}
    >
      <ThemedText style={styles.title}>{copy.title}</ThemedText>
      <ThemedText variant="muted" style={styles.body}>
        {copy.body}
      </ThemedText>
      <View style={styles.actions}>
        <Button label={copy.reviewLabel} variant="outline" onPress={onReview} />
        <Button label={copy.acceptLabel} onPress={onAccept} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  title: { fontSize: 15, fontWeight: "600" },
  body: { fontSize: 13 },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
  },
});
