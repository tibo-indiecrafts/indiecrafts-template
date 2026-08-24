import { getTranslations } from "next-intl/server";

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

/** Read-only GDPR data-subject-request feed (from the EU D1, via the shared api). */
export async function DataRequestsTable({ rows }: { rows: DataRequestRow[] }) {
  const t = await getTranslations("admin.dataRequests");
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-muted-foreground">
          <tr>
            <th className="py-2 pr-4 font-medium">{t("when")}</th>
            <th className="py-2 pr-4 font-medium">{t("type")}</th>
            <th className="py-2 pr-4 font-medium">{t("email")}</th>
            <th className="py-2 pr-4 font-medium">{t("status")}</th>
            <th className="py-2 pr-4 font-medium">{t("message")}</th>
            <th className="py-2 font-medium">{t("localeSource")}</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-border">
              <td className="py-2 pr-4 tabular-nums">
                {new Date(row.submitted_at).toLocaleString()}
              </td>
              <td className="py-2 pr-4">{row.request_type}</td>
              <td className="py-2 pr-4">{row.email}</td>
              <td className="py-2 pr-4">{row.status}</td>
              <td className="py-2 pr-4 text-muted-foreground">
                {excerpt(row.message)}
              </td>
              <td className="py-2">
                {[row.locale, row.source].filter(Boolean).join(" · ") || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
