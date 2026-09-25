/**
 * Render a themed native card surface over the shared tokens.
 *
 * @see docs/reference/packages/mobile/ui-native/src/components/Card.md
 */
import type { ReactNode } from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";
import { useTheme } from "../theme";

/** Themed surface — `card` token background, `border`, themed radius. */
export function Card({
  children,
  style,
}: {
  children?: ReactNode;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.color.card,
          borderColor: theme.color.border,
          borderRadius: theme.radius,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderWidth: 1, gap: 8 },
});
