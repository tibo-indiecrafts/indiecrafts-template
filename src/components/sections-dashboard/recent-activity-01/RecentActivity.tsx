import {
  CheckCircle,
  FileText,
  GitCommit,
  MessageCircle,
  Trash2,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { recentActivity01Items, recentActivity01Namespace } from "./config";
import type { RecentActivityBlock, RecentActivityIcon } from "./schema";

const ICONS: Record<RecentActivityIcon, LucideIcon> = {
  FileText,
  MessageCircle,
  GitCommit,
  UserPlus,
  CheckCircle,
  Trash2,
};

export default function RecentActivity(props: Readonly<RecentActivityBlock>) {
  const [t, tr] = useScopedT(recentActivity01Namespace);
  const items = props.items ?? recentActivity01Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="mx-auto w-full max-w-3xl">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h2
            id={titleId}
            className="text-foreground text-xl font-semibold tracking-tight"
          >
            {tr(props.titleKey, "title")}
          </h2>
          {props.descriptionKey || items.length > 0 ? (
            <p className="text-muted-foreground mt-1 text-sm text-pretty">
              {tr(props.descriptionKey, "description")}
            </p>
          ) : null}
        </div>
        {props.viewAllHref ? (
          <Link
            href={props.viewAllHref as Parameters<typeof Link>[0]["href"]}
            className="text-primary text-sm font-medium hover:underline"
          >
            {t("viewAll")}
          </Link>
        ) : null}
      </header>

      {items.length === 0 ? (
        <p className="text-muted-foreground rounded-md border border-dashed px-4 py-8 text-center text-sm">
          {t("empty")}
        </p>
      ) : (
        <ul className="divide-border divide-y rounded-md border">
          {items.map((item) => {
            const Icon = ICONS[item.iconKey];
            return (
              <li
                key={item.id}
                className="flex items-start gap-3 px-4 py-3 first:rounded-t-md last:rounded-b-md"
              >
                <span
                  className={cn(
                    "bg-muted text-muted-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                  )}
                  aria-hidden="true"
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm leading-tight">
                    <span className="font-medium">{t(`items.${item.id}.actor`)}</span>{" "}
                    <span className="text-muted-foreground">
                      {t(`items.${item.id}.action`)}
                    </span>{" "}
                    {item.href ? (
                      <Link
                        href={item.href as Parameters<typeof Link>[0]["href"]}
                        className="text-foreground font-medium hover:underline"
                      >
                        {t(`items.${item.id}.target`)}
                      </Link>
                    ) : (
                      <span className="font-medium">{t(`items.${item.id}.target`)}</span>
                    )}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                    {t(`items.${item.id}.timestamp`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
