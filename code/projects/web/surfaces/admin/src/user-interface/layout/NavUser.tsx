"use client";

/**
 * Render the sidebar footer user menu with sign-out.
 *
 * @see docs/reference/projects/web/admin/src/user-interface/layout/NavUser.md
 */
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@clerk/nextjs";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@indiecrafts/packages-web-ui/web/dropdown-menu";
import { Avatar, AvatarFallback } from "@indiecrafts/packages-web-ui/web/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@indiecrafts/packages-web-ui/web/sidebar";

// Public key, safe to read client-side — mirrors the gate in [locale]/layout.tsx (SessionLogger).
const CLERK_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function NavUserButton({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" aria-label={label}>
              <Avatar size="sm">
                <AvatarFallback>
                  <UserRound className="size-4" aria-hidden="true" />
                </AvatarFallback>
              </Avatar>
              <span>{label}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {children ? (
            <DropdownMenuContent align="end" className="min-w-40">
              {children}
            </DropdownMenuContent>
          ) : null}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/** Rendered only when Clerk is configured — safe to call `useAuth()` (a `ClerkProvider` wraps the tree). */
function ClerkNavUser({ label, signOutLabel }: { label: string; signOutLabel: string }) {
  const { signOut } = useAuth();
  return (
    <NavUserButton label={label}>
      <DropdownMenuItem onClick={() => void signOut()}>{signOutLabel}</DropdownMenuItem>
    </NavUserButton>
  );
}

/** Sidebar footer user menu. Gated on `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — unconfigured, it's a
 *  static label with no sign-out (there's no session to end). */
export function NavUser() {
  const t = useTranslations("admin");
  const label = t("user.account");
  if (CLERK_CONFIGURED) return <ClerkNavUser label={label} signOutLabel={t("user.signOut")} />;
  return <NavUserButton label={label} />;
}
