import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountConsentTab } from "./AccountConsentTab";

const categories = [
  { key: "necessary", title: "Necessary", required: true },
  { key: "analytics", title: "Analytics" },
];

afterEach(() => localStorage.clear());

describe("AccountConsentTab", () => {
  it("hands the saved choices + the banner's version to the surface", async () => {
    const onSaved = vi.fn();
    render(
      <AccountConsentTab
        storageKey="t.cookie-consent"
        version="7·2026-09-01"
        categories={categories}
        title="Cookie preferences"
        saveLabel="Save"
        onSaved={onSaved}
      />,
    );
    await userEvent.click(screen.getByRole("switch", { name: /analytics/i }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSaved).toHaveBeenCalledWith({ analytics: true }, "7·2026-09-01");
    expect(JSON.parse(localStorage.getItem("t.cookie-consent")!)).toMatchObject(
      {
        v: "7·2026-09-01",
        choices: { analytics: true },
      },
    );
  });

  it("keeps an existing record's version (the banner owns re-versioning)", async () => {
    localStorage.setItem(
      "t.cookie-consent",
      JSON.stringify({
        v: "old",
        t: 1,
        choices: { necessary: true, analytics: false },
      }),
    );
    const onSaved = vi.fn();
    render(
      <AccountConsentTab
        storageKey="t.cookie-consent"
        version="new"
        categories={categories}
        title="Cookie preferences"
        saveLabel="Save"
        onSaved={onSaved}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSaved).toHaveBeenCalledWith(expect.any(Object), "old");
  });
});
