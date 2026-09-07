import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@indiecrafts/packages-shared-auth";
import { redirect } from "@/i18n/routing";
import { AppShell } from "@/user-interface/layout/AppShell";

/**
 * Data-layer admin gate — defense-in-depth beyond the middleware (which is coarse
 * routing and bypassable; Next.js CVE-2025-29927). Every route in this group is
 * admin-only, and the gate FAILS CLOSED: an unconfigured Clerk (no publishable key)
 * redirects to sign-in rather than rendering the admin open — so a deploy that forgot
 * to configure Clerk is locked, not exposed. Configure Clerk before shipping admin.
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Fail closed when Clerk isn't configured — never render admin without an auth check.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
    redirect({ href: "/sign-in", locale });
  const { sessionClaims } = await auth();
  if (!isAdmin(sessionClaims)) redirect({ href: "/sign-in", locale });
  return <AppShell>{children}</AppShell>;
}
