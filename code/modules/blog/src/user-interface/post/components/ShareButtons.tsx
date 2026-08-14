"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { logger } from "@indiecrafts/logger";
import {
  XIcon,
  LinkedInIcon,
  FacebookIcon,
} from "@indiecrafts/blog/user-interface/shared/components/BrandIcons";

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

  const targets = [
    { key: "x", label: labels.x, href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, Icon: XIcon },
    { key: "linkedin", label: labels.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: LinkedInIcon },
    { key: "facebook", label: labels.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon },
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
        {targets.map(({ key, label, href, Icon }) => (
          <li key={key}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={btn}>
              <Icon aria-hidden="true" className="size-4" />
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} aria-label={copied ? labels.copied : labels.copy} className={btn}>
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
