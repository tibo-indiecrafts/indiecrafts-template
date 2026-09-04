import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { useColors } from "./theme";

// Rough status-bar inset (Android exposes it; iOS ~47 on notched devices).
const TOP_INSET =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 47;

/**
 * A non-blocking top strip shown while `online` is false; renders nothing otherwise.
 * Copy (`message`) and connectivity (`online`) are injected — the app owns detection
 * (netinfo) so the brick stays free of a single-consumer native dep. Themed via the
 * brick's shared tokens (`useColors`), matching OfflineContent. `accessibilityLiveRegion`
 * announces the change to TalkBack without stealing focus.
 */
export function OfflineBanner({
  message,
  online,
}: {
  message: string;
  online: boolean;
}) {
  const c = useColors();
  if (online) return null;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.strip,
        { paddingTop: TOP_INSET + 8, backgroundColor: c.secondary },
      ]}
    >
      <Text
        style={{
          color: c["secondary-foreground"],
          textAlign: "center",
          fontSize: 13,
        }}
      >
        {message}
      </Text>
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
