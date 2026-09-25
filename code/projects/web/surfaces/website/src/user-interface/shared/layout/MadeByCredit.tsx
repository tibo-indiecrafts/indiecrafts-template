"use client";

/**
 * Render the footer maker credit with a tap-friendly link preview.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/MadeByCredit.md
 */

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@indiecrafts/packages-web-ui/web/popover";

/**
 * Footer maker-credit: "Made with <name>" where the brand name opens a **link
 * preview** (og image + title + description + domain). The data is edited in Sanity
 * (`siteSettings.madeBy`, seeded with the indiecrafts.dev values) and passed in —
 * so a client can keep, rebrand, or clear the credit. Renders nothing without a name.
 *
 * Uses a Popover (click/tap), not a HoverCard — so the preview works on **touch**
 * where there is no hover: tapping the name opens the card, Radix keeps it in the
 * viewport. The preview card is itself the link, so one more tap visits. Keyboard:
 * Enter/Space opens, Escape closes, focus is trapped and returned.
 */
export type MadeByData = {
  name?: string;
  href?: string;
  image?: string;
  title?: string;
  description?: string;
  domain?: string;
};

export function MadeByCredit({ madeBy }: { madeBy: MadeByData }) {
  const t = useTranslations("footer");
  const { name, href, image, title, description, domain } = madeBy;
  if (!name) return null;

  return (
    <p className="text-muted-foreground mt-1 text-xs">
      {t("creditPrefix")}{" "}
      {href ? (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`${name} — ${t("previewLabel")}`}
              className="text-foreground hover:text-brand focus-visible:ring-ring inline rounded font-semibold underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              {name}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            collisionPadding={16}
            className="w-72 max-w-[calc(100vw-2rem)] overflow-hidden p-0"
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-visible:ring-ring group block rounded-md focus-visible:ring-2 focus-visible:outline-none"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-32 w-full object-cover"
                />
              ) : null}
              <span className="block p-3">
                {title ? (
                  <span className="text-foreground line-clamp-2 block text-sm font-semibold text-balance">
                    {title}
                  </span>
                ) : null}
                {description ? (
                  <span className="text-muted-foreground mt-1 line-clamp-3 block text-sm leading-snug">
                    {description}
                  </span>
                ) : null}
                {domain ? (
                  <span className="text-brand mt-1.5 flex items-center gap-1 text-xs font-medium">
                    {domain}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </span>
                ) : null}
              </span>
            </a>
          </PopoverContent>
        </Popover>
      ) : (
        <span className="text-foreground font-semibold">{name}</span>
      )}
    </p>
  );
}
