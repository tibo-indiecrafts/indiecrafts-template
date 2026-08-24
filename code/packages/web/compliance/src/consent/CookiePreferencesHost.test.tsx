import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { CookiePreferencesHost } from "./CookiePreferencesHost";
import { OPEN_PREFERENCES_EVENT, openPreferences } from "./consent-store";
import type { ConsentCategory } from "./consent-signals";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

const CATEGORIES: ConsentCategory[] = [
  { key: "necessary", title: "Necessary", required: true, signals: [] },
];

describe("CookiePreferencesHost", () => {
  it("mounts a working preferences dialog + OPEN_PREFERENCES_EVENT listener with no CookieBanner present", async () => {
    // Reproduces the C1 gap: a CCPA opt-out visitor on a site with
    // `requireCookieConsent` off gets no `<CookieBanner>` (so no dialog, no
    // listener) — this host is what `[locale]/layout.tsx` mounts instead so the
    // footer "Do Not Sell" link's `openPreferences()` call actually opens something.
    render(<CookiePreferencesHost categories={CATEGORIES} version="v1" />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // `DoNotSellLink` / `ManagePreferencesButton` both trigger the dialog via this
    // exact call — dispatch it the same way, not the raw event, so the test tracks
    // the real integration point.
    act(() => openPreferences());

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
  });

  it("renders nothing when there are no consent categories to show", () => {
    const { container } = render(
      <CookiePreferencesHost categories={[]} version="v1" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

// Sanity-check the event name the host listens for is the one `openPreferences()`
// dispatches, so the two tests above stay meaningful if either changes independently.
describe("openPreferences", () => {
  it("dispatches OPEN_PREFERENCES_EVENT on window", () => {
    const onOpen = vi.fn();
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    openPreferences();
    window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    expect(onOpen).toHaveBeenCalledOnce();
  });
});
