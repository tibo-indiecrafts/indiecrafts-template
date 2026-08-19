"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@indiecrafts/i18n";
import { cn } from "@indiecrafts/utils/cn";
import type { AnnouncementItem, AnnouncementLink } from "./sanity/announcement";
import { dismissAnnouncement } from "./announcement-store";

/**
 * Announcement / discount strip under the site nav. Non-fixed — it sits at the top
 * of `<main>`, so page content flows below it and a dismiss reclaims the space by
 * unmounting (no offset math). Rotates through multiple items; a single item is
 * static. The layout renders it only when there are live items and the deposited
 * `announcement-ack` cookie ≠ the current `version` (decided server-side, no flash).
 * i18n-agnostic — copy comes in as props.
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
  items: AnnouncementItem[];
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

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(
      () => setI((n) => (n + 1) % items.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [items.length]);

  if (hidden || items.length === 0) return null;
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
          <button
            type="button"
            aria-label={dismissLabel}
            title={dismissLabel}
            onClick={() => {
              dismissAnnouncement(version);
              setHidden(true);
            }}
            className="focus-visible:ring-ring shrink-0 rounded p-1 text-lg leading-none opacity-80 hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
          >
            <span aria-hidden="true">×</span>
          </button>
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
    <button
      type="button"
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
      className="focus-visible:ring-ring ml-2 inline-flex items-center rounded bg-black/10 px-1.5 py-0.5 font-mono text-xs font-semibold focus-visible:ring-2 focus-visible:outline-none"
    >
      {copied ? copiedLabel : code}
    </button>
  );
}
