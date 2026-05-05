import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { MeetIllustration } from "@/components/ui-illustrations/meet-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { hero12Namespace } from "./config";

/**
 * Centered headline + body + newsletter form floating over a softly
 * tinted angled-stripe backdrop, with the `MeetIllustration` (video
 * grid + draggable AI chat) underneath. Sourced from
 * `@tailark-pro/hero-section-12`, refactored to the project pattern:
 * section semantics (no `<main>` — that's the layout's job), all
 * visible strings via `blocks.hero-12.*`, primitives from
 * `ui-primitives`, illustration from `ui-illustrations`. The
 * `--color-illustration` token (defined in `globals.css`) keeps the
 * floating AI chat card dark regardless of the page theme — it's an
 * always-dark surface, not a color-mode-aware token.
 */
export function Hero() {
  const [t] = useScopedT(hero12Namespace);

  return (
    <section aria-labelledby="hero-12-title" className="relative overflow-x-hidden">
      <div className="relative pt-24 pb-24 md:pt-36 lg:pt-44">
        <div
          aria-hidden
          className="bg-background pointer-events-none absolute inset-1 h-[calc(100%-12rem)] overflow-hidden rounded-3xl border before:absolute before:inset-0 not-dark:before:bg-indigo-500/2.5"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-1 z-0 h-[calc(100%-12rem)] rounded-3xl mask-radial-[75%_75%] mask-radial-from-60% mask-radial-at-bottom"
          style={{
            backgroundImage: `
              repeating-linear-gradient(22.5deg, transparent, transparent 1px, rgba(75, 85, 99, 0.06) 1px, rgba(75, 85, 99, 0.06) 2px, transparent 2px, transparent 4px),
              repeating-linear-gradient(67.5deg, transparent, transparent 1px, rgba(107, 114, 128, 0.05) 1px, rgba(107, 114, 128, 0.05) 2px, transparent 2px, transparent 4px),
              repeating-linear-gradient(112.5deg, transparent, transparent 1px, rgba(55, 65, 81, 0.04) 1px, rgba(55, 65, 81, 0.04) 2px, transparent 2px, transparent 4px),
              repeating-linear-gradient(157.5deg, transparent, transparent 1px, rgba(31, 41, 55, 0.03) 1px, rgba(31, 41, 55, 0.03) 2px, transparent 2px, transparent 4px)
            `,
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <div>
            <div className="mb-16 max-w-3xl">
              <h1
                id="hero-12-title"
                className="text-5xl font-semibold text-balance md:text-6xl lg:text-6xl lg:tracking-tight"
              >
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-4 mb-8 text-lg text-balance">
                {t("body")}
              </p>

              <form className="w-full space-y-4 md:max-w-sm">
                <Label className="sr-only block" htmlFor="hero-12-email">
                  {t("form.label")}
                </Label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Input
                    className="bg-background ring-foreground/10 border-transparent shadow ring-1"
                    placeholder={t("form.placeholder")}
                    type="email"
                    id="hero-12-email"
                    required
                    name="email"
                  />
                  <Button type="submit" className="shadow">
                    <span>{t("form.submit")}</span>
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">{t("form.fineprint")}</p>
              </form>
            </div>
            <MeetIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
