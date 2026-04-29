import { useTranslations } from "next-intl";
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
import type { Features4Block, Features4Icon } from "./schema";

const ICONS: Record<Features4Icon, LucideIcon> = {
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

export default function Features4(props: Readonly<Features4Block>) {
  const t = useTranslations();

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-medium text-balance lg:text-5xl"
          >
            {t(props.titleKey)}
          </h2>
          {props.bodyKey ? (
            <p className="text-muted-foreground">{t(props.bodyKey)}</p>
          ) : null}
        </div>

        <ul className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          {props.items.map((item, i) => {
            const Icon = ICONS[item.iconKey];
            return (
              <li key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="size-4" aria-hidden="true" />
                  <h3 className="text-sm font-medium">{t(item.titleKey)}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t(item.bodyKey)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
