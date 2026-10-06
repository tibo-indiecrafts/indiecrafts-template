/**
 * Gate the app route group behind a signed-in user.
 *
 * @see docs/reference/projects/web/app/src/app/locale/(app)/layout.md
 */
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { hasLocale } from "next-intl";
import { redirect, routing } from "@/i18n/routing";
import { AppShell } from "@/user-interface/layout/AppShell";

/**
 * Auth gate for the app — every route in the `(app)` group requires a signed-in user, and
 * renders inside the sidebar shell. Server-side enforcement (defense-in-depth beyond the
 * proxy, which is coarse routing and bypassable; Next.js CVE-2025-29927). Auth is opt-in on
 * the Clerk key: with a key set, no session → redirect to sign-in; without a key the app
 * runs as a public scaffold (no session to check). `sign-in` lives outside this group.
 */
export default async function AppGroupLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // A stray path the proxy skips (e.g. `/favicon.ico` — a dot in it) lands here with a
  // non-locale `locale`. 404 it before `auth()`, which would throw outside the proxy.
  if (!hasLocale(routing.locales, locale)) notFound();
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const { userId } = await auth();
    if (!userId) redirect({ href: "/sign-in", locale });
  }
  return <AppShell>{children}</AppShell>;
}
