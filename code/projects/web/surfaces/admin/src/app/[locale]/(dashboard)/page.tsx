import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { AdminRoleForm } from "./admin-role-form";

export default async function AdminHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("welcome")}</p>
      <nav className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link
          href="/sessions"
          className="text-primary underline underline-offset-4"
        >
          {t("sessions.link")}
        </Link>
        <Link href="/users" className="text-primary underline underline-offset-4">
          {t("users.link")}
        </Link>
        <Link
          href="/security"
          className="text-primary underline underline-offset-4"
        >
          {t("security.link")}
        </Link>
        <Link href="/csp" className="text-primary underline underline-offset-4">
          {t("csp.link")}
        </Link>
        <Link
          href="/data-requests"
          className="text-primary underline underline-offset-4"
        >
          {t("dataRequests.link")}
        </Link>
        <Link
          href="/system"
          className="text-primary underline underline-offset-4"
        >
          {t("system.link")}
        </Link>
      </nav>
      <AdminRoleForm />
    </main>
  );
}
