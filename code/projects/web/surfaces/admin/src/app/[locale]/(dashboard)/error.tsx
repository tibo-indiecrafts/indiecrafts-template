"use client";

/**
 * Render the dashboard error boundary inside the admin shell.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/error.md
 */
import { useTranslations } from "next-intl";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { PageHeader } from "@/user-interface/layout/PageHeader";

type Props = { error: Error & { digest?: string }; reset: () => void };

/** A failed dashboard page. It renders inside `AppShell`'s `<main id="main">`, so the sidebar
 *  stays usable. It logs nothing itself: Next logs a server error (with its digest) in the
 *  Worker logs, and React reports a caught client error to the browser console. */
export default function DashboardError({ reset }: Readonly<Props>) {
  const t = useTranslations("admin.error");
  return (
    <div role="alert" className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("description")} />
      <Button type="button" onClick={reset}>
        {t("retry")}
      </Button>
    </div>
  );
}
