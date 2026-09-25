/**
 * Renders the React Native per-category consent toggles.
 *
 * @see docs/reference/packages/shared/compliance/src/native/ConsentPreferences.md
 */

import { View, Switch, StyleSheet } from "react-native";
import { ThemedText, useTheme } from "@indiecrafts/packages-mobile-ui-native";
import type { ConsentCategory } from "../shared/consent-signals";

/**
 * Per-category consent toggles (React Native). Presentational + controlled — the
 * parent (`ConsentBanner`) owns the `choices` state and Save. Required categories are
 * an always-on, disabled switch. Themed from the shared tokens via `useTheme`.
 */
export function ConsentPreferences({
  categories,
  choices,
  onChange,
}: {
  categories: readonly ConsentCategory[];
  choices: Record<string, boolean>;
  onChange: (key: string, value: boolean) => void;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.list}>
      {categories.map((c) => (
        <View key={c.key} style={styles.row}>
          <View style={styles.text}>
            <ThemedText style={styles.title}>{c.title}</ThemedText>
            {c.description ? (
              <ThemedText variant="muted" style={styles.desc}>
                {c.description}
              </ThemedText>
            ) : null}
          </View>
          <Switch
            value={c.required || !!choices[c.key]}
            disabled={c.required}
            onValueChange={(v) => onChange(c.key, v)}
            trackColor={{ true: theme.color.primary }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12, paddingVertical: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  text: { flex: 1 },
  title: { fontSize: 14, fontWeight: "500" },
  desc: { fontSize: 12 },
});
