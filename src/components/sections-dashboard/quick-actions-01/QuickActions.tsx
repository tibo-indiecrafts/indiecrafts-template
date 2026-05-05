import {
  BarChart3,
  CreditCard,
  Download,
  Mail,
  Plus,
  Settings,
  Upload,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { ActionCard } from "@/components/ui-molecules/action-card";
import { useScopedT } from "@/i18n/scoped-t";
import { quickActions01Items, quickActions01Namespace } from "./config";
import type { QuickActionIcon, QuickActionsBlock } from "./schema";

const ICONS: Record<QuickActionIcon, LucideIcon> = {
  Plus,
  UserPlus,
  BarChart3,
  CreditCard,
  Settings,
  Upload,
  Download,
  Mail,
};

/**
 * Quick-actions dashboard section — a responsive 1/2/4 column grid of
 * icon-labeled CTA cards. Each action becomes a click-through card when
 * `href` is set, else renders as a static card. Pairs naturally with
 * the KPI `SectionCards` and the activity feed on the dashboard page.
 */
export default function QuickActions(props: Readonly<QuickActionsBlock>) {
  const [t, tr] = useScopedT(quickActions01Namespace);
  const actions = props.actions ?? quickActions01Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="px-(--gutter) py-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-4">
          <h2
            id={titleId}
            className="text-foreground text-xl font-semibold tracking-tight"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm text-pretty">
            {tr(props.descriptionKey, "description")}
          </p>
        </header>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <li key={action.id}>
              <ActionCard
                icon={ICONS[action.iconKey]}
                title={t(`items.${action.id}.title`)}
                description={t(`items.${action.id}.description`)}
                href={action.href}
                variant="compact"
                tone="primary"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
