"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { madeBy } from "@/config";
import { Popover, PopoverContent, PopoverTrigger } from "@/user-interface/ui/popover";

/**
 * Footer maker-credit: "Made with <Indiecrafts>" where the brand name opens a
 * **link preview** of indiecrafts.dev (og image + title + description + domain).
 *
 * Uses a Popover (click/tap), not a HoverCard — so the preview works on **touch**
 * where there is no hover: tapping the name opens the card, and Radix's collision
 * handling keeps it inside the viewport on a phone. The preview card is itself the
 * link to indiecrafts.dev, so one more tap visits. Keyboard: Enter/Space opens,
 * Escape closes, focus is trapped and returned.
 *
 * The preview image is the live external asset (`madeBy.image`) so the credit keeps
 * showing Indiecrafts even on a rebranded client site.
 */
export function MadeByCredit() {
  const t = useTranslations("footer");
  return (
    <p className="text-muted-foreground mt-1 text-xs">
      {t("creditPrefix")}{" "}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`${madeBy.name} — ${t("previewLabel")}`}
            className="text-foreground hover:text-brand focus-visible:ring-ring inline rounded font-semibold underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            {madeBy.name}
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="w-72 max-w-[calc(100vw-2rem)] overflow-hidden p-0"
        >
          {/* The whole card links to indiecrafts.dev. Real OG data (image/title/
              description) — its published SEO, a live external asset so it stays
              Indiecrafts after a client rebrand. */}
          <a
            href={madeBy.href}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:ring-ring group block rounded-md focus-visible:ring-2 focus-visible:outline-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={madeBy.image}
              alt=""
              loading="lazy"
              className="h-32 w-full object-cover"
            />
            <span className="block p-3">
              <span className="text-foreground line-clamp-2 block text-sm font-semibold text-balance">
                {madeBy.title}
              </span>
              <span className="text-muted-foreground mt-1 line-clamp-3 block text-sm leading-snug">
                {madeBy.description}
              </span>
              <span className="text-brand mt-1.5 flex items-center gap-1 text-xs font-medium">
                {madeBy.domain}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </span>
            </span>
          </a>
        </PopoverContent>
      </Popover>
    </p>
  );
}
