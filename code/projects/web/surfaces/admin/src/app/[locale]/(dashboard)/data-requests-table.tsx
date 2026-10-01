/**
 * Render the GDPR data-request rows as an admin table.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/data-requests-table.md
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
import { Link } from "@/i18n/routing";
import { isOverdue, type DataRequestRow } from "@/lib/monitoring";

// Table-cell excerpt, not a data-retention cap — the row's `message` can be up to
// 4000 chars (see the api's `data_requests` schema). A longer one opens in place.
const MESSAGE_EXCERPT = 80;

export const TYPES = new Set([
  "access",
  "rectification",
  "erasure",
  "restriction",
  "portability",
  "objection",
  "withdraw-consent",
]);
export const STATUSES = new Set(["new", "in-progress", "done", "rejected"]);

// done / rejected are settled (outline), in-progress is active (secondary), new defaults to the
// attention-grabbing variant. Each badge also carries its word — never color alone.
export function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "done" || status === "rejected") return "outline";
  if (status === "in-progress") return "secondary";
  return "default";
}

function Message({ message }: { message: string | null }) {
  if (!message) return <>—</>;
  if (message.length <= MESSAGE_EXCERPT) return <>{message}</>;
  return (
    <details>
      <summary className="cursor-pointer">{`${message.slice(0, MESSAGE_EXCERPT)}…`}</summary>
      <p className="text-foreground mt-2 max-w-prose whitespace-pre-wrap">{message}</p>
    </details>
  );
}

/** GDPR data-subject-request feed (from the EU D1, via the shared api). The right opens the
 *  request's side sheet (`?id=`). An unknown type or status (a newer api) shows its raw key
 *  rather than breaking. */
export function DataRequestsTable({ rows }: { rows: DataRequestRow[] }) {
  const t = useTranslations("admin.dataRequests");
  const format = useFormatter();
  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("when")}</TableHead>
            <TableHead>{t("type")}</TableHead>
            <TableHead>{t("due")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("message")}</TableHead>
            <TableHead>{t("localeSource")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="align-top">
              <TableCell className="tabular-nums">
                {format.dateTime(new Date(row.submitted_at), {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell>
                <Link
                  href={`/data-requests?id=${row.id}`}
                  className="font-medium underline underline-offset-2"
                >
                  {TYPES.has(row.request_type)
                    ? t(`types.${row.request_type}`)
                    : row.request_type}
                  <span className="sr-only"> — {t("open", { id: row.id })}</span>
                </Link>
              </TableCell>
              <TableCell className="tabular-nums">
                <span className="flex flex-wrap items-center gap-2">
                  {format.dateTime(new Date(row.due_at), { dateStyle: "medium" })}
                  {isOverdue(row) ? (
                    <Badge variant="destructive">{t("overdue")}</Badge>
                  ) : null}
                </span>
              </TableCell>
              <TableCell>
                <a href={`mailto:${row.email}`} className="underline underline-offset-2">
                  {row.email}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(row.status)}>
                  {STATUSES.has(row.status) ? t(`statuses.${row.status}`) : row.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-normal">
                <Message message={row.message} />
              </TableCell>
              <TableCell>
                {[row.locale, row.source].filter(Boolean).join(" · ") || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
