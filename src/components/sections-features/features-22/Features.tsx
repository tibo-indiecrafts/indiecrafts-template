import { ChevronRight, Cpu, Lock, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { DropdownIllustration } from "@/components/ui-illustrations/dropdown-illustration";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features22Namespace } from "./config";
import type { FeaturesBlock, StatIcon } from "./schema";

const STAT_ICONS: Record<StatIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  lock: Lock,
  sparkles: Sparkles,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features22Namespace);
  const external = props.ctaHref.startsWith("http");

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background overflow-hidden py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        <div className="grid items-center gap-6 pb-12 md:grid-cols-2">
          <DropdownIllustration />
          <div>
            <div className="max-w-md">
              <h2
                id={`${props.id}-title`}
                className="text-foreground text-4xl font-semibold text-balance"
              >
                {tr(props.titleKey, "title")}
              </h2>
              <p className="text-muted-foreground mt-6 text-lg text-balance">
                {tr(props.bodyKey, "body")}
              </p>
              <Button asChild className="mt-8 pr-2" variant="outline">
                <a
                  href={props.ctaHref}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  {tr(props.ctaLabelKey, "cta")}
                  <ChevronRight className="size-4 opacity-50" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-x-3 gap-y-6 border-t pt-12 sm:gap-6 lg:grid-cols-4">
          {props.stats.map((stat, i) => {
            const Icon = STAT_ICONS[stat.iconKey];
            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon
                    className="text-foreground fill-foreground/10 size-4"
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-medium">{tRoot(stat.titleKey)}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{tRoot(stat.bodyKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
