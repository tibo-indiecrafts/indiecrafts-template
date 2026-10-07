"use client";

/**
 * Render the header sign-in link, or Clerk's auth menu when Clerk is loaded.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/AuthMenu.md
 */

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import type { Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import { useClerkActive } from "@indiecrafts/packages-web-auth/clerk-active";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { LazyClerkAuthMenu } from "@/user-interface/account/LazyClerk";

/**
 * Header auth affordance. Clerk loads only for a signed-in visitor (and on the sign-in /
 * sign-up pages), so a signed-out visitor gets a plain link to the sign-in page that
 * returns them here. It is a full page load (`<a>`, not the routing `Link`): the locale
 * layout then renders with Clerk. Once Clerk is loaded, `ClerkAuthMenu` takes over. With
 * no Clerk key, auth is off and nothing renders.
 */
export function AuthMenu() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const clerkActive = useClerkActive();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  if (clerkActive) return <LazyClerkAuthMenu />;
  const href = `${localizedPathname("/sign-in", locale)}?redirect_url=${encodeURIComponent(pathname)}`;
  return (
    <Button asChild variant="ghost" size="sm">
      <a href={href}>{t("signIn")}</a>
    </Button>
  );
}
