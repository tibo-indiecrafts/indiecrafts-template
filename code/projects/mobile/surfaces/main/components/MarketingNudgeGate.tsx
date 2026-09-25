/**
 * Mount the one-time marketing sign-in nudge for a signed-in user.
 *
 * @see docs/reference/projects/mobile/main/components/MarketingNudgeGate.md
 */
import { useSyncExternalStore } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useIntl } from "react-intl";
import { MarketingNudge } from "@indiecrafts/packages-shared-compliance/native";
import { STORAGE_KEYS, features } from "@/config";
import { consentStore } from "@/lib/consent-store";

/**
 * Mounts the one-time marketing sign-in nudge for a signed-in user. Kept separate from
 * `ShellOverlays` because it calls Clerk's `useAuth` (which throws without a provider) —
 * so `ShellOverlays` renders it only when `hasClerk` (the provider is mounted).
 *
 * Defers to the consent banner: both are bottom-anchored overlays, so while a cookie-
 * consent decision is still pending (opt-in region, `requireConsent` on, no record yet)
 * this waits — consent first, then the marketing prompt — so the two never stack.
 */
export function MarketingNudgeGate() {
  const t = useIntl();
  const { isSignedIn, getToken } = useAuth();
  const consentRecord = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.get,
    consentStore.get,
  );
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "";
  if (!isSignedIn || !apiUrl) return null;
  // A pending consent decision owns the bottom of the screen — hold the nudge until it
  // resolves (a record exists). When consent isn't required, there's nothing to wait for.
  if (features.requireConsent && !consentRecord) return null;
  return (
    <MarketingNudge
      apiUrl={apiUrl}
      // Pass Clerk's stable getToken directly — an inline arrow would be a new ref each
      // render and re-trigger the fetch effect (ShellOverlays re-renders often).
      getToken={getToken}
      surface="mobile"
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
