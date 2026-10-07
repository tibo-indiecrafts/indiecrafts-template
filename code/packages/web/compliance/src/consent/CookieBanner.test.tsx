import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { CookieBanner } from "./CookieBanner";
import { STORAGE_KEY } from "./consent-store";
import { CONSENT_COOKIE } from "./consent-cookie";
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

describe("CookieBanner — server render from the consent cookie", () => {
  const html = (decided?: boolean) =>
    renderToString(
      <CookieBanner
        categories={categories}
        version="v1"
        mode="opt-in"
        decided={decided}
      />,
    );

  it("renders the banner in the first HTML for an undecided visitor", () => {
    expect(html(false)).toContain("rejectAll");
  });

  it("renders none for a visitor who decided this version, or with no cookie hint", () => {
    expect(html(true)).not.toContain("rejectAll");
    expect(html(undefined)).not.toContain("rejectAll");
  });

  it("copies an older visitor's stored decision into the cookie", () => {
    document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/`;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: "v1", t: 1, choices: {} }),
    );
    render(
      <CookieBanner
        categories={categories}
        version="v1"
        mode="opt-in"
        decided={false}
      />,
    );
    expect(document.cookie).toContain(`${CONSENT_COOKIE}=v1`);
    expect(screen.queryByRole("button", { name: "rejectAll" })).toBeNull();
  });
});
