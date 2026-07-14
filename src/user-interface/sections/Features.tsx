import { useTranslations } from "next-intl";
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
import { Card, CardContent, CardHeader } from "@/user-interface/ui/card";

export type FeatureIcon = "zap" | "settings" | "sparkles" | "shield" | "globe" | "users";

export type FeatureItem = {
  /** Maps to `<namespace>.items.<id>.{title,body}` in messages. */
  id: string;
  iconKey?: FeatureIcon;
};

export type FeaturesBlock = {
  type: "features";
  id: string;
  /**
   * i18n namespace — e.g. `"pages.home.blocks.features"`. The section
   * reads `t("title")`, `t("body")`, and `t("items.<id>.title|body")`
   * relative to this root.
   */
  namespace: string;
  items: readonly FeatureItem[];
};

const ICONS: Record<FeatureIcon, LucideIcon> = {
  zap: Zap,
  settings: Settings2,
  sparkles: Sparkles,
  shield: Shield,
  globe: Globe,
  users: Users,
};

export function Features(props: Readonly<FeaturesBlock>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(props.namespace as any);

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
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-4">{t("body")}</p>
        </div>
        <ul className="mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 @min-4xl:max-w-full @min-4xl:grid-cols-3">
          {props.items.map((item) => {
            const Icon = item.iconKey ? ICONS[item.iconKey] : Sparkles;
            return (
              <li key={item.id}>
                <Card className="group h-full shadow-sm">
                  <CardHeader className="pb-3">
                    <CardDecorator>
                      <Icon className="size-6" aria-hidden="true" />
                    </CardDecorator>
                    <h3 className="mt-6 font-medium">{t(`items.${item.id}.title`)}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {t(`items.${item.id}.body`)}
                    </p>
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
