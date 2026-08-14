import type {
  FeatureGridModule,
  FeatureIcon,
} from "@indiecrafts/ui-components/shared/types";
import {
  Globe,
  Settings2,
  Shield,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@indiecrafts/ui/web/card";
import { RichTitle } from "../RichTitle";
import { ModuleSection } from "../layout/ModuleSection";

const ICONS: Record<FeatureIcon, LucideIcon> = {
  zap: Zap,
  settings: Settings2,
  sparkles: Sparkles,
  shield: Shield,
  globe: Globe,
  users: Users,
};

/**
 * Feature grid — a centered title/intro over a grid of icon cards. Each card
 * shows a token-coloured icon chip, a title, and a short body. Renders nothing
 * with no items.
 */
export function FeatureGrid({
  inline,
  ...props
}: FeatureGridModule & { inline?: boolean }) {
  const items = props.items ?? [];
  if (!items.length) return null;
  return (
    <ModuleSection anchor={props.anchor} inline={inline} className="@container">
      {props.title || props.intro ? (
        <div className="mx-auto max-w-2xl text-center">
          {props.title ? (
            <RichTitle
              as="h2"
              className="text-3xl font-semibold text-balance lg:text-4xl"
            >
              {props.title}
            </RichTitle>
          ) : null}
          {props.intro ? <p className="text-muted-foreground mt-4">{props.intro}</p> : null}
        </div>
      ) : null}
      <ul className="mx-auto mt-8 grid max-w-sm gap-6 *:text-center @2xl:mt-12 @4xl:max-w-full @4xl:grid-cols-3">
        {items.map((item) => {
          const Icon = ICONS[item.icon ?? "sparkles"] ?? Sparkles;
          return (
            <li key={item._key}>
              <Card className="h-full shadow-sm">
                <CardHeader className="pb-3">
                  <div className="bg-muted text-foreground mx-auto flex size-12 items-center justify-center rounded-lg">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  {item.title ? <h3 className="mt-6 font-medium">{item.title}</h3> : null}
                </CardHeader>
                {item.body ? (
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{item.body}</p>
                  </CardContent>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </ModuleSection>
  );
}
