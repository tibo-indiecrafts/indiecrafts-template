import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useIntl } from "react-intl";
import { MarketingNudge } from "@indiecrafts/packages-shared-compliance/web";
import { STORAGE_KEYS } from "../../config";

/**
 * The Electron-renderer mount for the one-time marketing sign-in nudge. The renderer's
 * strict CSP blocks a direct api fetch, so read/write go through the preload bridge
 * (`window.desktop.marketingConsent*`, which fetch in MAIN using the caller's Clerk
 * token). Reuses the shared web `MarketingNudge` UI. Rendered under `<ClerkProvider>`.
 */
export function MarketingNudgeMount() {
  const t = useIntl();
  const { isSignedIn, getToken } = useAuth();

  const io = useMemo(
    () => ({
      read: async (): Promise<boolean | null> => {
        const token = await getToken();
        if (!token) throw new Error("no token"); // never falsely show the nudge
        return window.desktop.marketingConsentGet(token);
      },
      write: async (granted: boolean): Promise<void> => {
        const token = await getToken();
        const res = await window.desktop.marketingConsentSet(
          token ?? "",
          granted,
          "hybrid",
        );
        if (!res.ok) throw new Error("consent write failed");
      },
    }),
    [getToken],
  );

  if (!isSignedIn) return null;
  return (
    <MarketingNudge
      read={io.read}
      write={io.write}
      snoozeKey={STORAGE_KEYS.marketingNudgeSnooze}
      copy={{
        title: t.formatMessage({ id: "auth.nudge.title" }),
        yes: t.formatMessage({ id: "auth.nudge.yes" }),
        no: t.formatMessage({ id: "auth.nudge.no" }),
        dismiss: t.formatMessage({ id: "auth.nudge.dismiss" }),
      }}
    />
  );
}
