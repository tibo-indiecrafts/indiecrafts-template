"use client";

import {
  CheckCircle,
  FileTextIcon,
  Loader2,
  PauseIcon,
  PlayIcon,
  Trash2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui-primitives/badge";
import { Button } from "@/components/ui-primitives/button";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui-primitives/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui-primitives/tooltip";
import { logger } from "@/lib/logger";
import { table02Namespace, table2Tasks } from "./config";
import type { TableActionType, TableBlock, TableStatus, TableTask } from "./schema";

type Translator = ReturnType<typeof useTranslations<typeof table02Namespace>>;

const STATUS_CLASSES: Record<TableStatus, string> = {
  pending:
    "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20 border-0",
  "in-progress":
    "bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 border-0",
  completed:
    "bg-green-500/15 text-green-700 hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 border-0",
  blocked:
    "bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 border-0",
};

function StatusBadge({ status, t }: { status: TableStatus; t: Translator }) {
  return (
    <Badge variant="outline" className={STATUS_CLASSES[status]}>
      {t(`status.${status}`)}
    </Badge>
  );
}

function ActionButton({
  label,
  icon,
  pending,
  busy,
  onClick,
  destructive,
}: {
  label: string;
  icon: React.ReactNode;
  pending: boolean;
  busy: boolean;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={
            destructive
              ? "text-destructive hover:bg-destructive size-8 hover:text-white"
              : "size-8"
          }
          onClick={onClick}
          disabled={busy}
          aria-label={label}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Tasks table — sourced from `@blocks-so/table-02`, refactored to fit the
 * project's section pattern: status labels, column headers, and action
 * tooltips all source from `blocks.table-02.*`. The action handler is
 * caller-driven via `onAction`; the default is a logger.info no-op so
 * stories run without wiring.
 */
export default function Table(props: Readonly<TableBlock>) {
  const t = useTranslations(table02Namespace);
  const tasks = props.tasks ?? table2Tasks;
  const onAction =
    props.onAction ??
    ((task, type) => logger.info("[table-2] action", { task: task.id, type }));

  const [pendingAction, setPendingAction] = useState<{
    id: string;
    type: TableActionType;
  } | null>(null);

  const isPending = (action: TableActionType, taskId: string) =>
    pendingAction?.id === taskId && pendingAction.type === action;
  const isBusy = (taskId: string) => pendingAction?.id === taskId;

  const handleAction = (task: TableTask, type: TableActionType) => {
    setPendingAction({ id: task.id, type });
    setTimeout(() => {
      setPendingAction(null);
      onAction(task, type);
    }, 1000);
  };

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="px-(--gutter) py-16 md:py-24"
    >
      <h2 id={`${props.id}-title`} className="sr-only">
        {t(props.titleKey)}
      </h2>
      <div className="bg-card mx-auto w-[95%] rounded-lg border">
        <TooltipProvider>
          <UITable>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="h-12 px-4 font-medium">
                  {t("columns.title")}
                </TableHead>
                <TableHead className="h-12 px-4 font-medium">
                  {t("columns.assignee")}
                </TableHead>
                <TableHead className="h-12 w-[120px] px-4 font-medium">
                  {t("columns.status")}
                </TableHead>
                <TableHead className="h-12 px-4 font-medium">
                  {t("columns.dueDate")}
                </TableHead>
                <TableHead className="h-12 px-4 font-medium">
                  {t("columns.notes")}
                </TableHead>
                <TableHead className="h-12 w-[180px] px-4 font-medium">
                  {t("columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const busy = isBusy(task.id);
                return (
                  <TableRow key={task.id} className="hover:bg-muted/50">
                    <TableCell className="h-16 px-4 font-medium">{task.title}</TableCell>
                    <TableCell className="text-muted-foreground h-16 px-4 text-sm">
                      {task.assignee}
                    </TableCell>
                    <TableCell className="h-16 px-4">
                      <StatusBadge status={task.status} t={t} />
                    </TableCell>
                    <TableCell className="text-muted-foreground h-16 px-4 text-sm">
                      {task.dueDate}
                    </TableCell>
                    <TableCell className="text-muted-foreground h-16 max-w-[300px] px-4 text-sm">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block cursor-help truncate">{task.notes}</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md">{task.notes}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="h-16 px-4">
                      <div className="flex items-center gap-1">
                        {task.status === "pending" || task.status === "blocked" ? (
                          <ActionButton
                            label={t("actions.start")}
                            icon={<PlayIcon className="size-4" />}
                            pending={isPending("start", task.id)}
                            busy={busy}
                            onClick={() => handleAction(task, "start")}
                          />
                        ) : null}
                        {task.status === "in-progress" ? (
                          <>
                            <ActionButton
                              label={t("actions.pause")}
                              icon={<PauseIcon className="size-4" />}
                              pending={isPending("pause", task.id)}
                              busy={busy}
                              onClick={() => handleAction(task, "pause")}
                            />
                            <ActionButton
                              label={t("actions.complete")}
                              icon={<CheckCircle className="size-4" />}
                              pending={isPending("complete", task.id)}
                              busy={busy}
                              onClick={() => handleAction(task, "complete")}
                            />
                          </>
                        ) : null}
                        <ActionButton
                          label={t("actions.delete")}
                          icon={<Trash2Icon className="size-4" />}
                          pending={isPending("delete", task.id)}
                          busy={busy}
                          onClick={() => handleAction(task, "delete")}
                          destructive
                        />
                        <ActionButton
                          label={t("actions.view")}
                          icon={<FileTextIcon className="size-4" />}
                          pending={false}
                          busy={busy}
                          onClick={() => handleAction(task, "view")}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </UITable>
        </TooltipProvider>
      </div>
    </section>
  );
}
