"use client";

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui-primitives/badge";
import { Button } from "@/components/ui-primitives/button";
import { Checkbox } from "@/components/ui-primitives/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { Input } from "@/components/ui-primitives/input";
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
import { cn } from "@/lib/utils";
import { table5Items, table05Namespace } from "./config";
import type { TableBlock, TableItem, TableStatus } from "./schema";

const STATUS_CLASSES: Record<TableStatus, string> = {
  completed:
    "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  processing: "bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  cancelled: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};

type Translator = ReturnType<typeof useTranslations<typeof table05Namespace>>;

function buildColumns(t: Translator): ColumnDef<TableItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("columns.name"),
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    { accessorKey: "date", header: t("columns.date") },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const status = row.getValue<TableStatus>("status");
        return (
          <Badge variant="outline" className={cn("border-0", STATUS_CLASSES[status])}>
            {t(`status.${status}`)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">{t("columns.amount")}</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.getValue("amount")}</div>
      ),
    },
    {
      id: "actions",
      cell: () => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">{t("openMenu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 size-4" />
                {t("actions.view")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="mr-2 size-4" />
                {t("actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                {t("actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}

export default function Table(props: Readonly<TableBlock>) {
  const t = useTranslations(table05Namespace);
  const items = props.items ?? table5Items;
  const initialPageSize = props.pageSize ?? 5;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = useMemo(() => buildColumns(t), [t]);

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack UITable API gap with React Compiler (same as DataTable)
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: { sorting, rowSelection, globalFilter },
    initialState: { pagination: { pageSize: initialPageSize } },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const start =
    table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
  const end = Math.min(
    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
    filteredCount,
  );

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="px-(--gutter) py-16 md:py-24"
    >
      <h2 id={`${props.id}-title`} className="sr-only">
        {t(props.titleKey)}
      </h2>
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t("show")}</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-sm">{t("entries")}</span>
          </div>
          <Input
            placeholder={t("searchPlaceholder")}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 w-full sm:w-64"
          />
        </div>

        <div className="rounded-lg border">
          <UITable>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t("noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </UITable>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm text-pretty">
            {t("showing", { start, end, total: filteredCount })}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label={t("previousPage")}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">{t("previousPage")}</span>
            </Button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="size-8"
                onClick={() => table.setPageIndex(page - 1)}
                aria-label={t("goToPage", { page })}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label={t("nextPage")}
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">{t("nextPage")}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
