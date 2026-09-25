/**
 * Render the signed-in mobile announcement banner and toast.
 *
 * @see docs/reference/projects/mobile/main/components/AnnouncementOverlay.md
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Linking,
  Platform,
  StatusBar,
} from "react-native";
import { useIntl } from "react-intl";
import { useAuth } from "@clerk/clerk-expo";
import { ThemedText, useTheme } from "@indiecrafts/packages-mobile-ui-native";
import { createNativeStore } from "@indiecrafts/packages-shared-compliance/native";
import type { Store } from "@indiecrafts/packages-shared-compliance/shared";
import type {
  AnnouncementLink,
  AnnouncementPayload,
  Banner,
  Toast,
} from "@indiecrafts/packages-shared-announcement";
import { STORAGE_KEYS, websiteUrl, type Locale } from "@/config";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { getAnnouncements } from "@/lib/announcements";

/**
 * Logged-in-only announcement chrome for the mobile shell — a top banner strip + a
 * bottom toast card, both fed by the shared api Worker's `/v1/announcements` (surface
 * `mobile`). Mounted (in `ShellOverlays`) only when Clerk is configured, so `useAuth`
 * has its provider; it renders only when signed in AND online. Every colour comes from
 * the shared `useTheme` tokens — never a hard-coded value.
 *
 * Dismiss is remembered per content `version` via the same `createNativeStore` the shell
 * uses for consent/legal (keys in `STORAGE_KEYS`); a new announcement re-shows.
 */

// One dismiss record each, at module scope (created once, like the shell's stores).
const bannerAck = createNativeStore<{ version: string }>(
  STORAGE_KEYS.announcementAck,
);
const toastAck = createNativeStore<{ version: string }>(
  STORAGE_KEYS.announcementToastAck,
);

function useAck(store: Store<{ version: string }>): { version: string } | null {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** Rough status-bar inset (mirrors OfflineBanner) — a safe-area refinement is a follow-up. */
const TOP_INSET =
  Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 47;

// Banner variants → shared token roles (same mapping as the web `VARIANT` map).
const VARIANT_TOKENS = {
  brand: { bg: "primary", fg: "primary-foreground" },
  neutral: { bg: "secondary", fg: "secondary-foreground" },
  contrast: { bg: "foreground", fg: "background" },
} as const;

/** Internal path → the marketing site; external URL → itself. Null when unopenable. */
function linkUrl(link: AnnouncementLink | undefined): string | null {
  if (!link) return null;
  if (link.external) return link.href;
  return websiteUrl ? `${websiteUrl}${link.href}` : null;
}

function AnnouncementBanner({
  banner,
  dismissLabel,
}: {
  banner: Banner;
  dismissLabel: string;
}) {
  const { theme } = useTheme();
  const [i, setI] = useState(0);
  const acked = useAck(bannerAck);

  useEffect(() => {
    if (banner.items.length < 2) return;
    const id = setInterval(
      () => setI((n) => (n + 1) % banner.items.length),
      6000,
    );
    return () => clearInterval(id);
  }, [banner.items.length]);

  if (banner.items.length === 0 || acked?.version === banner.version)
    return null;
  const item = banner.items[i % banner.items.length];
  if (!item) return null;

  const roles = VARIANT_TOKENS[banner.variant];
  const bg = theme.color[roles.bg];
  const fg = theme.color[roles.fg];
  const url = linkUrl(item.link);

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        { paddingTop: TOP_INSET + 8, backgroundColor: bg },
      ]}
    >
      <Pressable
        style={styles.bannerText}
        disabled={!url}
        accessibilityRole={url ? "link" : undefined}
        onPress={() => url && void Linking.openURL(url)}
      >
        <ThemedText style={{ color: fg, fontSize: 13, textAlign: "center" }}>
          {item.message}
          {item.link?.label ? ` — ${item.link.label}` : ""}
        </ThemedText>
      </Pressable>
      {banner.dismissible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dismissLabel}
          hitSlop={8}
          onPress={() => void bannerAck.save({ version: banner.version })}
        >
          <ThemedText style={{ color: fg, fontSize: 18 }}>×</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

function AnnouncementToast({
  toast,
  dismissLabel,
}: {
  toast: Toast;
  dismissLabel: string;
}) {
  const { theme } = useTheme();
  const acked = useAck(toastAck);
  const dismissed = acked?.version === toast.version;
  const close = () => void toastAck.save({ version: toast.version });

  useEffect(() => {
    if (dismissed || !toast.autoDismissMs) return;
    const id = setTimeout(close, toast.autoDismissMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-arm on version/timer change
  }, [dismissed, toast.autoDismissMs, toast.version]);

  if (dismissed) return null;
  const url = linkUrl(toast.link);

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.toast,
        {
          backgroundColor: theme.color.card,
          borderColor: theme.color.border,
          borderRadius: theme.radius,
        },
      ]}
    >
      {toast.imageUrl ? (
        <Image
          source={{ uri: toast.imageUrl }}
          accessibilityLabel={toast.imageAlt}
          accessible={!!toast.imageAlt}
          style={styles.toastImage}
        />
      ) : null}
      <View style={styles.toastBody}>
        <ThemedText
          style={{ color: theme.color.foreground, fontWeight: "600" }}
        >
          {toast.title}
        </ThemedText>
        {toast.body ? (
          <ThemedText variant="muted" style={{ fontSize: 13, marginTop: 2 }}>
            {toast.body}
          </ThemedText>
        ) : null}
        {toast.link?.label && url ? (
          <Pressable
            accessibilityRole="link"
            hitSlop={6}
            onPress={() => void Linking.openURL(url)}
          >
            <ThemedText
              style={{
                color: theme.color.primary,
                marginTop: 6,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {toast.link.label}
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={dismissLabel}
        hitSlop={8}
        onPress={close}
      >
        <ThemedText
          style={{ color: theme.color["muted-foreground"], fontSize: 18 }}
        >
          ×
        </ThemedText>
      </Pressable>
    </View>
  );
}

export function AnnouncementOverlay({ locale }: { locale: Locale }) {
  const t = useIntl();
  const { isSignedIn } = useAuth();
  const online = useNetworkStatus();
  const [data, setData] = useState<AnnouncementPayload | null>(null);

  useEffect(() => {
    if (!isSignedIn || !online) return;
    let alive = true;
    void getAnnouncements(locale).then((r) => {
      if (alive) setData(r);
    });
    return () => {
      alive = false;
    };
  }, [isSignedIn, online, locale]);

  if (!isSignedIn || !online || !data) return null;
  const dismissLabel = t.formatMessage({ id: "announcement.dismiss" });
  return (
    <>
      <AnnouncementBanner banner={data.banner} dismissLabel={dismissLabel} />
      {data.toast ? (
        <AnnouncementToast toast={data.toast} dismissLabel={dismissLabel} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerText: { flex: 1 },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  toastImage: { width: 48, height: 48, borderRadius: 8 },
  toastBody: { flex: 1 },
});
