import { useCallback, useEffect, useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
import {
  ThemedText,
  Button,
  useTheme,
} from "@indiecrafts/packages-mobile-ui-native";
import {
  withCategoryGranted,
  type EmailPreferenceCategory,
  type EmailPreferenceNotice,
  type EmailPreferencesData,
} from "@/lib/email-preferences";

export interface EmailPreferencesCopy {
  heading: string;
  intro: string;
  noticesHeading: string;
  loading: string;
  error: string;
  retry: string;
}

export interface EmailPreferencesProps {
  /** The api origin (EXPO_PUBLIC_API_URL). Empty → renders nothing. */
  apiUrl: string;
  /** A fresh Clerk session token for the authenticated api calls (injected). */
  getToken: () => Promise<string | null>;
  /** The calling surface, recorded on the consent proof rows. */
  surface: string;
  copy: EmailPreferencesCopy;
}

type Status = "loading" | "ready" | "error";

/**
 * The native email preference centre — one `Switch` per category (optimistic, rolls
 * back on a failed write) plus a read-only "Account & security" notices list. Reads
 * `GET /v1/consent/email-preferences` on mount, writes each change with `POST`. The
 * RN mirror of the web `EmailPreferences`; supersedes the single `MarketingEmailToggle`
 * row on the account screen. Category/notice copy comes from the api, already
 * locale-resolved — only the chrome strings (`copy`) are local.
 */
export function EmailPreferences({
  apiUrl,
  getToken,
  surface,
  copy,
}: EmailPreferencesProps) {
  const { theme } = useTheme();
  const [status, setStatus] = useState<Status>("loading");
  const [categories, setCategories] = useState<EmailPreferenceCategory[]>([]);
  const [notices, setNotices] = useState<EmailPreferenceNotice[]>([]);
  const [saveError, setSaveError] = useState(false);
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  // Bumped by the retry button to re-run the load effect below.
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!apiUrl) return;
    let alive = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("no token"); // never falsely show empty preferences
        const res = await fetch(`${apiUrl}/v1/consent/email-preferences`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`email-preferences ${res.status}`);
        const data = (await res.json()) as EmailPreferencesData;
        if (!alive) return;
        setCategories(data.categories);
        setNotices(data.notices);
        setStatus("ready");
      } catch (error) {
        console.error("email preferences load failed", error);
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [apiUrl, getToken, reloadToken]);

  const toggle = useCallback(
    async (key: string, granted: boolean) => {
      setSaveError(false);
      setCategories((cs) => withCategoryGranted(cs, key, granted)); // optimistic
      setSavingKeys((s) => new Set(s).add(key));
      try {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/v1/consent/email-preferences`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token ?? ""}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ updates: [{ key, granted }], surface }),
        });
        if (!res.ok) throw new Error(`email-preferences ${res.status}`);
      } catch (error) {
        console.error("email preference save failed", error);
        setCategories((cs) => withCategoryGranted(cs, key, !granted)); // revert
        setSaveError(true);
      } finally {
        setSavingKeys((s) => {
          const next = new Set(s);
          next.delete(key);
          return next;
        });
      }
    },
    [apiUrl, getToken, surface],
  );

  if (!apiUrl) return null;

  if (status === "loading") {
    return <ThemedText variant="muted">{copy.loading}</ThemedText>;
  }

  if (status === "error") {
    return (
      <View style={styles.section}>
        <ThemedText style={{ color: theme.color.destructive }}>
          {copy.error}
        </ThemedText>
        <Button
          label={copy.retry}
          variant="outline"
          onPress={() => {
            setStatus("loading");
            setReloadToken((n) => n + 1);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <ThemedText accessibilityRole="header" style={styles.heading}>
        {copy.heading}
      </ThemedText>
      <ThemedText variant="muted">{copy.intro}</ThemedText>

      <View style={styles.list}>
        {categories.map((category) => {
          const busy = savingKeys.has(category.key);
          return (
            <View key={category.key} style={styles.row}>
              <View style={styles.text}>
                <ThemedText style={styles.itemTitle}>
                  {category.name}
                </ThemedText>
                <ThemedText variant="muted" style={styles.itemDesc}>
                  {category.description}
                </ThemedText>
              </View>
              <Switch
                value={category.granted}
                disabled={busy}
                onValueChange={(v) => void toggle(category.key, v)}
                trackColor={{ true: theme.color.primary }}
                accessibilityRole="switch"
                accessibilityLabel={category.name}
                accessibilityState={{ disabled: busy }}
              />
            </View>
          );
        })}
      </View>

      {saveError ? (
        <ThemedText style={{ color: theme.color.destructive }}>
          {copy.error}
        </ThemedText>
      ) : null}

      {notices.length > 0 ? (
        <View style={styles.section}>
          <ThemedText accessibilityRole="header" style={styles.subheading}>
            {copy.noticesHeading}
          </ThemedText>
          <View style={styles.list}>
            {notices.map((notice) => (
              <View key={notice.name} style={styles.noticeRow}>
                <ThemedText style={styles.itemTitle}>{notice.name}</ThemedText>
                <ThemedText variant="muted" style={styles.itemDesc}>
                  {notice.description}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  heading: { fontSize: 18, fontWeight: "600" },
  subheading: { fontSize: 14, fontWeight: "600" },
  list: { gap: 12, paddingVertical: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    minHeight: 44,
  },
  noticeRow: { gap: 2 },
  text: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: "500" },
  itemDesc: { fontSize: 12 },
});
