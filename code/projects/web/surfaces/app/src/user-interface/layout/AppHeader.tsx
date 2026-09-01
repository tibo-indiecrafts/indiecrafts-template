import { getTranslations } from "next-intl/server";
import { SidebarTrigger } from "@indiecrafts/packages-web-ui/web/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

/** Sticky app header: sidebar toggle, then locale + theme toggles pushed right. */
export async function AppHeader() {
  const t = await getTranslations("app");

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-4">
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
