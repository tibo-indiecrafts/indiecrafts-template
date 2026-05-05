"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Collapsible, CollapsibleContent } from "@/components/ui-primitives/collapsible";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as UITableRow,
} from "@/components/ui-primitives/table";
import { cn } from "@/lib/utils";
import { table01Namespace, table1Rows } from "./config";
import type { TableBlock, TableRow } from "./schema";

const COL_TEMPLATE = "grid grid-cols-[40px_80px_180px_110px_100px_110px]";

type Translator = ReturnType<typeof useTranslations<typeof table01Namespace>>;

function AccordionRow({
  row,
  defaultOpen,
  t,
}: {
  row: TableRow;
  defaultOpen: boolean;
  t: Translator;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasChildren = !!row.children?.length;

  return (
    <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
      <TableBody className="[&_tr:last-child]:border-b last:[&_tr:last-child]:border-0">
        <UITableRow
          className={cn(
            COL_TEMPLATE,
            "bg-muted/50 hover:bg-muted/50",
            isOpen && "border-b-0",
          )}
        >
          <TableCell className="p-0">
            <Button
              aria-label={isOpen ? t("collapseLabel") : t("expandLabel")}
              className={cn(
                "text-muted-foreground h-full w-full rounded-none p-3 transition-colors",
                hasChildren && "hover:text-foreground hover:bg-transparent",
                !hasChildren && "cursor-default opacity-30",
              )}
              disabled={!hasChildren}
              onClick={() => setIsOpen((open) => !open)}
              size="icon"
              variant="ghost"
            >
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown className="size-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="size-4 transition-transform duration-200" />
                )
              ) : (
                <div className="size-4" />
              )}
            </Button>
          </TableCell>
          <TableCell className="text-muted-foreground p-3 font-mono text-sm font-medium">
            {row.id}
          </TableCell>
          <TableCell className="p-3 text-sm font-medium">{row.name}</TableCell>
          <TableCell className="text-muted-foreground p-3 text-sm">
            {row.category}
          </TableCell>
          <TableCell className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
            ${row.value.toLocaleString()}
          </TableCell>
          <TableCell className="text-muted-foreground p-3 text-sm">{row.date}</TableCell>
        </UITableRow>

        {hasChildren ? (
          <UITableRow className={cn(COL_TEMPLATE, "border-b-0 hover:bg-transparent")}>
            <TableCell className="col-span-6 p-0" colSpan={6}>
              <CollapsibleContent>
                <div className="border-border bg-muted/20 w-full border-b">
                  <UITable>
                    <TableHeader>
                      <UITableRow className={cn(COL_TEMPLATE, "bg-muted/30 border-b-0")}>
                        <TableHead className="border-border flex h-7 items-center border-y px-3 py-1.5" />
                        <TableHead className="border-border flex h-7 items-center border-y px-3 py-1.5 text-xs">
                          {t("columns.id")}
                        </TableHead>
                        <TableHead className="border-border flex h-7 items-center border-y px-3 py-1.5 text-xs">
                          {t("columns.name")}
                        </TableHead>
                        <TableHead className="border-border flex h-7 items-center border-y px-3 py-1.5 text-xs">
                          {t("columns.category")}
                        </TableHead>
                        <TableHead className="border-border flex h-7 items-center justify-end border-y px-3 py-1.5 text-right text-xs">
                          {t("columns.value")}
                        </TableHead>
                        <TableHead className="border-border flex h-7 items-center border-y px-3 py-1.5 text-xs">
                          {t("columns.date")}
                        </TableHead>
                      </UITableRow>
                    </TableHeader>
                    <TableBody>
                      {row.children?.map((childRow) => (
                        <UITableRow className={COL_TEMPLATE} key={childRow.id}>
                          <TableCell className="px-3 py-2" />
                          <TableCell className="text-muted-foreground px-3 py-2 font-mono text-xs tabular-nums">
                            {childRow.id}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-xs font-medium">
                            {childRow.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground px-3 py-2 text-xs">
                            {childRow.category}
                          </TableCell>
                          <TableCell className="px-3 py-2 text-right font-mono text-xs font-semibold tabular-nums">
                            ${childRow.value.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground px-3 py-2 text-xs">
                            {childRow.date}
                          </TableCell>
                        </UITableRow>
                      ))}
                    </TableBody>
                  </UITable>
                </div>
              </CollapsibleContent>
            </TableCell>
          </UITableRow>
        ) : null}
      </TableBody>
    </Collapsible>
  );
}

/**
 * Collapsible grouped table — sourced from `@blocks-so/table-01`,
 * refactored to fit the project's section pattern: localized labels,
 * caller-driven data via `rows`, accessibility primitives swapped in
 * (`aria-label` from i18n; primitives from `@/components/ui-primitives/`).
 */
export default function Table(props: Readonly<TableBlock>) {
  const t = useTranslations(table01Namespace);
  const rows = props.rows ?? table1Rows;
  const openIndex = props.defaultOpenIndex ?? 0;

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="px-(--gutter) py-16 md:py-24"
    >
      <h2 id={`${props.id}-title`} className="sr-only">
        {t(props.titleKey)}
      </h2>
      <div className="border-border bg-card mx-auto max-w-fit overflow-hidden rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <UITable>
            <TableHeader>
              <UITableRow className={cn(COL_TEMPLATE, "bg-muted/50")}>
                <TableHead className="p-3" />
                <TableHead className="text-foreground p-3 text-sm font-semibold">
                  {t("columns.id")}
                </TableHead>
                <TableHead className="text-foreground p-3 text-sm font-semibold">
                  {t("columns.name")}
                </TableHead>
                <TableHead className="text-foreground p-3 text-sm font-semibold">
                  {t("columns.category")}
                </TableHead>
                <TableHead className="text-foreground p-3 text-right text-sm font-semibold">
                  {t("columns.value")}
                </TableHead>
                <TableHead className="text-foreground p-3 text-sm font-semibold">
                  {t("columns.date")}
                </TableHead>
              </UITableRow>
            </TableHeader>
            {rows.map((row, index) => (
              <AccordionRow
                defaultOpen={index === openIndex}
                key={row.id}
                row={row}
                t={t}
              />
            ))}
          </UITable>
        </div>
      </div>
    </section>
  );
}
