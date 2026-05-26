import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { Card, CardContent } from "@/components/ui-primitives/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { useScopedT } from "@/components/_lib/scoped-t";
import { gridList01Items, gridList01Namespace } from "./config";
import type { GridListBlock } from "./schema";

export default function GridList(props: Readonly<GridListBlock>) {
  const [t, tr] = useScopedT(gridList01Namespace);
  const items = props.items ?? gridList01Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="flex items-center justify-center p-8">
      <div>
        <h2
          id={titleId}
          className="text-muted-foreground text-sm font-medium text-balance"
        >
          {tr(props.titleKey, "title")}
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="col-span-1">
              <Card className="flex w-full flex-row gap-0 overflow-hidden rounded-md py-0 shadow-2xs">
                <div className="bg-primary text-primary-foreground flex w-16 shrink-0 items-center justify-center text-sm font-medium">
                  {t(`items.${item.id}.initials`)}
                </div>
                <CardContent className="bg-card flex flex-1 items-center justify-between truncate p-0">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                    <a
                      href={item.href}
                      className="text-foreground hover:text-muted-foreground font-medium"
                    >
                      {t(`items.${item.id}.name`)}
                    </a>
                    <p className="text-muted-foreground text-pretty">
                      {item.books} {t("booksSuffix")}
                    </p>
                  </div>
                  <div className="shrink-0 pr-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <span className="sr-only">{t("openOptions")}</span>
                          <MoreVertical className="h-5 w-5" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("actions.view")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("actions.edit")}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{t("actions.share")}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive">
                          {t("actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
