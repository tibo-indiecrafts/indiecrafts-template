/**
 * Render the mobile catch-all 404 screen.
 *
 * @see docs/reference/projects/mobile/main/app/+not-found.md
 */
import { useRouter } from "expo-router";
import { useIntl } from "react-intl";
import { NotFoundContent } from "@indiecrafts/packages-shared-system-pages/native";
import { Screen } from "@indiecrafts/packages-mobile-ui-native";

/** Expo Router catch-all 404 — the themed, translated not-found screen. */
export default function NotFound() {
  const router = useRouter();
  const t = useIntl();
  return (
    <Screen>
      <NotFoundContent
        eyebrow={t.formatMessage({ id: "notFound.eyebrow" })}
        title={t.formatMessage({ id: "notFound.title" })}
        description={t.formatMessage({ id: "notFound.description" })}
        homeLabel={t.formatMessage({ id: "notFound.homeLabel" })}
        onGoHome={() => router.replace("/")}
      />
    </Screen>
  );
}
