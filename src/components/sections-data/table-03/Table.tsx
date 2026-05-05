"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui-primitives/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui-primitives/table";
import { table03Namespace, table3Products } from "./config";
import type { TableBlock, TableStatus } from "./schema";

const STATUS_CLASSES: Record<TableStatus, string> = {
  active:
    "border-0 bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20",
  pending:
    "border-0 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20",
  discontinued:
    "border-0 bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20",
  "on-hold":
    "border-0 bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20",
};

/**
 * Product inventory table — sourced from `@blocks-so/table-03`,
 * refactored to fit the section pattern: localized labels, caller-driven
 * `products`, primitives swapped to `@/components/ui-primitives/`.
 * Category filter derives from the products at render time.
 */
export default function Table(props: Readonly<TableBlock>) {
  const t = useTranslations(table03Namespace);
  const products = props.products ?? table3Products;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered = products.filter(
    (p) => selectedCategory === "all" || p.category === selectedCategory,
  );
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="px-(--gutter) py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3
              id={`${props.id}-title`}
              className="text-foreground text-lg font-semibold text-balance"
            >
              {t(props.titleKey)}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm text-pretty">
              {t(props.descriptionKey)}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t("filterPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-lg border">
          <UITable>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="h-12 px-4 font-medium">
                  {t("columns.sku")}
                </TableHead>
                <TableHead className="h-12 px-4 font-medium">
                  {t("columns.productName")}
                </TableHead>
                <TableHead className="h-12 px-4 font-medium">
                  {t("columns.category")}
                </TableHead>
                <TableHead className="h-12 px-4 font-medium">
                  {t("columns.status")}
                </TableHead>
                <TableHead className="h-12 px-4 text-right font-medium">
                  {t("columns.unitPrice")}
                </TableHead>
                <TableHead className="h-12 px-4 text-right font-medium">
                  {t("columns.lastRestocked")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <TableRow key={item.sku} className="hover:bg-muted/50">
                    <TableCell className="h-14 px-4 font-mono text-sm font-medium tabular-nums">
                      {item.sku}
                    </TableCell>
                    <TableCell className="h-14 px-4 font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell className="text-muted-foreground h-14 px-4 text-sm">
                      {item.category}
                    </TableCell>
                    <TableCell className="h-14 px-4">
                      <Badge variant="outline" className={STATUS_CLASSES[item.status]}>
                        {t(`status.${item.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="h-14 px-4 text-right font-mono text-sm font-semibold tabular-nums">
                      {item.unitPrice}
                    </TableCell>
                    <TableCell className="text-muted-foreground h-14 px-4 text-right text-sm">
                      {item.lastRestocked}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground h-24 text-center"
                  >
                    {t("emptyState")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </UITable>
        </div>
      </div>
    </section>
  );
}
