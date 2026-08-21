"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { logger } from "@indiecrafts/packages-shared-logger";
import {
  BrandIcon,
  type BrandName,
} from "@indiecrafts/packages-shared-ui-icons/web";

/**
 * Post share row — X / LinkedIn / Facebook open a share intent in a new tab
 * (plain links, work without JS); "copy link" needs the clipboard API, so the
 * row is a client component. `url` is the absolute post URL, resolved by the
 * server. Gated by `blog.display.post.share`.
 */
export function ShareButtons({
  url,
  title,
  labels,
}: {
  url: string;
  title: string;
  labels: {
    label: string;
    x: string;
    linkedin: string;
    facebook: string;
    copy: string;
    copied: string;
  };
}) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const targets: { key: string; label: string; href: string; brand: BrandName }[] =
    [
      {
        key: "x",
        label: labels.x,
        href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
        brand: "x",
      },
      {
        key: "linkedin",
        label: labels.linkedin,
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
        brand: "linkedin",
      },
      {
        key: "facebook",
        label: labels.facebook,
        href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        brand: "facebook",
      },
    ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error("clipboard copy failed", { error });
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
      </ul>
    </div>
  );
}
