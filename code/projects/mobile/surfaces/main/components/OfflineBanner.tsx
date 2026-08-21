import { View, StyleSheet, Platform, StatusBar } from "react-native";
import { useIntl } from "react-intl";
import { ThemedText, useTheme } from "@indiecrafts/packages-mobile-ui-native";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

// Rough status-bar inset (Android exposes it; iOS ~47 on notched devices). A
// react-native-safe-area-context refinement is a follow-up.
const TOP_INSET = Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 47;

/**
 * A non-blocking top strip shown while the device is offline; auto-hides on reconnect.
 * Copy from the shared `SHELL_COPY.offline` (`offline.banner`, merged into react-intl by
 * `messagesFor`), themed with the shared `secondary` tokens. `accessibilityLiveRegion`
 * announces the connectivity change to TalkBack without stealing focus (the RN analog of
 * the web banner's `aria-live="polite"`).
 */
export function OfflineBanner() {
  const t = useIntl();
  const { theme } = useTheme();
  const online = useNetworkStatus();
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
        {t.formatMessage({ id: "offline.banner" })}
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
