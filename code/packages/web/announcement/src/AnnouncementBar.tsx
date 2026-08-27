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
  BannerItem,
  AnnouncementLink,
} from "@indiecrafts/packages-shared-announcement";
import { dismissAnnouncement, readAnnouncementAck } from "./announcement-store";

/**
 * Announcement / discount strip under the site nav. Non-fixed — it sits at the top
 * of `<main>`, so page content flows below it and a dismiss reclaims the space by
 * unmounting (no offset math). Rotates through multiple items; a single item is
 * static. On the website the layout renders it only when the deposited
 * `announcement-ack` cookie ≠ the current `version` (decided server-side, no flash);
 * the same cookie is ALSO read here (`useSyncExternalStore`) so the client-gated
 * surfaces (app, hybrid) — which have no server pre-check — stay dismissed across a
 * reload. i18n-agnostic — copy comes in as props.
 */

const VARIANT = {
  brand: "bg-primary text-primary-foreground",
  neutral: "bg-muted text-foreground",
  contrast: "bg-foreground text-background",
} as const;

const ROTATE_MS = 6000;

export function AnnouncementBar({
  items,
  variant = "brand",
  dismissible = true,
  version,
  regionLabel,
  dismissLabel = "Fermer",
  copyLabel = "Copier",
  copiedLabel = "Copié",
}: {
  items: BannerItem[];
  variant?: keyof typeof VARIANT;
  dismissible?: boolean;
  version: string;
  regionLabel?: string;
  dismissLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [i, setI] = useState(0);
  const acked = useSyncExternalStore(
    () => () => {},
    readAnnouncementAck,
    () => "",
  );

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(
      () => setI((n) => (n + 1) % items.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [items.length]);

  if (hidden || acked === version || items.length === 0) return null;
  const item = items[i % items.length];
  if (!item) return null; // narrow: noUncheckedIndexedAccess widens the indexed access to `| undefined`

  return (
    <aside
      role="region"
      aria-label={regionLabel}
      className={cn("w-full", VARIANT[variant])}
    >
      <div className="mx-auto flex max-w-(--max-container) items-center gap-3 px-(--gutter) py-2 text-sm">
        <p
          aria-live="polite"
          className="min-w-0 flex-1 text-center sm:text-left"
        >
          {item.link && !item.link.label ? (
            <Wrap link={item.link} className="hover:underline">
              {item.message}
            </Wrap>
          ) : (
            <>
              <span>{item.message}</span>
              {item.discountCode ? (
                <CodeChip
                  code={item.discountCode}
                  copyLabel={copyLabel}
                  copiedLabel={copiedLabel}
                />
              ) : null}
              {item.link?.label ? (
                <Wrap
                  link={item.link}
                  className="ml-2 font-medium underline underline-offset-2"
                >
                  {item.link.label}
                </Wrap>
              ) : null}
            </>
          )}
        </p>
        {dismissible ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={dismissLabel}
            title={dismissLabel}
            onClick={() => {
              dismissAnnouncement(version);
              setHidden(true);
            }}
            className="shrink-0 text-lg leading-none opacity-80 hover:opacity-100"
          >
            <span aria-hidden="true">×</span>
          </Button>
        ) : null}
      </div>
    </aside>
  );
}

/** Internal path → typed i18n Link; external URL → plain anchor with target/rel. */
function Wrap({
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

/** Click-to-copy discount code chip. */
function CodeChip({
  code,
  copyLabel,
  copiedLabel,
}: {
  code: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      aria-label={`${copyLabel} ${code}`}
      title={copied ? copiedLabel : copyLabel}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // clipboard blocked — the code is still visible to copy by hand
        }
      }}
      className="ml-2 bg-black/10 font-mono font-semibold"
    >
      {copied ? copiedLabel : code}
    </Button>
  );
}
