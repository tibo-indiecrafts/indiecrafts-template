"use client";

import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { Avatar, AvatarFallback } from "@/components/ui-primitives/avatar";
import { Badge } from "@/components/ui-primitives/badge";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui-primitives/table";
import { cn } from "@/lib/utils";
import { table4Groups, table04Namespace } from "./config";
import type { TableBlock, TablePerson, TableStatus } from "./schema";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-indigo-500",
];
function avatarColor(initials: string) {
  const seed = initials.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[seed % AVATAR_COLORS.length];
}

const STATUS_STYLES: Record<TableStatus, { badge: string; dot: string }> = {
  completed: {
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  "in-progress": {
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  planning: {
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  "on-hold": {
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    dot: "bg-amber-500",
  },
};

function AvatarStack({ people }: { people: TablePerson[] }) {
  return (
    <div className="flex -space-x-2">
      {people.map((person, index) => (
        <Avatar
          key={index}
          className={cn(
            "border-background size-6 border-2 text-[10px]",
            avatarColor(person.initials),
          )}
        >
          <AvatarFallback
            className={cn("font-medium text-white", avatarColor(person.initials))}
          >
            {person.initials}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

export default function Table(props: Readonly<TableBlock>) {
  const t = useTranslations(table04Namespace);
  const groups = props.groups ?? table4Groups;

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="px-(--gutter) py-16 md:py-24"
    >
      <h2 id={`${props.id}-title`} className="sr-only">
        {t(props.titleKey)}
      </h2>
      <div className="mx-auto max-w-6xl rounded-lg border">
        <UITable>
          <TableHeader>
            <TableRow>
              <TableHead className="w-48 font-medium">{t("columns.task")}</TableHead>
              <TableHead className="font-medium">{t("columns.budget")}</TableHead>
              <TableHead className="font-medium">{t("columns.deadline")}</TableHead>
              <TableHead className="font-medium">{t("columns.assigned")}</TableHead>
              <TableHead className="w-28 font-medium">{t("columns.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group, gi) => (
              <Fragment key={`${group.nameKey}-${gi}`}>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableCell colSpan={5} className="py-2 font-semibold">
                    {t(group.nameKey)}
                    <span className="text-muted-foreground ml-2 font-normal">
                      {group.items.length}
                    </span>
                  </TableCell>
                </TableRow>
                {group.items.map((item) => {
                  const styles = STATUS_STYLES[item.status];
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.task}</TableCell>
                      <TableCell>{item.budget}</TableCell>
                      <TableCell>{item.deadline}</TableCell>
                      <TableCell>
                        <AvatarStack people={item.assigned} />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("gap-1.5 rounded-full", styles.badge)}
                        >
                          <span
                            className={cn("size-1.5 rounded-full", styles.dot)}
                            aria-hidden="true"
                          />
                          {t(`status.${item.status}`)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            ))}
          </TableBody>
        </UITable>
      </div>
    </section>
  );
}
