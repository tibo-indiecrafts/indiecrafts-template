/**
 * Renders the React Native legal re-acceptance prompt.
 *
 * @see docs/reference/packages/shared/compliance/src/native/LegalReacceptancePrompt.md
 */

import { View, StyleSheet, Text, Linking } from "react-native";
import {
  Button,
  ThemedText,
  useTheme,
} from "@indiecrafts/packages-mobile-ui-native";
import { linkifyMessage, type LegalReacceptanceCopy } from "../shared/legal";

/**
 * "Our legal documents changed — please accept" popup (React Native). Mount it at the
 * shell root ONLY when re-acceptance is due (`needsReacceptance(store.get(),
 * currentVersion)`). `copy.body` carries `[[…]]` link markers; `hrefs` are the matching
 * website policy URLs (privacy · terms) woven inline as tappable `Text` that opens the
 * page in the system browser (`Linking.openURL`). `onAccept` persists a
 * `LegalAcceptanceRecord`. Themed from the shared tokens.
 */
export function LegalReacceptancePrompt({
  copy,
  hrefs,
  onAccept,
}: {
  copy: LegalReacceptanceCopy;
  hrefs: string[];
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
        {linkifyMessage(copy.body, hrefs).map((part, i) =>
          typeof part === "string" ? (
            part
          ) : (
            <Text
              key={i}
              accessibilityRole="link"
              accessibilityLabel={part.label}
              style={styles.link}
              onPress={() => {
                void Linking.openURL(part.href);
              }}
            >
              {part.label}
            </Text>
          ),
        )}
      </ThemedText>
      <View style={styles.actions}>
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
  link: { textDecorationLine: "underline" },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
  },
});
