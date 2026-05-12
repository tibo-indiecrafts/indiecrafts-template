"use client";

import { Box, Edit } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import { Card, CardContent } from "@/components/ui-primitives/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui-primitives/dialog";
import { Field, FieldLabel } from "@/components/ui-primitives/field";
import { Input } from "@/components/ui-primitives/input";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { stats11Namespace, stats11Sample } from "./config";
import type { StatsBlock } from "./schema";

type MetricCardProps = {
  title: string;
  value: string;
  limit: string;
  percentage: number;
  status?: string;
  statusColor?: string;
  progressColor?: string;
  details?: { label: string; value: string; color: string }[];
  actionLabel: string;
  actionIcon: ReactNode;
  warningMessage?: string;
  onActionClick?: () => void;
  isCommands?: boolean;
  separator: string;
};

function MetricCard({
  title,
  value,
  limit,
  percentage,
  status,
  statusColor = "text-emerald-600 dark:text-emerald-400",
  progressColor,
  details,
  actionLabel,
  actionIcon,
  warningMessage,
  onActionClick,
  isCommands,
  separator,
}: MetricCardProps) {
  const renderProgressBar = () => {
    if (details && isCommands) {
      const writes = Number.parseInt(details[0].value.replace(/,/g, ""));
      const reads = Number.parseInt(details[1].value.replace(/,/g, ""));
      const total = writes + reads;
      const writesPct = total > 0 ? (writes / total) * 100 : 0;
      const readsPct = total > 0 ? (reads / total) * 100 : 0;

      return (
        <div className="bg-muted relative h-1 w-full overflow-hidden rounded-full">
          <div
            className="absolute left-0 h-full w-full origin-left bg-emerald-500 transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${writesPct / 100})` }}
          />
          <div
            className="absolute left-0 h-full w-full origin-left bg-blue-500 transition-transform duration-200 ease-out"
            style={{
              transform: `translateX(${writesPct}%) scaleX(${readsPct / 100})`,
            }}
          />
        </div>
      );
    }

    return (
      <div className="bg-muted relative h-1 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full w-full origin-left transition-transform duration-200 ease-out",
            progressColor,
          )}
          style={{
            transform: `scaleX(${Math.min(percentage, 100) / 100})`,
          }}
        />
      </div>
    );
  };

  return (
    <Card className="relative max-w-[280px] overflow-hidden shadow-2xs">
      <CardContent className="p-4 py-0">
        <h5 className="text-muted-foreground dark:text-foreground/80 text-xs leading-none font-normal tracking-wide uppercase">
          {title}
        </h5>

        <div className="mt-2 flex items-baseline gap-1">
          <div className="text-foreground text-[1.2rem] leading-none font-medium tabular-nums">
            {value}
          </div>
          <div className="text-muted-foreground text-xs leading-none">
            {separator} {limit}
          </div>
        </div>

        <div className="mt-3">
          {renderProgressBar()}

          {details && (
            <div className="my-6 mb-8">
              <div className="flex flex-col gap-3">
                {details.map((detail, index) => (
                  <div
                    key={index}
                    className="text-muted-foreground dark:text-foreground/70 flex w-full items-center text-xs leading-none"
                  >
                    <div className={cn("mr-[6px] h-2 w-2 rounded-full", detail.color)} />
                    <div className="mr-1">{detail.label}</div>
                    <div className="border-border h-[9px] flex-1 border-b-2 border-dotted" />
                    <div className="ml-1 tabular-nums">{detail.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status && (
            <div className="pt-2">
              <div className={statusColor}>{status}</div>
            </div>
          )}

          {warningMessage && (
            <div className="pt-2">
              <div className="text-sm text-amber-700 dark:text-amber-400">
                {warningMessage}
              </div>
            </div>
          )}
        </div>

        <div className="absolute right-0 bottom-0 left-0">
          <Button
            type="button"
            variant="ghost"
            className="bg-muted/50 h-8 w-full justify-start gap-0 rounded-none text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={onActionClick}
          >
            {actionIcon}
            <span className="ml-1 text-xs">{actionLabel}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type BudgetDialogProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialBudget: string;
};

function BudgetDialog({ id, open, onOpenChange, initialBudget }: BudgetDialogProps) {
  const [t] = useScopedT(stats11Namespace);
  const [budget, setBudget] = useState(initialBudget);
  const fieldId = `${id}-budget`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>

        <Field className="gap-2">
          <FieldLabel htmlFor={fieldId}>{t("dialogFieldLabel")}</FieldLabel>
          <Input
            id={fieldId}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            type="number"
            placeholder={t("dialogPlaceholder")}
          />
        </Field>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {t("update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Stats(props: Readonly<StatsBlock>) {
  const [t, tr] = useScopedT(stats11Namespace);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const titleId = `${props.id}-title`;
  const sample = stats11Sample;
  const separator = t("limitSeparator");

  const commandsValue = props.commandsValue ?? sample.commandsValue!;
  const commandsPct = props.commandsPercentage ?? sample.commandsPercentage!;
  const writes = props.commandsWrites ?? sample.commandsWrites!;
  const reads = props.commandsReads ?? sample.commandsReads!;
  const bandwidthValue = props.bandwidthValue ?? sample.bandwidthValue!;
  const bandwidthLimit = props.bandwidthLimit ?? sample.bandwidthLimit!;
  const bandwidthPct = props.bandwidthPercentage ?? sample.bandwidthPercentage!;
  const storageValue = props.storageValue ?? sample.storageValue!;
  const storageLimit = props.storageLimit ?? sample.storageLimit!;
  const storagePct = props.storagePercentage ?? sample.storagePercentage!;
  const costValue = props.costValue ?? sample.costValue!;
  const costPct = props.costPercentage ?? sample.costPercentage!;
  const initialBudget = props.initialBudget ?? sample.initialBudget!;

  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className="sr-only">
        {tr(props.titleKey, "title")}
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t("commands")}
          value={commandsValue}
          limit={t("unlimited")}
          percentage={commandsPct}
          progressColor="bg-blue-500"
          details={[
            { label: t("writes"), value: writes, color: "bg-emerald-500" },
            { label: t("reads"), value: reads, color: "bg-blue-500" },
          ]}
          actionLabel={t("upgrade")}
          actionIcon={<Box className="h-4 w-4" aria-hidden="true" />}
          isCommands
          separator={separator}
        />

        <MetricCard
          title={t("bandwidth")}
          value={bandwidthValue}
          limit={bandwidthLimit}
          percentage={bandwidthPct}
          progressColor="bg-orange-500"
          warningMessage={t("warning")}
          actionLabel={t("upgrade")}
          actionIcon={<Box className="h-4 w-4" aria-hidden="true" />}
          separator={separator}
        />

        <MetricCard
          title={t("storage")}
          value={storageValue}
          limit={storageLimit}
          percentage={storagePct}
          progressColor="bg-emerald-500"
          status={t("okStatus")}
          actionLabel={t("upgrade")}
          actionIcon={<Box className="h-4 w-4" aria-hidden="true" />}
          separator={separator}
        />

        <MetricCard
          title={t("cost")}
          value={costValue}
          limit={t("budgetLimit")}
          percentage={costPct}
          progressColor="bg-emerald-500"
          status={t("okStatus")}
          actionLabel={t("changeBudget")}
          actionIcon={<Edit className="h-4 w-4" aria-hidden="true" />}
          onActionClick={() => setBudgetDialogOpen(true)}
          separator={separator}
        />
      </div>

      <BudgetDialog
        id={props.id}
        open={budgetDialogOpen}
        onOpenChange={setBudgetDialogOpen}
        initialBudget={initialBudget}
      />
    </section>
  );
}
