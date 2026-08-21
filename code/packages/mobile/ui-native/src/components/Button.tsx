import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme";

type Variant = "primary" | "secondary" | "outline" | "destructive";

/** Themed button — shadcn-style variants over the shared tokens. */
export function Button({
  label,
  variant = "primary",
  onPress,
  disabled,
  accessibilityHint,
}: {
  label: string;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  /** Optional extra context a screen reader reads after the label (e.g. "Opens settings"). */
  accessibilityHint?: string;
}) {
  const { theme } = useTheme();
  const c = theme.color;
  const bg = {
    primary: c.primary,
    secondary: c.secondary,
    outline: "transparent",
    destructive: c.destructive,
  }[variant];
  const fg = {
    primary: c["primary-foreground"],
    secondary: c["secondary-foreground"],
    outline: c.foreground,
    destructive: c["destructive-foreground"],
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor: variant === "outline" ? c.border : bg,
          borderRadius: theme.radius,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 44,
    paddingHorizontal: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 15, fontWeight: "600" },
});
