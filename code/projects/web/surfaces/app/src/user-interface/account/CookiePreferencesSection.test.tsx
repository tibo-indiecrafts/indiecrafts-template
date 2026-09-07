import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { site } from "@/config";
import { CookiePreferencesSection } from "./CookiePreferencesSection";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const { showConsentSavedToast } = vi.hoisted(() => ({
  showConsentSavedToast: vi.fn(),
}));
vi.mock("@indiecrafts/packages-web-ui-components/web/consent-toast", () => ({
  showConsentSavedToast,
}));

const storageKey = `${site.prefix}.cookie-consent`;

beforeEach(() => {
  localStorage.clear();
  showConsentSavedToast.mockClear();
});

describe("CookiePreferencesSection", () => {
  it("renders the always-on necessary category as a disabled switch", () => {
    render(<CookiePreferencesSection />);
    const necessary = screen.getByRole("switch", {
      name: /categories\.necessary\.title/,
    });
    expect(necessary).toBeChecked();
    expect(necessary).toBeDisabled();
  });

  it("saves a toggled category to the shared consent store and confirms with a toast", async () => {
    const user = userEvent.setup();
    render(<CookiePreferencesSection />);

    const analytics = screen.getByRole("switch", {
      name: /categories\.analytics\.title/,
    });
    expect(analytics).not.toBeChecked();

    await user.click(analytics);
    await user.click(screen.getByRole("button", { name: "save" }));

    expect(showConsentSavedToast).toHaveBeenCalledOnce();
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null") as {
      v: string;
      choices: Record<string, boolean>;
    };
    expect(stored.choices).toEqual({ analytics: true, marketing: false });
    expect(stored.v).toBe("2026-01");
  });
});
