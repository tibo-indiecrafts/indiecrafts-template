"use client";

import { useTranslations } from "next-intl";
import { Bell, Globe, Heart, Rocket, Settings2, Sparkles, Star, Zap } from "lucide-react";
import {
  Bell as ReBell,
  Home as ReHome,
  Rocket as ReRocket,
  ShieldCheck as ReShield,
} from "reicon-react";
import {
  Figma,
  Github,
  Nextdotjs,
  React as ReactLogo,
  Sanity,
  Tailwindcss,
  Typescript,
  Vercel,
} from "reicon-brands";
import { BrandIcon } from "@/user-interface/shared/components/BrandIcon";

/**
 * Icon-systems showcase for the homepage. Demonstrates the three icon sets
 * the template ships, each doing the job it's best at:
 *   - Lucide — the outline UI glyph set (default across the app)
 *   - Reicon — the same icons in Outline *and* Filled weights
 *   - Reicon Brands — logos painted in their official brand colors
 *
 * Client component — `reicon-react` icons are `"use client"`, so the whole
 * section renders on the client. Reads its copy from `namespace`.
 */
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
            {[Zap, Settings2, Sparkles, Heart, Star, Rocket, Bell, Globe].map(
              (Icon, i) => (
                <Tile key={i}>
                  <Icon className="size-5" aria-hidden="true" />
                </Tile>
              ),
            )}
          </IconGroup>

          <IconGroup label={t("reicon")}>
            {[ReHome, ReShield, ReBell, ReRocket].flatMap((Icon, i) => [
              <Tile key={`o${i}`}>
                <Icon size={20} />
              </Tile>,
              <Tile key={`f${i}`} filled>
                <Icon size={20} weight="Filled" />
              </Tile>,
            ])}
          </IconGroup>

          <IconGroup label={t("brands")}>
            {[
              Github,
              Figma,
              ReactLogo,
              Nextdotjs,
              Typescript,
              Tailwindcss,
              Vercel,
              Sanity,
            ].map((icon, i) => (
              <Tile key={i}>
                <BrandIcon icon={icon} size={20} brandColor />
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
