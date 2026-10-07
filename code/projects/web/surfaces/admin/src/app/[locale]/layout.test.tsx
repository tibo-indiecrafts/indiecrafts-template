import { describe, expect, it, vi } from "vitest";
import type { ReactElement, ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../messages/en.json";
import { SkipLink } from "@indiecrafts/packages-web-ui-components/web/layout/SkipLink";

// Call the async server layout directly: JSX is lazy, so the returned tree shows what the
// layout places in <body> without rendering Clerk or the request APIs.
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
// A namespace string resolves against the real messages; anything else echoes the key.
vi.mock("next-intl/server", () => ({
  getTranslations: async (ns: unknown) => (key: string) =>
    typeof ns === "string"
      ? ((messages as Record<string, Record<string, unknown>>)[ns]?.[key] ?? key)
      : key,
  setRequestLocale: () => undefined,
}));
vi.mock("@/i18n/routing", () => ({ routing: { locales: ["en", "fr"] } }));
vi.mock("@indiecrafts/packages-web-auth", () => ({
  AppClerkProvider: ({ children }: { children: ReactNode }) => children,
  SessionLogger: () => null,
}));

const { default: LocaleLayout } = await import("./layout");

type El = ReactElement<{ children?: ReactNode }>;
const kids = (el: El) =>
  [el.props.children].flat().filter((c): c is El => !!c && typeof c === "object");
const find = (el: El, type: unknown): El | undefined =>
  el.type === type ? el : kids(el).map((c) => find(c, type)).find(Boolean);

describe("admin LocaleLayout", () => {
  it("renders the skip link first, pointing at #main", async () => {
    const tree = (await LocaleLayout({
      children: null,
      params: Promise.resolve({ locale: "en" }),
    })) as El;
    const provider = find(tree, NextIntlClientProvider);
    const first = provider && kids(provider)[0];
    expect(first?.type).toBe(SkipLink);

    render(first as El);
    const link = screen.getByRole("link", { name: "Skip to main content" });
    expect(link.getAttribute("href")).toBe("#main");
  });
});
