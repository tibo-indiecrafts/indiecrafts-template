/**
 * Render the sticky app header with the sidebar and locale/theme toggles.
 *
 * @see docs/reference/projects/web/app/src/user-interface/layout/AppHeader.md
 */
import { getTranslations } from "next-intl/server";
import { SidebarTrigger } from "@indiecrafts/packages-web-ui/web/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

/** Sticky app header: sidebar toggle, then locale + theme toggles pushed right. */
export async function AppHeader() {
  const t = await getTranslations("app");

  // `box-content` + the top inset: in the iOS shell (viewport-fit=cover) the bar's 56px sit
  // below the status bar, not under it. The inset is 0 in a browser.
  return (
    <header className="bg-background sticky top-0 z-10 box-content flex h-14 items-center gap-2 border-b px-4 pt-[env(safe-area-inset-top)]">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-1">
        <LocaleSwitcher label={t("locale.label")} />
        <ThemeToggle
          label={{ toggle: t("theme.toggle"), light: t("theme.light"), dark: t("theme.dark") }}
        />
      </div>
    </header>
  );
}
