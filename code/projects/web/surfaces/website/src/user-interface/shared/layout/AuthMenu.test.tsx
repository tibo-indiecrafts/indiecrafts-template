import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/fr.json";

const state = vi.hoisted(() => ({ active: false, pathname: "/fr/blog" }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
// The routing module re-exports `localizedPathname` from config; skip its next-intl navigation.
vi.mock("@/i18n/routing", async () => ({
  localizedPathname: (await import("@/config")).localizedPathname,
}));
vi.mock("@indiecrafts/packages-web-auth/clerk-active", () => ({
  useClerkActive: () => state.active,
}));
vi.mock("@/user-interface/account/LazyClerk", () => ({
  LazyClerkAuthMenu: () => <span>clerk-menu</span>,
}));

const { AuthMenu } = await import("./AuthMenu");
const renderMenu = () =>
  render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <AuthMenu />
    </NextIntlClientProvider>,
  );

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  state.active = false;
});

describe("AuthMenu", () => {
  it("renders nothing when auth is off (no Clerk key)", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    expect(renderMenu().container.innerHTML).toBe("");
  });

  it("without Clerk loaded, links to the localized sign-in page and back here", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    renderMenu();
    const link = screen.getByRole("link", { name: messages.nav.signIn });
    expect(link.getAttribute("href")).toBe("/fr/sign-in?redirect_url=%2Ffr%2Fblog");
    expect(screen.queryByText("clerk-menu")).toBeNull();
  });

  it("hands over to Clerk's menu once Clerk is loaded", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    state.active = true;
    renderMenu();
    expect(screen.getByText("clerk-menu")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
