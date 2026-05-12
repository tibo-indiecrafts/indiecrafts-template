import { CalendarDays, Clock2, Zap } from "lucide-react";
import { Container } from "@/components/ui-primitives/grid-1-landing-container";
import { MapIllustration } from "@/components/ui-illustrations/grid-1-landing-map-illustration";
import { VisualizationIllustration } from "@/components/ui-illustrations/grid-1-landing-visualization-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { features30Namespace } from "./config";
import type { Features30Block } from "./schema";

/**
 * Features-30 — JSX verbatim. Map + Visualization illustrations
 * above a 3-tile row (each: icon, title, body). Tiles 1-3 reuse
 * the same copy in upstream — extracted as separate keys so
 * customizers can diverge per tile.
 */
export default function Features(props: Readonly<Features30Block>) {
  const [t] = useScopedT(features30Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <Container>
        <div className="mx-auto w-full max-w-5xl px-6 xl:px-0">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <span className="text-foreground font-mono text-sm uppercase">
              <span className="text-muted-foreground">{t("eyebrow.tag")}</span>{" "}
              {t("eyebrow.label")}
            </span>
            <h2
              id={`${props.id}-heading`}
              className="text-foreground mt-6 text-4xl font-semibold text-balance lg:text-5xl"
            >
              {t("title")}
            </h2>
            <p className="text-muted-foreground text-lg text-balance">{t("body")}</p>
          </div>
        </div>
      </Container>
      <Container className="**:data-[slot=content]:py-0">
        <div className="relative">
          <div className="grid border-b *:p-4 @max-4xl:divide-y @4xl:grid-cols-2 @4xl:divide-x @4xl:*:p-8 @5xl:*:p-12">
            <div className="row-span-2 grid grid-rows-subgrid gap-8">
              <div className="relative self-center mask-radial-from-35% @4xl:-mx-12">
                <MapIllustration />
              </div>
              <div className="mx-auto max-w-sm text-center">
                <h3 className="font-semibold text-balance">{t("cards.map.title")}</h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  {t("cards.map.body")}
                </p>
              </div>
            </div>
            <div className="row-span-2 grid grid-rows-subgrid gap-8">
              <div className="mx-auto w-full max-w-md self-center @4xl:px-8">
                <VisualizationIllustration />
              </div>

              <div className="relative z-10 mx-auto max-w-sm text-center">
                <h3 className="font-semibold text-balance">{t("cards.viz.title")}</h3>
                <p className="text-muted-foreground mt-3 text-balance">
                  {t("cards.viz.body")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 divide-x *:p-4 lg:*:nth-3:border-r-0 @max-4xl:divide-y @max-4xl:*:nth-2:border-r-0 @max-4xl:*:nth-3:border-b-0 @4xl:grid-cols-3 @4xl:*:p-8 @5xl:*:p-12">
            <div className="space-y-1.5">
              <Clock2 className="stroke-primary size-4 fill-indigo-500/25" />
              <h3 className="mt-3 font-medium">{t("tiles.tile1.title")}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {t("tiles.tile1.body")}
              </p>
            </div>
            <div className="space-y-1.5">
              <Zap className="stroke-primary size-4 fill-indigo-500/25" />
              <h3 className="mt-3 font-medium">{t("tiles.tile2.title")}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {t("tiles.tile2.body")}
              </p>
            </div>
            <div className="space-y-1.5">
              <CalendarDays className="stroke-primary size-4 fill-indigo-500/25" />
              <h3 className="mt-3 font-medium">{t("tiles.tile3.title")}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {t("tiles.tile3.body")}
              </p>
            </div>
            <div className="space-y-1.5 md:hidden">
              <CalendarDays className="stroke-primary size-4 fill-indigo-500/25" />
              <h3 className="mt-3 font-medium">{t("tiles.tile3.title")}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {t("tiles.tile3.body")}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
