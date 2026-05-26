import {
  Globe,
  Settings2,
  Shield,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui-primitives/card";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features01Namespace } from "./config";
import type { FeatureIcon, FeaturesBlock } from "./schema";

const ICONS: Record<FeatureIcon, LucideIcon> = {
  zap: Zap,
  settings: Settings2,
  sparkles: Sparkles,
  shield: Shield,
  globe: Globe,
  users: Users,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features01Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-muted/40 border-b py-16 md:py-32"
    >
      <div className="@container mx-auto max-w-5xl px-(--gutter)">
        <div className="text-center">
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
        <ul className="mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 @min-4xl:max-w-full @min-4xl:grid-cols-3">
          {props.items.map((item, i) => {
            const Icon = item.iconKey ? ICONS[item.iconKey] : Sparkles;
            return (
              <li key={i}>
                <Card className="group h-full shadow-sm">
                  <CardHeader className="pb-3">
                    <CardDecorator>
                      <Icon className="size-6" aria-hidden="true" />
                    </CardDecorator>
                    <h3 className="mt-6 font-medium">{tRoot(item.titleKey)}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{tRoot(item.bodyKey)}</p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function CardDecorator({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto size-36 mask-radial-from-40% mask-radial-to-60% duration-200 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-foreground)20%,transparent)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">
        {children}
      </div>
    </div>
  );
}
