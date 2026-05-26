import type { ComponentType } from "react";
import { Card } from "@/components/ui-primitives/card";
import { CampaignIllustration } from "@/components/ui-illustrations/campaign-illustration";
import { ScanIllustration } from "@/components/ui-illustrations/scan-illustration";
import { VisualizationIllustration } from "@/components/ui-illustrations/visualization-illustration";
import { Cloudflare } from "@/components/ui-primitives/svgs/cloudflare";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { Linear } from "@/components/ui-primitives/svgs/linear";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { Replit } from "@/components/ui-primitives/svgs/replit";
import { VSCodium } from "@/components/ui-primitives/svgs/vs-codium";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { bento03Namespace } from "./config";
import type { BentoBlock, BentoCell, BentoCellSpan, IntegrationBrand } from "./schema";

type IllustrationCellKind = Extract<BentoCell, { kind: "illustration" }>["illustration"];

const ILLUSTRATIONS: Record<IllustrationCellKind, ComponentType> = {
  scan: ScanIllustration,
  visualization: VisualizationIllustration,
  campaign: CampaignIllustration,
};

const BRAND_ICONS: Record<IntegrationBrand, ComponentType<{ className?: string }>> = {
  vsCodium: VSCodium,
  replit: Replit,
  googlePalm: GooglePaLM,
  linear: Linear,
  openAi: OpenAI,
  cloudflare: Cloudflare,
};

const SPAN_CLASSES: Record<BentoCellSpan, string> = {
  double: "@3xl:col-span-2",
  quad: "@3xl:col-span-4",
  triple: "@xl:col-span-full @3xl:col-span-3",
};

export default function Bento(props: Readonly<BentoBlock>) {
  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background @container py-24"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Features
      </h2>
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        <div className="grid gap-3 @xl:grid-cols-2 @3xl:grid-cols-6">
          {props.cells.map((cell, index) => (
            <BentoCellCard key={index} cell={cell} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCellCard({ cell }: Readonly<{ cell: BentoCell }>) {
  const [, , tRoot] = useScopedT(bento03Namespace);
  const isCampaign = cell.kind === "illustration" && cell.illustration === "campaign";
  const isVisualization =
    cell.kind === "illustration" && cell.illustration === "visualization";
  const isIntegrations = cell.kind === "integrations";

  return (
    <Card
      className={cn(
        "grid grid-rows-[auto_1fr] overflow-hidden rounded-2xl p-8",
        SPAN_CLASSES[cell.span],
        isVisualization || isIntegrations ? "gap-8" : isCampaign ? "space-y-8" : "gap-8",
        "group",
      )}
    >
      <div>
        <h3 className="text-foreground font-semibold">{tRoot(cell.titleKey)}</h3>
        <p className="text-muted-foreground mt-3 text-balance">{tRoot(cell.bodyKey)}</p>
      </div>
      <CellMedia cell={cell} />
    </Card>
  );
}

function CellMedia({ cell }: Readonly<{ cell: BentoCell }>) {
  if (cell.kind === "integrations") {
    return (
      <div
        aria-hidden
        className="border-background relative -m-8 flex flex-col justify-center border-x bg-linear-to-b from-transparent via-orange-400/5 to-zinc-400/5 p-8"
      >
        <Stripes />
        <IntegrationsGrid brands={cell.brands} />
      </div>
    );
  }

  if (cell.illustration === "scan") {
    return (
      <div className="relative -m-8 flex flex-wrap items-center justify-between gap-1 from-transparent via-rose-50 to-amber-50 p-8">
        <ScanIllustration />
      </div>
    );
  }

  const Illustration = ILLUSTRATIONS[cell.illustration];
  return <Illustration />;
}

function IntegrationsGrid({ brands }: Readonly<{ brands: readonly IntegrationBrand[] }>) {
  return (
    <>
      <div className="relative grid grid-cols-3 gap-4 @md:grid-cols-6">
        <EmptyTile className="hidden @md:block" />
        <BrandTile brand={brands[0]} />
        <EmptyTile className="hidden @md:block" />
        <BrandTile brand={brands[1]} />
        <EmptyTile className="hidden @md:block" />
        <BrandTile brand={brands[2]} />
      </div>
      <div className="relative mt-4 grid grid-cols-3 gap-4 @md:grid-cols-6">
        <BrandTile brand={brands[3]} />
        <EmptyTile className="hidden @md:block" />
        <BrandTile brand={brands[4]} />
        <EmptyTile className="hidden @md:block" />
        <BrandTile brand={brands[5]} />
        <EmptyTile className="hidden @md:block" />
      </div>
    </>
  );
}

function BrandTile({ brand }: Readonly<{ brand: IntegrationBrand }>) {
  const Icon = BRAND_ICONS[brand];
  return (
    <div className="bg-illustration ring-border-illustration flex aspect-square items-center justify-center rounded-(--radius) p-4 shadow-md ring-1 shadow-black/6.5">
      <Icon className="size-6" />
    </div>
  );
}

function EmptyTile({ className }: Readonly<{ className?: string }>) {
  return (
    <div
      className={cn(
        "bg-card/50 border-foreground/15 aspect-square rounded-(--radius) border border-dashed backdrop-blur-3xl",
        className,
      )}
    />
  );
}

function Stripes() {
  return (
    <div
      aria-hidden
      className="absolute -inset-x-6 inset-y-0 bg-[repeating-linear-gradient(-45deg,black,black_1px,transparent_1px,transparent_6px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] mix-blend-overlay"
    />
  );
}
