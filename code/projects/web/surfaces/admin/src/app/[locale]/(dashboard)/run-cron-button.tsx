"use client";

/**
 * Render the "Run now" button that runs one cron tick on demand.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/run-cron-button.md
 */

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { useRouter } from "@/i18n/routing";
import { runCronNow } from "./monitoring-actions";

/** Runs the four passes now (same code as the hourly trigger), then refreshes the page so the
 *  new run appears in the table. */
export function RunCronButton() {
  const t = useTranslations("admin.cron");
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = () =>
    start(async () => {
      const r = await runCronNow();
      if (r.ok) {
        if (r.status === "ok") toast.success(t("runDone"));
        else toast.error(t("runFailed"));
        router.refresh();
      } else toast.error(t(`runErrors.${r.error}`));
    });
  return (
    <Button size="sm" onClick={run} disabled={pending}>
      {pending ? t("running") : t("runNow")}
    </Button>
  );
}
