import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { ThemedText, useTheme } from "@indiecrafts/packages-mobile-ui-native";

// Rough status-bar inset (Android exposes it; iOS ~47 on notched devices).
const TOP_INSET =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 47;

/**
 * A non-blocking top strip shown while `online` is false; renders nothing otherwise.
 * Copy (`message`) and connectivity (`online`) are injected — the app owns detection
 * (netinfo) so the brick stays free of a single-consumer native dep.
 * `accessibilityLiveRegion` announces the change to TalkBack without stealing focus.
 */
export function OfflineBanner({
  message,
  online,
}: {
  message: string;
  online: boolean;
}) {
  const { theme } = useTheme();
  if (online) return null;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.strip,
        { paddingTop: TOP_INSET + 8, backgroundColor: theme.color.secondary },
      ]}
    >
      <ThemedText
        variant="muted"
        style={{
          color: theme.color["secondary-foreground"],
          textAlign: "center",
          fontSize: 13,
        }}
      >
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
});
