import { useEffect, useState, useSyncExternalStore } from "react";
import { useIntl } from "react-intl";
import { useAuth } from "@clerk/clerk-react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { createWebStore } from "@indiecrafts/packages-shared-compliance/web";
import type { Store } from "@indiecrafts/packages-shared-compliance/shared";
import {
  fetchAnnouncements,
  type AnnouncementLink,
  type AnnouncementPayload,
  type Banner,
  type Toast,
} from "@indiecrafts/packages-shared-announcement";
import { apiUrl, STORAGE_KEYS, websiteUrl, type Locale } from "../../config";
import { useOnlineStatus } from "./useOnlineStatus";

/**
 * Logged-in-only announcement chrome for the Electron renderer — a top banner strip +
 * a fixed toast card, fed by the shared api Worker's `/v1/announcements` (surface
 * `hybrid`). Bespoke (NOT the web `AnnouncementBar`/`AnnouncementToast`, which import
 * next-intl and can't run outside Next); same Tailwind token classes though. Mounted
 * (in `shell.tsx`) only when Clerk is configured, so `useAuth` has its provider; renders
 * only when signed in AND online. Links open in the OS browser via the preload bridge.
 */

// One dismiss record each (localStorage, namespaced) — created once at module scope.
const bannerAck = createWebStore<{ version: string }>(
  STORAGE_KEYS.announcementAck,
);
const toastAck = createWebStore<{ version: string }>(
  STORAGE_KEYS.announcementToastAck,
);

function useAck(store: Store<{ version: string }>): { version: string } | null {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

const VARIANT = {
  brand: "bg-primary text-primary-foreground",
  neutral: "bg-muted text-foreground",
  contrast: "bg-foreground text-background",
} as const;

/** Internal path → the marketing site; external URL → itself. Opens in the OS browser. */
function openLink(link: AnnouncementLink): void {
  const url = link.external
    ? link.href
    : websiteUrl
      ? `${websiteUrl}${link.href}`
      : null;
  if (url) void window.desktop.openExternal(url);
}

function AnnouncementBanner({
  banner,
  dismissLabel,
}: {
  banner: Banner;
  dismissLabel: string;
}) {
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

  return (
    <aside
      role="region"
      aria-label={dismissLabel}
      className={cn("w-full", VARIANT[banner.variant])}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2 text-sm">
        <p
          aria-live="polite"
          className="min-w-0 flex-1 text-center sm:text-left"
        >
          {item.link ? (
            <button
              type="button"
              onClick={() => openLink(item.link!)}
              className="hover:underline"
            >
              {item.message}
              {item.link.label ? ` — ${item.link.label}` : ""}
            </button>
          ) : (
            <span>{item.message}</span>
          )}
        </p>
        {banner.dismissible ? (
          <button
            type="button"
            aria-label={dismissLabel}
            title={dismissLabel}
            onClick={() => bannerAck.save({ version: banner.version })}
            className="focus-visible:ring-ring shrink-0 rounded p-1 text-lg leading-none opacity-80 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>
    </aside>
  );
}

function AnnouncementToast({
  toast,
  dismissLabel,
}: {
  toast: Toast;
  dismissLabel: string;
}) {
  const acked = useAck(toastAck);
  const dismissed = acked?.version === toast.version;
  const close = () => toastAck.save({ version: toast.version });

  useEffect(() => {
    if (dismissed || !toast.autoDismissMs) return;
    const id = setTimeout(close, toast.autoDismissMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-arm on version/timer change
  }, [dismissed, toast.autoDismissMs, toast.version]);

  if (dismissed) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className={cn(
        "bg-card text-foreground ring-border/60 fixed top-4 right-4 left-4 z-40",
        "flex gap-3 rounded-xl border-0 p-4 shadow-lg ring-1 backdrop-blur",
        "sm:left-auto sm:max-w-sm",
      )}
    >
      {toast.imageUrl ? (
        <img
          src={toast.imageUrl}
          alt={toast.imageAlt ?? ""}
          aria-hidden={toast.imageAlt ? undefined : true}
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-md object-cover"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-foreground font-medium">{toast.title}</p>
        {toast.body ? (
          <p className="text-muted-foreground mt-1 text-sm">{toast.body}</p>
        ) : null}
        {toast.link?.label ? (
          <button
            type="button"
            onClick={() => openLink(toast.link!)}
            className="text-primary focus-visible:ring-ring mt-2 inline-block rounded text-sm font-medium underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none"
          >
            {toast.link.label}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        aria-label={dismissLabel}
        title={dismissLabel}
        onClick={close}
        className="focus-visible:ring-ring text-muted-foreground hover:text-foreground -mt-1 -mr-1 shrink-0 self-start rounded p-1 text-lg leading-none focus-visible:ring-2 focus-visible:outline-none"
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}

export function AnnouncementChrome() {
  const t = useIntl();
  const { isSignedIn } = useAuth();
  const online = useOnlineStatus();
  const [data, setData] = useState<AnnouncementPayload | null>(null);

  useEffect(() => {
    if (!isSignedIn || !online) return;
    let alive = true;
    void fetchAnnouncements(apiUrl, {
      locale: t.locale as Locale,
      surface: "hybrid",
    }).then((r) => {
      if (alive) setData(r);
    });
    return () => {
      alive = false;
    };
  }, [isSignedIn, online, t.locale]);

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
