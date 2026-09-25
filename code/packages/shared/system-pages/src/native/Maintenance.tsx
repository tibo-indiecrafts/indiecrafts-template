/**
 * Render the native full-screen maintenance page.
 *
 * @see docs/reference/packages/shared/system-pages/src/native/Maintenance.md
 */
import { View, Text, Linking, Pressable, StyleSheet } from "react-native";
import type { MaintenanceProps } from "../shared/types";
import { useColors } from "./theme";

/**
 * Full-screen maintenance page (React Native). Same copy contract as web; the app
 * resolves the strings. Themed from the shared tokens — readable in light + dark.
 */
export function Maintenance({
  statusLabel,
  title,
  body,
  contactLabel,
  name,
  email,
}: MaintenanceProps) {
  const c = useColors();
  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View style={styles.card}>
        <Text style={[styles.status, { color: c.brand }]}>{statusLabel}</Text>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: c.foreground }]}
        >
          {title}
        </Text>
        <Text style={[styles.body, { color: c["muted-foreground"] }]}>
          {body}
        </Text>
        {email ? (
          <Pressable
            accessibilityRole="link"
            hitSlop={12}
            onPress={() => Linking.openURL(`mailto:${email}`)}
          >
            <Text style={[styles.contact, { color: c.brand }]}>
              {contactLabel} {email}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={[styles.footer, { color: c["muted-foreground"] }]}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: { maxWidth: 420, alignItems: "center", gap: 20 },
  status: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  title: { fontSize: 40, fontWeight: "600", textAlign: "center" },
  body: { fontSize: 18, textAlign: "center" },
  contact: { fontSize: 14, fontWeight: "500", paddingVertical: 8 },
  footer: {
    position: "absolute",
    bottom: 32,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
