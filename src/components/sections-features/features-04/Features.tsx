import {
  Cpu,
  Fingerprint,
  Globe,
  Pencil,
  Settings2,
  Shield,
  Sparkles,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features04Namespace } from "./config";
import type { FeaturesBlock, FeaturesIcon } from "./schema";

const ICONS: Record<FeaturesIcon, LucideIcon> = {
  zap: Zap,
  cpu: Cpu,
  fingerprint: Fingerprint,
  pencil: Pencil,
  settings: Settings2,
  sparkles: Sparkles,
  shield: Shield,
  users: Users,
  globe: Globe,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features04Namespace);

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-medium text-balance lg:text-5xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          {props.bodyKey ? (
            <p className="text-muted-foreground">{tr(props.bodyKey, "body")}</p>
          ) : null}
        </div>

        <ul className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          {props.items.map((item, i) => {
            const Icon = ICONS[item.iconKey];
            return (
              <li key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="size-4" aria-hidden="true" />
                  <h3 className="text-sm font-medium">{tRoot(item.titleKey)}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{tRoot(item.bodyKey)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
