/**
 * Show open GDPR erasure requests by deadline and the recently closed ones.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/erasure/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdminPage } from "@/lib/require-admin";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { fetchErasureRequests } from "@/lib/monitoring";
import { ErasureTable } from "../erasure-table";

/** Read-only: `GET /v1/erasure-requests` via the server-side token (no identifiers returned). */
export default async function ErasurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdminPage(locale);
  setRequestLocale(locale);
  const t = await getTranslations("admin.erasure");
  const data = await fetchErasureRequests();

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card>
        <CardContent>
          <ErasureTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
