import type { ComponentType } from "react";
import { Card } from "@/components/ui-primitives/card";
import { CurrencyIllustration } from "@/components/ui-illustrations/currency-illustration";
import { MapIllustration } from "@/components/ui-illustrations/map-illustration";
import {
  NotificationIllustration,
  type NotificationVariant,
} from "@/components/ui-illustrations/notification-illustration";
import { PollIllustration } from "@/components/ui-illustrations/poll-illustration";
import { ReplyIllustration } from "@/components/ui-illustrations/reply-illustration";
import { VisualizationIllustration } from "@/components/ui-illustrations/visualization-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { bento02Namespace } from "./config";
import type { BentoBlock, BentoCell, BentoCellBg, BentoIllustration } from "./schema";

const ILLUSTRATIONS: Record<
  Exclude<BentoIllustration, "notification" | "reply">,
  ComponentType
> = {
  currency: CurrencyIllustration,
  map: MapIllustration,
  poll: PollIllustration,
  visualization: VisualizationIllustration,
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
        <div className="not-dark:*:bg-card/50 grid gap-3 @xl:grid-cols-2 @3xl:grid-cols-6">
          {props.cells.map((cell, index) => (
            <BentoCellCard key={index} cell={cell} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoCellCard({ cell }: Readonly<{ cell: BentoCell }>) {
  const [, , tRoot] = useScopedT(bento02Namespace);
  const isTriple = cell.span === "triple";
  const bg: BentoCellBg = cell.bg ?? (isTriple ? "none" : "stripes");

  return (
    <Card
      className={cn(
        "grid grid-rows-[1fr_auto] overflow-hidden rounded-2xl p-8",
        isTriple
          ? "gap-8 @xl:col-span-2 @3xl:col-span-3"
          : "gap-y-12 @xl:col-span-2 @3xl:col-span-2",
      )}
    >
      <CellMedia cell={cell} bg={bg} />
      <div>
        <h3 className="text-foreground font-semibold">{tRoot(cell.titleKey)}</h3>
        <p className="text-muted-foreground mt-3 text-balance">{tRoot(cell.bodyKey)}</p>
      </div>
    </Card>
  );
}

function CellMedia({ cell, bg }: Readonly<{ cell: BentoCell; bg: BentoCellBg }>) {
  const inner = (
    <CellIllustration
      illustration={cell.illustration}
      notificationVariant={cell.notificationVariant}
    />
  );

  if (bg === "stripes") {
    return (
      <div className="relative -m-8 p-8">
        <Stripes />
        {inner}
      </div>
    );
  }
  if (bg === "radialMask") {
    return (
      <div className="relative -mx-8 [mask-image:radial-gradient(ellipse_50%_45%_at_50%_50%,#000_70%,transparent_100%)] [--color-background:transparent]">
        {inner}
      </div>
    );
  }
  return <div className="-m-8 p-8">{inner}</div>;
}

function CellIllustration({
  illustration,
  notificationVariant,
}: Readonly<{
  illustration: BentoIllustration;
  notificationVariant?: NotificationVariant;
}>) {
  if (illustration === "notification") {
    return (
      <NotificationIllustration
        variant={notificationVariant ?? "mixed"}
        className="*:!rounded-2xl"
      />
    );
  }
  if (illustration === "reply") {
    return <ReplyIllustration className="relative mt-0 w-full" />;
  }
  const Illustration = ILLUSTRATIONS[illustration];
  return <Illustration />;
}

function Stripes() {
  return (
    <div
      aria-hidden
      className="absolute -inset-x-6 inset-y-0 bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_6px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-3"
    />
  );
}
