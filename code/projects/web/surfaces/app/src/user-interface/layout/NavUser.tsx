"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@indiecrafts/packages-web-ui/web/sidebar";
import { AccountControl } from "@/user-interface/account/AccountControl";

// Public key, safe to read client-side — mirrors the gate in [locale]/layout.tsx (SessionLogger).
const CLERK_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

/**
 * Sidebar footer menu. When Clerk is configured, the unified account modal trigger
 * (Clerk avatar → Manage account + Sign out) — account management and sign-out now live
 * inside that modal, so the old hand-rolled sign-out item is gone. Legal stays as its own
 * item (the only path to `/legal`). With no Clerk key the footer is just the Legal link.
 */
export function NavUser() {
  const t = useTranslations("app");

  return (
    <SidebarMenu>
      {CLERK_CONFIGURED ? (
        <SidebarMenuItem>
          <AccountControl variant="button" />
        </SidebarMenuItem>
      ) : null}
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/legal">{t("user.legal")}</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
