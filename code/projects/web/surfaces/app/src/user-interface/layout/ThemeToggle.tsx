"use client";

/**
 * Toggle light and dark theme without a flash.
 *
 * @see docs/reference/projects/web/app/src/user-interface/layout/ThemeToggle.md
 */
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@indiecrafts/packages-web-ui/web/button";

type Theme = "light" | "dark";

export type ThemeToggleLabel = { toggle: string; light: string; dark: string };

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/** Icon-only theme toggle. Reads `document.documentElement.dataset.theme` (set before paint
 *  by `THEME_SCRIPT`) via `useSyncExternalStore` — never state-in-effect. Flips the theme +
 *  persists it to `localStorage["app-theme"]`, then dispatches a `storage` event (native
 *  `storage` events don't fire in the tab that wrote the value) so the icon re-renders. */
export function ThemeToggle({ label }: { label: ThemeToggleLabel }) {
  const theme = useSyncExternalStore<Theme>(subscribe, getTheme, () => "light");

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("app-theme", next);
    window.dispatchEvent(
      new StorageEvent("storage", { key: "app-theme", newValue: next }),
    );
  };

  const Icon = theme === "dark" ? Moon : Sun;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label.toggle}
      title={label[theme]}
      onClick={toggle}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}
