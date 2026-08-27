"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Link } from "@indiecrafts/packages-web-i18n";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import type {
  AnnouncementLink,
  Toast,
} from "@indiecrafts/packages-shared-announcement";
import { dismissToast, readToastAck } from "./announcement-store";

/**
 * Announcement toast — a self-contained, fixed top-right card (NOT a sonner toast:
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
  const visible = !!toast && !closed && acked !== toast.version;

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
    <aside
      role="status"
      aria-live="polite"
      className={cn(
        "bg-card text-foreground ring-border/60 fixed top-20 right-4 left-4 z-40",
        "flex max-w-none gap-3 rounded-xl border-0 p-4 shadow-lg ring-1 backdrop-blur",
        "sm:left-auto sm:max-w-sm",
      )}
    >
      {toast.imageUrl ? (
        // Already CDN-sized by the resolver (?w=128&auto=format&fit=max&q=75) — a raw
        // <img> is allowed with those explicit params (rules/sanity-images.md).
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
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={dismissLabel}
        title={dismissLabel}
        onClick={close}
        className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 shrink-0 self-start text-lg leading-none"
      >
        <span aria-hidden="true">×</span>
      </Button>
    </aside>
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
