/**
 * Gate every dashboard route behind an admin session, failing closed.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/layout.md
 */
import type { ReactNode } from "react";
import { requireAdminPage } from "@/lib/require-admin";
import { AppShell } from "@/user-interface/layout/AppShell";

/**
 * Admin gate for the shell — defense-in-depth beyond the middleware (coarse routing,
 * bypassable; Next.js CVE-2025-29927). Fails closed (see `requireAdminPage`). Next skips
 * this layout on a client navigation, so every page ALSO calls `requireAdminPage` before
 * it reads data. Configure Clerk before shipping admin.
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdminPage(locale);
  return <AppShell>{children}</AppShell>;
}
