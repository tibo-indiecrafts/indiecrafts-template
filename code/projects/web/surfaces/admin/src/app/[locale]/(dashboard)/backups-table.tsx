"use client";

import { useTranslations } from "next-intl";

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

function formatBytes(bytes: number | null): string {
  if (bytes == null) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

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
  const runs = [...status.runs].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  return (
    <div className="mt-8 flex flex-col gap-6">
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">{t("started")}</th>
                <th className="py-2 pr-4 font-medium">{t("finished")}</th>
                <th className="py-2 pr-4 font-medium">{t("db")}</th>
                <th className="py-2 pr-4 font-medium">{t("env")}</th>
                <th className="py-2 pr-4 font-medium">{t("kind")}</th>
                <th className="py-2 pr-4 font-medium">{t("status")}</th>
                <th className="py-2 pr-4 font-medium">{t("size")}</th>
                <th className="py-2 font-medium">{t("error")}</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {runs.map((run, i) => {
                const flagged = run.status === "failed" || run.finishedAt == null;
                return (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2 pr-4 tabular-nums">
                      {new Date(run.startedAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 tabular-nums">
                      {run.finishedAt
                        ? new Date(run.finishedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="py-2 pr-4">{run.dbName}</td>
                    <td className="py-2 pr-4">{run.env}</td>
                    <td className="py-2 pr-4">{run.kind}</td>
                    <td className="py-2 pr-4">
                      {flagged ? (
                        <span className="inline-flex items-center gap-1 text-destructive">
                          <FlagIcon />
                          {run.status === "failed" ? t("failedFlag") : t("stuckFlag")}
                        </span>
                      ) : (
                        run.status
                      )}
                    </td>
                    <td className="py-2 pr-4 tabular-nums">{formatBytes(run.bytes)}</td>
                    <td className="py-2 text-muted-foreground">{run.error ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
