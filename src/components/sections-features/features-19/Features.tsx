import { CalendarDays, Clock2, Zap, type LucideIcon } from "lucide-react";
import CodeBlockIllustration from "@/components/ui-illustrations/code-block-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features19Namespace } from "./config";
import type { FeaturesBlock, StatIcon } from "./schema";

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  clock: Clock2,
  zap: Zap,
  calendar: CalendarDays,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features19Namespace);

  return (
    <section
      aria-labelledby={props.titleKey ? `${props.id}-title` : undefined}
      className="py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        {props.titleKey ? (
          <div className="mb-12 text-center">
            <h2
              id={`${props.id}-title`}
              className="text-4xl font-semibold text-balance lg:text-5xl"
            >
              {tr(props.titleKey, "title")}
            </h2>
            {props.bodyKey ? (
              <p className="text-muted-foreground mt-4">{tr(props.bodyKey, "body")}</p>
            ) : null}
          </div>
        ) : null}

        <div className="relative p-4 md:p-12">
          <div
            aria-hidden
            className="absolute -inset-x-12 inset-y-0 border-y mask-x-from-95%"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 -inset-y-12 border-x mask-y-from-95%"
          />
          <CodeBlockIllustration />

          <div className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-24">
            <div
              aria-hidden
              className="absolute inset-x-0 -inset-y-24 mx-auto w-[calc(33.333%+3rem)] border-x border-dashed mask-y-from-95% max-md:hidden"
            />
            {props.stats.map((stat, i) => {
              const Icon = STAT_ICONS[stat.iconKey];
              return (
                <div key={i} className="space-y-1.5">
                  <Icon
                    className="fill-foreground/10 stroke-primary size-4"
                    aria-hidden="true"
                  />
                  <h3 className="mt-3 font-medium">{tRoot(stat.titleKey)}</h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {tRoot(stat.bodyKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
