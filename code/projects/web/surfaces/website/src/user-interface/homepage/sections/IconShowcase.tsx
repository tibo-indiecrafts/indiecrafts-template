"use client";

/**
 * Renders the homepage icon-systems showcase.
 *
 * @see docs/reference/projects/web/website/src/user-interface/homepage/sections/IconShowcase.md
 */

import { useTranslations } from "next-intl";
import {
  Icon,
  ReiconIcon,
  BrandIcon,
  type GlyphName,
  type BrandName,
} from "@indiecrafts/packages-web-ui-icons/web";

/**
 * Icon-systems showcase for the homepage. Demonstrates the icon sets the shared
 * `@indiecrafts/packages-web-ui-icons` brick ships, each doing the job it's best at:
 *   - Lucide (`Icon`) — the outline UI glyph set, cross-platform (web + native)
 *   - Reicon (`ReiconIcon`) — the same icons in Outline *and* Filled weights (web)
 *   - Brands (`BrandIcon`) — social marks painted in their official brand colors, from shared SVG data
 *
 * Client component — `reicon-react` icons are `"use client"`, so the whole
 * section renders on the client. Reads its copy from `namespace`.
 */
const GLYPH_DEMO: GlyphName[] = [
  "zap",
  "settings",
  "sparkles",
  "heart",
  "star",
  "rocket",
  "bell",
  "globe",
];
const REICON_DEMO = ["Home", "ShieldCheck", "Bell", "Rocket"];
const BRAND_DEMO: BrandName[] = [
  "github",
  "x",
  "linkedin",
  "instagram",
  "facebook",
  "mastodon",
];

export function IconShowcase({ id, namespace }: { id: string; namespace: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic namespace, matches the other sections
  const t = useTranslations(namespace as any);

  return (
    <section aria-labelledby={`${id}-title`} className="border-t py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-brand text-xs font-medium tracking-widest uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id={`${id}-title`}
            className="mt-4 text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-balance">{t("body")}</p>
        </div>

        <div className="mt-12 grid gap-4">
          <IconGroup label={t("lucide")}>
            {GLYPH_DEMO.map((name) => (
              <Tile key={name}>
                <Icon name={name} className="size-5" aria-hidden="true" />
              </Tile>
            ))}
          </IconGroup>

          <IconGroup label={t("reicon")}>
            {REICON_DEMO.flatMap((name) => [
              <Tile key={`o-${name}`}>
                <ReiconIcon name={name} size={20} />
              </Tile>,
              <Tile key={`f-${name}`} filled>
                <ReiconIcon name={name} size={20} weight="Filled" />
              </Tile>,
            ])}
          </IconGroup>

          <IconGroup label={t("brands")}>
            {BRAND_DEMO.map((name) => (
              <Tile key={name}>
                <BrandIcon name={name} size={20} brandColor />
              </Tile>
            ))}
          </IconGroup>
        </div>
      </div>
    </section>
  );
}

function IconGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-border/70 rounded-xl border p-5">
      <p className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <ul className="flex flex-wrap gap-2.5">{children}</ul>
    </div>
  );
}

function Tile({ filled, children }: { filled?: boolean; children: React.ReactNode }) {
  return (
    <li
      className={`ring-border/50 flex size-11 items-center justify-center rounded-lg ring-1 ${
        filled ? "bg-brand/10 text-brand" : "bg-muted/50"
      }`}
    >
      {children}
    </li>
  );
}
