"use client";

/**
 * Renders the announcement card: a bottom sheet on a phone, under the top chrome wider.
 *
 * @see docs/reference/packages/web/announcement/src/AnnouncementToast.md
 */

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Link } from "@indiecrafts/packages-web-i18n";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import type {
  AnnouncementLink,
  Toast,
} from "@indiecrafts/packages-shared-announcement";
import { dismissToast, readToastAck } from "./announcement-store";
import { useOverlayTurn } from "@indiecrafts/packages-web-ui-components/web/overlay-turn";

/**
 * Announcement toast — a self-contained card (NOT a sonner toast:
 * it carries an image + a link the user may click, which sonner's own guidance says
 * never to auto-dismiss). Same shape as the version `UpdatePrompt`. `role="status"` +
 * `aria-live="polite"` announces it without stealing focus. i18n-agnostic — resolved
 * copy comes in as props; the close label is the only chrome string.
 *
 * Dismiss is remembered per content `version` (cookie via `dismissToast`) — a NEW
 * toast re-shows after a prior close. The dismissed version is read hydration-safely
 * with `useSyncExternalStore` (server snapshot `""`), never a setState-in-effect.
 * Either path — the × or the optional editor auto-dismiss timer — marks the version
 * seen, so it never nags.
 *
 * Placement (no JS): mount it right AFTER the top chrome — navbar, announcement bar, any
 * message strip. On a phone the card is a bottom sheet (the overlay slot). From `sm` up it
 * hangs from a zero-height sticky anchor at that spot, so it sits under every strip that is
 * shown and, on scroll, stays pinned 80px down: under a navbar up to `h-20` and under the
 * top-center confirmation toasts.
 */
export function AnnouncementToast({
  toast,
  dismissLabel = "Fermer",
}: {
  toast: Toast | null;
  dismissLabel?: string;
}) {
  const [closed, setClosed] = useState(false);
  const acked = useSyncExternalStore(
    () => () => {},
    readToastAck,
    () => "",
  );
  // A promotion: it waits until no required notice or prompt is on screen.
  const visible = useOverlayTurn(
    "announcement",
    !!toast && !closed && acked !== toast.version,
  );

  const close = () => {
    if (toast) dismissToast(toast.version);
    setClosed(true);
  };

  // Optional editor-set auto-dismiss. A timer effect (not hydration state) — only
  // armed while the card is actually visible.
  useEffect(() => {
    if (!visible || !toast?.autoDismissMs) return;
    const id = setTimeout(close, toast.autoDismissMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close is stable enough; re-arm on version/timer change
  }, [visible, toast?.autoDismissMs, toast?.version]);

  if (!toast || !visible) return null;

  return (
    // Zero-height anchor: sticky from `sm` up, so the card hangs under the top chrome.
    <div className="pointer-events-none relative z-40 h-0 sm:sticky sm:top-20">
      {/* A `div`: `<aside>` (complementary) may not carry the `status` live-region role. */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "bg-card text-foreground ring-border/60 pointer-events-auto flex gap-3 rounded-xl border-0 p-4 shadow-lg ring-1 backdrop-blur",
          // Phone: the bottom overlay slot (DESIGN.md "Overlays take turns").
          "fixed inset-x-4 bottom-safe-4 mx-auto w-auto max-w-md",
          // Wider: top-right, just under the anchor.
          "sm:absolute sm:inset-x-auto sm:top-3 sm:right-4 sm:bottom-auto sm:mx-0 sm:w-full sm:max-w-sm",
        )}
      >
        {toast.imageUrl ? (
          // Already CDN-sized by the resolver (?w=128&auto=format&fit=max&q=75) — a raw
          // <img> is allowed with those explicit params (`.claude/rules/web/sanity-images.md`).
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
            <LinkView
              link={toast.link}
              className="text-primary focus-visible:ring-ring mt-2 inline-block rounded text-sm font-medium underline underline-offset-2 focus-visible:ring-2 focus-visible:outline-none"
            >
              {toast.link.label}
            </LinkView>
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
      </div>
    </div>
  );
}

/** Internal path → typed i18n Link; external URL → plain anchor with target/rel. */
function LinkView({
  link,
  children,
  className,
}: {
  link: AnnouncementLink;
  children: ReactNode;
  className?: string;
}) {
  if (link.external) {
    return (
      <a
        href={link.href}
        className={className}
        target={link.newTab ? "_blank" : undefined}
        rel={link.newTab ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {children}
    </Link>
  );
}
