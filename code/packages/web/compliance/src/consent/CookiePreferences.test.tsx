import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookiePreferences } from "./CookiePreferences";
import { STORAGE_KEY } from "./consent-store";
import type { ConsentCategory } from "./consent-signals";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

const CATEGORIES: ConsentCategory[] = [
  { key: "necessary", title: "Necessary", required: true, signals: [] },
  { key: "analytics", title: "Analytics", signals: [] },
  { key: "marketing", title: "Marketing", signals: [] },
];

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("CookiePreferences — Save choices", () => {
  it("records every optional category: a touched one as chosen, the rest as an explicit false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );
    render(
      <CookiePreferences
        categories={CATEGORIES}
        version="v1"
        open
        onOpenChange={() => {}}
        current={{}}
      />,
    );
    await userEvent.click(screen.getByRole("switch", { name: "Analytics" }));
    await userEvent.click(screen.getByRole("button", { name: "save" }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).choices).toEqual({
      analytics: true,
      marketing: false,
    });
  });
});
