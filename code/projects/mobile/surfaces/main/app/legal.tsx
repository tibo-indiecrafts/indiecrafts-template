import { Linking, View, StyleSheet } from "react-native";
import { useIntl } from "react-intl";
import {
  Screen,
  ThemedText,
  Button,
} from "@indiecrafts/packages-mobile-ui-native";
import {
  LEGAL_PAGE_KEYS,
  legalUrl,
} from "@indiecrafts/packages-shared-compliance/shared";
import { websiteUrl, type Locale } from "@/config";

// Legal link-out screen (expo-router). The canonical legal pages live on the marketing
// website; each button opens its page in the system browser (`Linking.openURL` — RN
// core, zero new deps). No content re-hosting.
export default function Legal() {
  const t = useIntl();
  const locale = t.locale as Locale;
  return (
    <Screen>
      <View style={styles.body}>
        <ThemedText variant="title">
          {t.formatMessage({ id: "legal.heading" })}
        </ThemedText>
        {LEGAL_PAGE_KEYS.map((key) => (
          <Button
            key={key}
            variant="outline"
            disabled={!websiteUrl}
            label={t.formatMessage({ id: `legal.${key}` })}
            onPress={() =>
              websiteUrl &&
              void Linking.openURL(legalUrl(websiteUrl, key, locale))
            }
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 24, marginTop: 72, gap: 12 },
});
