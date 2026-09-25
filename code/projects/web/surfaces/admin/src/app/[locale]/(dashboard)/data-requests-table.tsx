/**
 * Render the GDPR data-request rows as an admin table.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/data-requests-table.md
 */
import { getTranslations } from "next-intl/server";
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@indiecrafts/packages-web-ui/web/table";

export type DataRequestRow = {
  id: number;
  request_type: string;
  email: string;
  message: string | null;
  status: string;
  submitted_at: string;
  source: string | null;
  locale: string | null;
};

// Table-cell excerpt, not a data-retention cap — the row's `message` can be up to
// 4000 chars (see the api's `data_requests` schema); never render it raw here.
const MESSAGE_EXCERPT = 80;

function excerpt(message: string | null): string {
  if (!message) return "—";
  return message.length > MESSAGE_EXCERPT
    ? `${message.slice(0, MESSAGE_EXCERPT)}…`
    : message;
}

// `status` is one of `new | in-progress | done` (see the api's `data_requests`
// schema) — done is settled (outline), in-progress is active (secondary), new
// defaults to the attention-grabbing variant.
function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "done") return "outline";
  if (status === "in-progress") return "secondary";
  return "default";
}

/** Read-only GDPR data-subject-request feed (from the EU D1, via the shared api). */
export async function DataRequestsTable({ rows }: { rows: DataRequestRow[] }) {
  const t = await getTranslations("admin.dataRequests");
  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("when")}</TableHead>
            <TableHead>{t("type")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("message")}</TableHead>
            <TableHead>{t("localeSource")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tabular-nums">
                {new Date(row.submitted_at).toLocaleString()}
              </TableCell>
              <TableCell>{row.request_type}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {excerpt(row.message)}
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
