import { useIntl } from "react-intl";
import { useRouter } from "expo-router";
import {
  Screen,
  ThemedText,
  Button,
  Card,
} from "@indiecrafts/packages-mobile-ui-native";

// Home screen (expo-router). Shows the shell wiring: `Screen`/`ThemedText`/`Button`/
// `Card` from the native design system (`ui-native`, themed by the shared tokens) +
// `react-intl` copy. Build real screens here; reuse tenant data/logic via the
// React-FREE bricks (`@/config`, `format`, `utils`); Sanity reads via the API.
export default function Index() {
  const t = useIntl();
  const router = useRouter();
  return (
    <Screen>
      <Card style={{ margin: 24, marginTop: 96 }}>
        <ThemedText variant="title">
          {t.formatMessage({ id: "home.title" })}
        </ThemedText>
        <ThemedText variant="muted">
          {t.formatMessage({ id: "home.subtitle" })}
        </ThemedText>
        <Button label={t.formatMessage({ id: "home.cta" })} />
        <Button
          variant="outline"
          label={t.formatMessage({ id: "legal.heading" })}
          onPress={() => router.push("/legal")}
        />
        <Button
          variant="outline"
          label={t.formatMessage({ id: "home.signIn" })}
          onPress={() => router.push("/sign-in")}
        />
      </Card>
    </Screen>
  );
}
