"use client";

/**
 * Render open GDPR erasure requests by deadline, then the recently closed ones.
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

const stateVariant = (state: ErasureRow["state"]) =>
  state === "breached"
    ? ("destructive" as const)
    : state === "dueSoon"
      ? ("secondary" as const)
      : ("outline" as const);

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—");

function Rows({ rows, empty }: { rows: ErasureRow[]; empty: string }) {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Read-only erasure monitoring: open requests (soonest deadline first) + recently closed.
 *  No identifiers — the erasure engine does the work; this view watches the deadline. */
export function ErasureTable({ data }: { data: ErasureRequests | null }) {
  const t = useTranslations("admin.erasure");
  if (!data) return <p className="text-destructive mt-6">{t("unreachable")}</p>;
  return (
    <div className="mt-6 flex flex-col gap-6">
      <h3 className="text-foreground font-semibold">{t("open")}</h3>
      <Rows rows={data.open} empty={t("empty")} />
      <h3 className="text-foreground font-semibold">{t("recentClosed")}</h3>
      <Rows rows={data.recentClosed} empty={t("emptyClosed")} />
    </div>
  );
}
