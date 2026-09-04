import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "expo-router";
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
  ExportSection,
  ConsentPreferences,
  createNativeStore,
  buildDeleteAccountCopy,
  buildExportCopy,
} from "@indiecrafts/packages-shared-compliance/native";
import {
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
  rejectAllChoices,
  type ConsentRecord,
} from "@indiecrafts/packages-shared-compliance/shared";
import { STORAGE_KEYS, policyVersion, features } from "@/config";
import { hasClerk } from "@/lib/auth";

const consentStore = createNativeStore<ConsentRecord>(
  STORAGE_KEYS.cookieConsent,
);

export default function AccountScreen() {
  // Auth is opt-in; without Clerk mounted `useAuth()` throws (see sign-in.tsx) — branch
  // before it so a direct deep link to /account can't crash.
  if (!hasClerk) return null;
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
  const exportCopy = buildExportCopy((k) =>
    t.formatMessage({ id: `account.export.${k}` }),
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

        {features.exportAccount && apiUrl ? (
          <ExportSection
            copy={exportCopy}
            apiUrl={apiUrl}
            getToken={() => getToken()}
          />
        ) : null}
        {features.deleteAccount && apiUrl ? (
          // @debt SECURITY - No beforeConfirm here. @clerk/clerk-expo doesn't export
          // useReverification (unlike clerk-react/nextjs), and even where it exists it only
          // triggers on a `session_reverification_required` error from the wrapped call. The
          // erasure worker doesn't emit that error, so wrapping it would resolve immediately
          // without real re-auth. The server-side JWT + typed-email match is the current
          // protection.
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
