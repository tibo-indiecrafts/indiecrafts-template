import type { ComponentType } from "react";
import { Card } from "@/components/ui-primitives/card";
import { CurrencyIllustration } from "@/components/ui-illustrations/currency-illustration";
import {
  NotificationIllustration,
  type NotificationVariant,
} from "@/components/ui-illustrations/notification-illustration";
import { PollIllustration } from "@/components/ui-illustrations/poll-illustration";
import { ReplyIllustration } from "@/components/ui-illustrations/reply-illustration";
import { VisualizationIllustration } from "@/components/ui-illustrations/visualization-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { bento01Namespace } from "./config";
import type { BentoBlock, BentoCell, BentoIllustration } from "./schema";

const ILLUSTRATIONS: Record<
  Exclude<BentoIllustration, "notification">,
  ComponentType<{ className?: string }>
> = {
  currency: CurrencyIllustration,
  poll: PollIllustration,
  reply: ReplyIllustration,
  visualization: VisualizationIllustration,
};

export default function Bento(props: Readonly<BentoBlock>) {
  return (
    <section aria-labelledby={`${props.id}-heading`} className="@container py-24">
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
  const [, , tRoot] = useScopedT(bento01Namespace);
  const isWide = cell.span === "wide";
  const showStripes = cell.showStripes ?? !isWide;

  return (
    <Card
      className={cn(
        "grid grid-rows-[auto_1fr] overflow-hidden rounded-2xl p-8",
        isWide ? "gap-8 @xl:col-span-2 @3xl:col-span-4" : "space-y-8 @3xl:col-span-2",
      )}
    >
      <div>
        <h3 className="text-foreground font-semibold">{tRoot(cell.titleKey)}</h3>
        <p className="text-muted-foreground mt-3 text-balance">{tRoot(cell.bodyKey)}</p>
      </div>
      {isWide ? (
        <CellIllustration
          illustration={cell.illustration}
          notificationVariant={cell.notificationVariant}
        />
      ) : (
        <div className="relative -m-8 flex items-end bg-linear-to-b p-8">
          {showStripes ? <Stripes /> : null}
          <CellIllustration
            illustration={cell.illustration}
            notificationVariant={cell.notificationVariant}
          />
        </div>
      )}
    </Card>
  );
}

function CellIllustration({
  illustration,
  notificationVariant,
}: Readonly<{
  illustration: BentoIllustration;
  notificationVariant?: NotificationVariant;
}>) {
  if (illustration === "notification") {
    return <NotificationIllustration variant={notificationVariant ?? "mixed"} />;
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
