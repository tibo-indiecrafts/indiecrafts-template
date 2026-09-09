import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  ThemedText,
  useTheme,
} from "@indiecrafts/packages-mobile-ui-native";

export interface MarketingNudgeCopy {
  title: string;
  yes: string;
  no: string;
  dismiss: string;
}

export interface MarketingNudgeProps {
  /** The api origin (EXPO_PUBLIC_API_URL). Empty → renders nothing. */
  apiUrl: string;
  /** A fresh Clerk session token for the authenticated api calls (injected). */
  getToken: () => Promise<string | null>;
  /** The calling surface, recorded on the consent proof row. */
  surface: string;
  /** AsyncStorage key for the per-device snooze (dismiss). */
  snoozeKey: string;
  copy: MarketingNudgeCopy;
}

/**
 * The native mirror of the web `MarketingNudge` — a one-time post-sign-in prompt shown
 * only when the user has no marketing decision on record (`GET` → null). `[Yes]`/`[No]`
 * record a decision (never shown again); `[dismiss]` snoozes per-device via AsyncStorage.
 * The RN app does direct authenticated api fetches (unlike the Electron renderer), so this
 * is self-contained. The screen mounts it only for a signed-in user.
 */
export function MarketingNudge({
  apiUrl,
  getToken,
  surface,
  snoozeKey,
  copy,
}: MarketingNudgeProps) {
  const { theme } = useTheme();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!apiUrl) return;
    let alive = true;
    void (async () => {
      try {
        if (await AsyncStorage.getItem(snoozeKey)) return;
      } catch {
        // storage unavailable → treat as not snoozed
      }
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${apiUrl}/v1/consent/marketing-email`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = (await res.json()) as {
            marketing_email: boolean | null;
          };
          if (alive && data.marketing_email === null) setShow(true);
        }
      } catch {
        // a failed read never shows the nudge
      }
    })();
    return () => {
      alive = false;
    };
  }, [apiUrl, getToken, snoozeKey]);

  const decide = useCallback(
    async (granted: boolean) => {
      if (busy) return;
      setBusy(true);
      try {
        const token = await getToken();
        await fetch(`${apiUrl}/v1/consent/marketing-email`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token ?? ""}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ granted, surface }),
        });
      } catch (error) {
        console.error("marketing nudge save failed", error);
      } finally {
        setShow(false); // decided → the flag is non-null now
        setBusy(false);
      }
    },
    [apiUrl, busy, getToken, surface],
  );

  const snooze = useCallback(() => {
    void AsyncStorage.setItem(snoozeKey, "1").catch(() => {});
    setShow(false);
  }, [snoozeKey]);

  if (!show) return null;
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.root,
        {
          backgroundColor: theme.color.card,
          borderColor: theme.color.border,
          borderRadius: theme.radius,
        },
      ]}
    >
      <ThemedText style={styles.title}>{copy.title}</ThemedText>
      <View style={styles.actions}>
        <Button
          label={copy.yes}
          disabled={busy}
          onPress={() => void decide(true)}
        />
        <Button
          label={copy.no}
          variant="secondary"
          disabled={busy}
          onPress={() => void decide(false)}
        />
        <Button
          label={copy.dismiss}
          variant="outline"
          disabled={busy}
          onPress={snooze}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  title: { fontSize: 15, fontWeight: "600" },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
  },
});
