import { useEffect, useState, useSyncExternalStore } from "react";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useIntl } from "react-intl";
import { useAuth } from "@clerk/clerk-expo";
import {
  Screen,
  ThemedText,
  Button,
  Card,
} from "@indiecrafts/packages-mobile-ui-native";
import {
  DeleteAccountSection,
  ConsentPreferences,
  MarketingEmailToggle,
  buildDeleteAccountCopy,
} from "@indiecrafts/packages-shared-compliance/native";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  rejectAllChoices,
} from "@indiecrafts/packages-shared-compliance/shared";
import { policyVersion, features, accountUrl } from "@/config";
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
  const router = useRouter();
  const { signOut, getToken } = useAuth();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "";

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

  const deleteCopy = buildDeleteAccountCopy((k) =>
    t.formatMessage({ id: `account.delete.${k}` }),
  );

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

        {apiUrl ? (
          <MarketingEmailToggle
            apiUrl={apiUrl}
            getToken={() => getToken()}
            label={t.formatMessage({ id: "account.marketing.label" })}
            surface="mobile"
          />
        ) : null}

        {accountUrl ? (
          // Profile, security and data export live on the canonical web account —
          // an in-app browser tab (SFSafariViewController / Custom Tabs) shares the
          // system cookie jar, so an existing web session usually carries over.
          <Button
            label={t.formatMessage({ id: "account.manage" })}
            onPress={() =>
              accountUrl && void WebBrowser.openBrowserAsync(accountUrl)
            }
          />
        ) : null}
        {features.deleteAccount && apiUrl ? (
          // No beforeConfirm here. The erasure worker (self.ts) enforces step-up server-side:
          // it requires a fresh Clerk `fva` and rejects a stale one with a 403, for every
          // surface including mobile. @clerk/clerk-expo exports no useReverification hook
          // (unlike clerk-react/nextjs), so this screen cannot show an inline re-auth modal on
          // a stale-fva rejection. The user's remedy is to sign out and sign back in, which
          // refreshes `fva`, then delete. This is a documented SDK limitation, not an
          // unguarded path.
          <DeleteAccountSection
            copy={deleteCopy}
            apiUrl={apiUrl}
            getToken={() => getToken()}
            onDeleted={async () => {
              await signOut();
              router.replace("/");
            }}
          />
        ) : null}
      </Card>
    </Screen>
  );
}
