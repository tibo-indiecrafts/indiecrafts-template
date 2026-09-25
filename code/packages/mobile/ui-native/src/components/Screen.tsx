/**
 * Render a full-bleed themed native page root.
 *
 * @see docs/reference/packages/mobile/ui-native/src/components/Screen.md
 */
import type { ReactNode } from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";
import { useTheme } from "../theme";

/** Full-bleed themed page root (`background` token). Wrap every screen. */
export function Screen({
  children,
  style,
}: {
  children?: ReactNode;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.root, { backgroundColor: theme.color.background }, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
