import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, ThemedText, useTheme } from "@indiecrafts/packages-mobile-ui-native";
import type { ConsentCategory } from "../shared/consent-signals";
import type { ConsentBannerCopy } from "../shared/consent";
import { ConsentPreferences } from "./ConsentPreferences";

/**
 * The shared cookie-consent banner (React Native). Mount it at the shell root ONLY
 * when consent is needed (the shell reads its `Store` + the `requireConsent` flag).
 * Copy + `categories` are injected. Three choices (Accept all · Reject · Customize);
 * Customize expands the per-category toggles. Themed from the shared tokens.
 */
export function ConsentBanner({
  categories,
  copy,
  initialChoices = {},
  onAccept,
  onReject,
  onSave,
}: {
  categories: readonly ConsentCategory[];
  copy: ConsentBannerCopy;
  initialChoices?: Record<string, boolean>;
  onAccept: () => void;
  onReject: () => void;
  onSave: (choices: Record<string, boolean>) => void;
}) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [choices, setChoices] = useState<Record<string, boolean>>(initialChoices);

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.root,
        { backgroundColor: theme.color.card, borderColor: theme.color.border, borderRadius: theme.radius },
      ]}
    >
      {copy.title ? <ThemedText style={styles.title}>{copy.title}</ThemedText> : null}
      <ThemedText variant="muted" style={styles.body}>
        {copy.body}
      </ThemedText>

      {expanded ? (
        <ConsentPreferences categories={categories} choices={choices} onChange={(key, value) =>
          setChoices((prev) => ({ ...prev, [key]: value }))
        } />
      ) : null}

      <View style={styles.actions}>
        {expanded ? (
          <>
            <Button label={copy.backLabel} variant="outline" onPress={() => setExpanded(false)} />
            <Button label={copy.saveLabel} onPress={() => onSave(choices)} />
          </>
        ) : (
          <>
            <Button label={copy.customizeLabel} variant="outline" onPress={() => setExpanded(true)} />
            <Button label={copy.rejectLabel} variant="secondary" onPress={onReject} />
            <Button label={copy.acceptLabel} onPress={onAccept} />
          </>
        )}
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
  actions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: 8 },
});
