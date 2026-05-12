import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  ContactRound,
  Hand,
  Server,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import { ActionCard } from "@/components/ui-molecules/widget/action-card";
import { useScopedT } from "@/i18n/scoped-t";
import { gridList03Items, gridList03Namespace } from "./config";
import type { GridListBlock, GridListIconName } from "./schema";

const ICONS: Record<GridListIconName, LucideIcon> = {
  ArrowRight,
  UserCircle,
  Server,
  CheckCircle,
  ContactRound,
  Hand,
};

export default function GridList(props: Readonly<GridListBlock>) {
  const [t, tr] = useScopedT(gridList03Namespace);
  const items = props.items ?? gridList03Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="flex items-center justify-center p-8">
      <div className="w-full">
        <h2 id={titleId} className="sr-only">
          {tr(props.titleKey, "title")}
        </h2>
        <div className="bg-muted grid grid-cols-1 gap-0.5 space-y-0.5 overflow-hidden rounded-2xl p-0.5 shadow-sm sm:grid-cols-2 sm:gap-0.5 sm:space-y-0 lg:grid-cols-3">
          {items.map((item) => (
            <ActionCard
              key={item.id}
              icon={ICONS[item.icon]}
              title={t(`items.${item.id}.title`)}
              description={t(`items.${item.id}.description`)}
              href={item.href}
              variant="tile"
              tone={item.tone}
              cornerAccent={<ArrowUpRight className="h-6 w-6" />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
