/**
 * Show cron health, live erasure/export counts, and the recent scheduled runs.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/cron/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { fetchCronStatus } from "@/lib/monitoring";
import { CronRunsTable } from "../cron-runs-table";

/** Read-only: `GET /v1/cron/status` via the server-side token — display only, no control. */
export default async function CronPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.cron");
  const status = await fetchCronStatus();

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card>
        <CardContent>
          <CronRunsTable status={status} />
        </CardContent>
      </Card>
    </div>
  );
}
