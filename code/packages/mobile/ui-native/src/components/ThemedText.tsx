import { Text, type TextStyle, type AccessibilityRole } from "react-native";
import type { ReactNode } from "react";
import { useTheme } from "../theme";

type Variant = "body" | "title" | "eyebrow" | "muted";

const VARIANT: Record<Variant, TextStyle> = {
  body: { fontSize: 16, fontWeight: "400" },
  title: { fontSize: 28, fontWeight: "600" },
  eyebrow: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  muted: { fontSize: 16, fontWeight: "400" },
};

/** Themed text — `foreground` token, or `muted-foreground` for `variant="muted"`. */
export function ThemedText({
  variant = "body",
  style,
  children,
  accessibilityRole,
}: {
  variant?: Variant;
  style?: TextStyle;
  children?: ReactNode;
  /** Override the a11y role. Defaults to `"header"` for `variant="title"` so screen
   * readers announce it as a heading (and enable heading navigation); else undefined. */
  accessibilityRole?: AccessibilityRole;
}) {
  const { theme } = useTheme();
  const color =
    variant === "muted"
      ? theme.color["muted-foreground"]
      : theme.color.foreground;
  const role = accessibilityRole ?? (variant === "title" ? "header" : undefined);
  return (
    <Text accessibilityRole={role} style={[VARIANT[variant], { color }, style]}>
      {children}
    </Text>
  );
}
