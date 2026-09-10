import { useEffect, useState, useSyncExternalStore } from "react";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useIntl } from "react-intl";
import {
  Screen,
  ThemedText,
  Button,
  Card,
} from "@indiecrafts/packages-mobile-ui-native";
import { ConsentPreferences } from "@indiecrafts/packages-shared-compliance/native";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  rejectAllChoices,
} from "@indiecrafts/packages-shared-compliance/shared";
import { policyVersion, accountUrl } from "@/config";
import { hasClerk } from "@/lib/auth";
import { consentStore } from "@/lib/consent-store";

export default function AccountScreen() {
  // Auth is opt-in; without Clerk mounted `useAuth()` throws (see sign-in.tsx) — branch
  // before it so a direct deep link to /account redirects home instead of crashing.
  if (!hasClerk) return <Redirect href="/" />;
  return <AccountView />;
}

function AccountView() {
  const t = useIntl();

  const record = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    consentStore.get,
  );
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    rejectAllChoices(DEFAULT_CONSENT_CATEGORIES),
  );
  useEffect(() => {
    if (record) setChoices(record.choices);
  }, [record]);

  const cat = (key: string) => ({
    title: t.formatMessage({ id: `consent.categories.${key}.title` }),
    description: t.formatMessage({
      id: `consent.categories.${key}.description`,
    }),
  });
  const categories = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
    necessary: cat("necessary"),
    analytics: cat("analytics"),
    marketing: cat("marketing"),
  });

  return (
    <Screen>
      <Card style={{ margin: 24, marginTop: 96, gap: 16 }}>
        <ThemedText variant="title">
          {t.formatMessage({ id: "account.title" })}
        </ThemedText>

        <ThemedText variant="muted">
          {t.formatMessage({ id: "consent.preferencesTitle" })}
        </ThemedText>
        <ConsentPreferences
          categories={categories}
          choices={choices}
          onChange={(key, value) => setChoices((c) => ({ ...c, [key]: value }))}
        />
        <Button
          label={t.formatMessage({ id: "consent.save" })}
          onPress={() =>
            consentStore.save({ v: policyVersion, t: Date.now(), choices })
          }
        />

        {accountUrl ? (
          // The granular email preference centre lives on the web account page
          // (Sanity-resolved categories; no native duplicate) — hand off the same
          // way "Manage account" does, an in-app browser tab sharing the system
          // cookie jar.
          <Button
            label={t.formatMessage({ id: "account.emailPreferences.manage" })}
            onPress={() =>
              accountUrl && void WebBrowser.openBrowserAsync(accountUrl)
            }
          />
        ) : null}

        {accountUrl ? (
          // Profile, security, data export and account deletion all live on the
          // canonical web account — an in-app browser tab (SFSafariViewController /
          // Custom Tabs) shares the system cookie jar, so an existing web session
          // usually carries over. Deletion is web-only: it's where the churn survey lives.
          <Button
            label={t.formatMessage({ id: "account.manage" })}
            onPress={() =>
              accountUrl && void WebBrowser.openBrowserAsync(accountUrl)
            }
          />
        ) : null}
      </Card>
    </Screen>
  );
}
