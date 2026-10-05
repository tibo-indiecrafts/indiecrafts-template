import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CookieBanner } from "./CookieBanner";
import { STORAGE_KEY } from "./consent-store";
import type { ConsentCategory } from "./consent-signals";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@indiecrafts/packages-web-i18n", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@indiecrafts/packages-web-ui-components/web/overlay-turn", () => ({
  useOverlayTurn: (_id: string, wants: boolean) => wants,
}));

const categories: ConsentCategory[] = [
  { key: "necessary", title: "Necessary", required: true, signals: [] },
  { key: "analytics", title: "Analytics", signals: ["analytics_storage"] },
];

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("CookieBanner — GPC (Brave sends it by default)", () => {
  it("opt-in (EU): still shows the banner and decides nothing", () => {
    render(
      <CookieBanner
        categories={categories}
        version="v1"
        mode="opt-in"
        gpcSignal
      />,
    );
    expect(
      screen.getByRole("button", { name: "rejectAll" }),
    ).toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("opt-out (US): honours GPC with a silent reject and no banner", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    render(
      <CookieBanner
        categories={categories}
        version="v1"
        mode="opt-out"
        gpcSignal
      />,
    );
    expect(screen.queryByRole("button", { name: "rejectAll" })).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).choices).toEqual({
      analytics: false,
    });
  });
});
