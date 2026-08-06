"use client";

import { useTranslations } from "next-intl";
import { madeBy } from "@/config";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/user-interface/ui/hover-card";

/**
 * Footer maker-credit: "Made with <Indiecrafts>" where the brand name opens a
 * hover/focus preview card of indiecrafts.dev (og image + description + url).
 *
 * Client-only (Radix HoverCard handles hover **and** keyboard focus), isolated
 * from the server-rendered `Footer` so the rest of the chrome stays RSC. The
 * preview image is the live external asset (`madeBy.image`) so the credit keeps
 * showing Indiecrafts even on a rebranded client site.
 */
export function MadeByCredit() {
  const t = useTranslations("footer");
  return (
    <p className="text-muted-foreground mt-1 text-xs">
      {t("creditPrefix")}{" "}
      <HoverCard openDelay={120} closeDelay={80}>
        <HoverCardTrigger asChild>
          <a
            href={madeBy.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-brand focus-visible:ring-ring rounded font-semibold underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            {madeBy.name}
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-72 overflow-hidden p-0">
          {/* Real OG card from indiecrafts.dev — image/title/description are its
              published SEO data, not template copy. Live external asset so it
              stays Indiecrafts after a client rebrand. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={madeBy.image}
            alt={madeBy.title}
            loading="lazy"
            className="h-32 w-full object-cover"
          />
          <span className="block p-3">
            <span className="text-foreground block text-sm font-semibold text-balance">
              {madeBy.title}
            </span>
            <span className="text-muted-foreground mt-1 line-clamp-3 block text-sm leading-snug">
              {madeBy.description}
            </span>
            <span className="text-brand mt-1.5 block text-xs font-medium">
              {madeBy.domain}
            </span>
          </span>
        </HoverCardContent>
      </HoverCard>
    </p>
  );
}
