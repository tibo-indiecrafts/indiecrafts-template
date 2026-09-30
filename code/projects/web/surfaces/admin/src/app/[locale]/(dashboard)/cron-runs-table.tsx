"use client";

/**
 * Render the cron health summary, live erasure/export counts, and the recent-runs table.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/cron-runs-table.md
 */

import { useTranslations } from "next-intl";
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@indiecrafts/packages-web-ui/web/table";
import {
  cronHealth,
  healthVariant,
  type CronStatus,
  type PassResult,
} from "@/lib/monitoring";

const passVariant = (p: PassResult) =>
  p.status === "failed"
    ? ("destructive" as const)
    : p.status === "skipped"
      ? ("secondary" as const)
      : ("outline" as const);

/** A count that should be zero: shown as a destructive badge when it isn't. */
function Alarm({ value }: { value: number }) {
  return value > 0 ? (
    <Badge variant="destructive" className="tabular-nums">
      {value}
    </Badge>
  ) : (
    <span className="text-foreground tabular-nums">{value}</span>
  );
}

/** Read-only cron monitoring: health, live counts, then the last 24 runs (newest first). */
export function CronRunsTable({ status }: { status: CronStatus | null }) {
  const t = useTranslations("admin.cron");
  const health = cronHealth(status);

  return (
    <div className="mt-6 flex flex-col gap-6">
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-muted-foreground text-sm">{t("healthLabel")}</dt>
          <dd>
            <Badge variant={healthVariant(health)}>{t(`health.${health}`)}</Badge>
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">{t("lastRun")}</dt>
          <dd className="text-foreground tabular-nums">
            {status?.lastRunAt ? new Date(status.lastRunAt).toLocaleString() : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">{t("erasureOpen")}</dt>
          <dd className="text-foreground tabular-nums">
            {status?.erasure.open ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">{t("erasureDueSoon")}</dt>
          <dd className="text-foreground tabular-nums">
            {status?.erasure.dueSoon ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">{t("erasureBreached")}</dt>
          <dd>{status ? <Alarm value={status.erasure.breached} /> : "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">{t("exportsOutstanding")}</dt>
          <dd className="text-foreground tabular-nums">
            {status?.exports.outstanding ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-sm">{t("exportsUnswept")}</dt>
          <dd>{status ? <Alarm value={status.exports.expiredUnswept} /> : "—"}</dd>
        </div>
      </dl>

      <h3 className="text-foreground font-semibold">{t("runs")}</h3>
      {!status || status.runs.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("started")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("passes")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status.runs.map((run) => (
              <TableRow key={run.startedAt}>
                <TableCell className="align-top tabular-nums">
                  {new Date(run.startedAt).toLocaleString()}
                </TableCell>
                <TableCell className="align-top">
                  <Badge
                    variant={run.status === "failed" ? "destructive" : "outline"}
                  >
                    {t(`runStatus.${run.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ul className="flex flex-col gap-1">
                    {run.passes.map((p) => (
                      <li key={p.name} className="flex flex-wrap items-center gap-2">
                        <Badge variant={passVariant(p)}>
                          {t(`pass.${p.name}`)} · {t(`passStatus.${p.status}`)}
                        </Badge>
                        <span className="text-muted-foreground text-xs tabular-nums">
                          {p.error ??
                            p.reason ??
                            Object.entries(p.counts)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
