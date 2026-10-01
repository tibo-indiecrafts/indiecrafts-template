"use client";

/**
 * Render the backup bucket summary and recent-runs table with a failure flag.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/backups-table.md
 */

import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@indiecrafts/packages-web-ui/web/table";

/** One row of `GET /v1/backups/status` `runs` — mirrors the api's response shape
 *  (see `code/shared/api/src/index.ts` `/v1/backups/status`). */
export type BackupRun = {
  dbName: string;
  env: string;
  kind: string;
  status: string;
  bytes: number | null;
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
};

export type BackupsStatus = {
  bucket: string | null;
  retentionDays: number;
  preMigrationSnapshots: boolean;
  runs: BackupRun[];
};

const UNITS = ["byte", "kilobyte", "megabyte", "gigabyte"] as const;

/** Scale bytes to the largest 1024-step unit; the formatter names the unit per locale
 *  ("1.5 kB" in en, "1,5 ko" in fr). */
function scaleBytes(bytes: number): { value: number; unit: (typeof UNITS)[number] } {
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < UNITS.length - 1) {
    value /= 1024;
    i++;
  }
  return { value, unit: UNITS[i] };
}

// The zone (UTC) comes from the next-intl config, so server and browser renders match.
const WHEN = { dateStyle: "medium", timeStyle: "short" } as const;

/** Warning glyph for the failed/stuck flag — always paired with a text label so the
 *  flag is never conveyed by color alone. */
function FlagIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0"
      fill="currentColor"
    >
      <path d="M8 1.5 15 14.5H1L8 1.5ZM7.25 6h1.5v4h-1.5V6Zm0 5h1.5v1.5h-1.5V11Z" />
    </svg>
  );
}

/** Read-only backup bucket/retention/pre-migration summary + the recent-runs table
 *  (newest-first). A run is flagged FAILED_OR_STUCK when `status === "failed"` or it
 *  never finished (`finishedAt == null`) — icon + text, never color alone. */
export function BackupsTable({ status }: { status: BackupsStatus }) {
  const t = useTranslations("admin.backups");
  const format = useFormatter();
  const size = (bytes: number | null) => {
    if (bytes == null) return "—";
    const { value, unit } = scaleBytes(bytes);
    return format.number(value, { style: "unit", unit, maximumFractionDigits: 1 });
  };
  const runs = [...status.runs].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  return (
    <div className="mt-6 flex flex-col gap-6">
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted-foreground">{t("bucket")}</dt>
          <dd className="text-foreground">{status.bucket ?? t("notConfigured")}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">{t("retentionDays")}</dt>
          <dd className="text-foreground tabular-nums">{status.retentionDays}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">
            {t("preMigrationSnapshots")}
          </dt>
          <dd className="text-foreground">
            {status.preMigrationSnapshots ? t("on") : t("off")}
          </dd>
        </div>
      </dl>

      {runs.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("started")}</TableHead>
              <TableHead>{t("finished")}</TableHead>
              <TableHead>{t("db")}</TableHead>
              <TableHead>{t("env")}</TableHead>
              <TableHead>{t("kind")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("size")}</TableHead>
              <TableHead>{t("error")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run, i) => {
              const flagged = run.status === "failed" || run.finishedAt == null;
              return (
                <TableRow key={i}>
                  <TableCell className="tabular-nums">
                    {format.dateTime(new Date(run.startedAt), WHEN)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {run.finishedAt
                      ? format.dateTime(new Date(run.finishedAt), WHEN)
                      : "—"}
                  </TableCell>
                  <TableCell>{run.dbName}</TableCell>
                  <TableCell>{run.env}</TableCell>
                  <TableCell>{run.kind}</TableCell>
                  <TableCell>
                    {flagged ? (
                      <Badge variant="destructive" className="gap-1">
                        <FlagIcon />
                        {run.status === "failed" ? t("failedFlag") : t("stuckFlag")}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{run.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {size(run.bytes)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {run.error ?? "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
