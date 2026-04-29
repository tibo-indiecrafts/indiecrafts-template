import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui-primitives/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui-primitives/card";
import {
  sectionCardsItems,
  sectionCardsNamespace,
  type SectionCardItem,
} from "./config";

export type SectionCardsProps = {
  /** Pass an array to override the demo KPI cards. */
  items?: readonly SectionCardItem[];
};

export function SectionCards({ items = sectionCardsItems }: SectionCardsProps = {}) {
  const t = useTranslations(sectionCardsNamespace);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {items.map((item, i) => {
        const TrendIcon = item.trend === "up" ? IconTrendingUp : IconTrendingDown;
        return (
          <Card key={i} className="@container/card">
            <CardHeader>
              <CardDescription>{t(item.descriptionKey)}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {item.value}
              </CardTitle>
              <CardAction className="row-span-1 self-center">
                <Badge variant="outline">
                  <TrendIcon aria-hidden="true" />
                  {item.badgeDelta}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {t(item.footerTitleKey)}{" "}
                <TrendIcon className="size-4" aria-hidden="true" />
              </div>
              <div className="text-muted-foreground">{t(item.footerHintKey)}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
