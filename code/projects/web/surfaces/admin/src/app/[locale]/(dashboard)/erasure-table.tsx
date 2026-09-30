"use client";

/**
 * Render open GDPR erasure requests by deadline with their actions, then the recently closed ones.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/erasure-table.md
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
import type { ErasureRequests, ErasureRow } from "@/lib/monitoring";
import { ErasureRowActions } from "./erasure-row-actions";

const stateVariant = (state: ErasureRow["state"]) =>
  state === "breached"
    ? ("destructive" as const)
    : state === "dueSoon"
      ? ("secondary" as const)
      : ("outline" as const);

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—");

function Rows({ rows, empty, actions }: { rows: ErasureRow[]; empty: string; actions: boolean }) {
  const t = useTranslations("admin.erasure");
  if (rows.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("id")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("requested")}</TableHead>
          <TableHead>{t("due")}</TableHead>
          <TableHead>{t("stateLabel")}</TableHead>
          <TableHead>{t("flagged")}</TableHead>
          <TableHead>{actions ? t("actionsLabel") : t("noteLabel")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="tabular-nums">{r.id}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell className="tabular-nums">{when(r.requestedAt)}</TableCell>
            <TableCell className="tabular-nums">{when(r.dueAt)}</TableCell>
            <TableCell>
              <Badge variant={stateVariant(r.state)}>{t(`state.${r.state}`)}</Badge>
            </TableCell>
            <TableCell className="tabular-nums">
              {when(r.breachFlaggedAt ?? r.dueFlaggedAt)}
            </TableCell>
            <TableCell className="max-w-xs text-sm">
              {actions ? (
                <ErasureRowActions id={r.id} status={r.status} />
              ) : (
                <span className="text-muted-foreground">{r.note ?? "—"}</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Erasure monitoring + actions: open requests (soonest deadline first) with Retry / Close
 *  manually, then recently closed ones with their manual-close note. No identifiers. */
export function ErasureTable({ data }: { data: ErasureRequests | null }) {
  const t = useTranslations("admin.erasure");
  if (!data) return <p className="text-destructive mt-6">{t("unreachable")}</p>;
  return (
    <div className="mt-6 flex flex-col gap-6">
      <h3 className="text-foreground font-semibold">{t("open")}</h3>
      <Rows rows={data.open} empty={t("empty")} actions />
      <h3 className="text-foreground font-semibold">{t("recentClosed")}</h3>
      <Rows rows={data.recentClosed} empty={t("emptyClosed")} actions={false} />
    </div>
  );
}
