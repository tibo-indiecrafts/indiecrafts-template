"use client";

/**
 * Render the sidebar footer menu: Legal, plus Sign out when Clerk is configured.
 *
 * @see docs/reference/projects/web/app/src/user-interface/layout/NavUser.md
 */
import { useTranslations } from "next-intl";
import { useAuth } from "@clerk/nextjs";
import { UserRound } from "lucide-react";
import { Link } from "@/i18n/routing";
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

/** Rendered only when Clerk is configured — safe to call `useAuth()` (a `ClerkProvider` wraps the tree). */
function SignOutItem({ label }: { label: string }) {
  const { signOut } = useAuth();
  return <DropdownMenuItem onClick={() => void signOut()}>{label}</DropdownMenuItem>;
}

/**
 * Sidebar footer menu: Legal (always) + Sign out (when Clerk is configured). The account
 * lives on the embedded `/account` page, reached from the main sidebar nav (`nav.ts`) — no
 * modal here. Clerk's `<UserProfile>` has no everyday sign-out, so the footer owns it.
 */
export function NavUser() {
  const t = useTranslations("app");
  const label = t("user.legal");

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
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem asChild>
              <Link href="/legal">{t("user.legal")}</Link>
            </DropdownMenuItem>
            {CLERK_CONFIGURED ? <SignOutItem label={t("user.signOut")} /> : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
