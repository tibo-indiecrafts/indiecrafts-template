import { useCallback, useEffect, useState } from "react";
import { View, Switch, StyleSheet } from "react-native";
import { ThemedText, useTheme } from "@indiecrafts/packages-mobile-ui-native";

export interface MarketingEmailToggleProps {
  /** The api origin (EXPO_PUBLIC_API_URL). Empty → renders nothing. */
  apiUrl: string;
  /** A fresh Clerk session token for the authenticated api calls (injected). */
  getToken: () => Promise<string | null>;
  /** The localized row label. */
  label: string;
  /** The calling surface, recorded on the consent proof row. */
  surface: string;
  onSaved?: () => void;
}

/**
 * The native account-settings toggle for the commercial-email opt-in. Reads
 * `GET /v1/consent/marketing-email` on mount and writes each change with `POST` (proof +
 * `user_profiles.marketing_email` + Resend sync). The RN mirror of the web
 * `MarketingEmailToggle`. Optimistic; reverts on a failed write.
 */
export function MarketingEmailToggle({
  apiUrl,
  getToken,
  label,
  surface,
  onSaved,
}: MarketingEmailToggleProps) {
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;
    let alive = true;
    void (async () => {
      try {
        const token = await getToken();
        if (token) {
          const res = await fetch(`${apiUrl}/v1/consent/marketing-email`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = (await res.json()) as {
              marketing_email: boolean | null;
            };
            if (alive) setOn(data.marketing_email === true);
          }
        }
      } catch {
        // Leave the default (off); a failed read must not break the account screen.
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [apiUrl, getToken]);

  const change = useCallback(
    async (next: boolean) => {
      if (busy) return;
      setBusy(true);
      setOn(next); // optimistic
      try {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/v1/consent/marketing-email`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token ?? ""}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ granted: next, surface }),
        });
        if (!res.ok) throw new Error(`consent ${res.status}`);
        onSaved?.();
      } catch (error) {
        setOn(!next); // revert — the change did not persist
        console.error("marketing-email toggle save failed", error);
      } finally {
        setBusy(false);
      }
    },
    [apiUrl, busy, getToken, onSaved, surface],
  );

  if (!apiUrl) return null;
  return (
    <View style={styles.row}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Switch
        value={on}
        disabled={!ready || busy}
        onValueChange={(v) => void change(v)}
        trackColor={{ true: theme.color.primary }}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  label: { fontSize: 14, flex: 1 },
});
