"use client";

import { useEffect, useState } from "react";
import { Link2, Check } from "lucide-react";
import { shareTargets } from "@indiecrafts/packages-shared-utils/share";
import {
  BrandIcon,
  type BrandName,
} from "@indiecrafts/packages-shared-ui-icons/web";

/**
 * Share row — X / LinkedIn / Facebook open a share intent in a new tab (plain
 * links, work without JS); "copy link" needs the clipboard API, so this is a
 * client component. Generic over `url` + `title` (resolved by the host): the
 * blog post mounts it inline (post URL + title); `DefaultLayout` mounts it in
 * the footer for a site-wide "share this page" (page URL + site name).
 */
export function ShareButtons({
  url,
  title,
  labels,
  networks,
}: {
  url?: string;
  title: string;
  labels: {
    label: string;
    x: string;
    linkedin: string;
    facebook: string;
    copy: string;
    copied: string;
  };
  /** Which controls to show (editor-driven, from Sanity). Unset/`true` = shown. */
  networks?: {
    x?: boolean;
    linkedin?: boolean;
    facebook?: boolean;
    copyLink?: boolean;
  };
}) {
  const [copied, setCopied] = useState(false);

  // `url` is passed by the website/blog (server-resolved, no flash). Omitted on
  // client-only surfaces (the app, the Electron renderer) → resolve the current page
  // URL on the client, deferred to an effect so SSR and the first client render match.
  const [pageUrl, setPageUrl] = useState(url ?? "");
  useEffect(() => {
    if (url === undefined) setPageUrl(window.location.href);
  }, [url]);

  // Intent URLs come from the shared, platform-agnostic helper; here we add the
  // web-only bits (brand icon + aria-label). `key` doubles as the BrandName.
  const targets = shareTargets(pageUrl, title)
    .filter((tgt) => networks?.[tgt.key] !== false)
    .map((tgt) => ({
      ...tgt,
      brand: tgt.key as BrandName,
      label: labels[tgt.key],
    }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("clipboard copy failed", error);
    }
  };

  const btn =
    "text-muted-foreground hover:text-foreground hover:border-foreground/30 focus-visible:ring-ring ring-border/60 inline-flex size-9 items-center justify-center rounded-full ring-1 transition-colors focus-visible:ring-2 focus-visible:outline-none";

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground text-sm">{labels.label}</span>
      <ul className="flex items-center gap-2">
        {targets.map(({ key, label, href, brand }) => (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={btn}
            >
              <BrandIcon name={brand} aria-hidden="true" className="size-4" />
            </a>
          </li>
        ))}
        {networks?.copyLink !== false ? (
          <li>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? labels.copied : labels.copy}
              className={btn}
            >
              {copied ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <Link2 aria-hidden="true" className="size-4" />
              )}
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
