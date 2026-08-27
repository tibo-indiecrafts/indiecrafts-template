import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@indiecrafts/packages-shared-auth";
import { redirect } from "@/i18n/routing";
import { AppShell } from "@/user-interface/layout/AppShell";

/**
 * Data-layer admin gate — defense-in-depth beyond the middleware (which is coarse
 * routing and bypassable; Next.js CVE-2025-29927). Every route in this group is
 * admin-only. Enforced only when Clerk is configured; the scaffold runs open
 * otherwise (configure Clerk before shipping admin).
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const { sessionClaims } = await auth();
    if (!isAdmin(sessionClaims)) redirect({ href: "/sign-in", locale });
  }
  return <AppShell>{children}</AppShell>;
}
