import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { ConsentSheet } from "./consent-sheet";
import type { ConsentDecision } from "@/lib/consent-history";

vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

const d = (type: string, granted: boolean, ts: string, source = "banner"): ConsentDecision => ({
  ts,
  type,
  granted,
  policyVersion: "1",
  surface: "website",
  source,
  country: "FR",
});

const sheet = (history: Parameters<typeof ConsentSheet>[0]["history"]) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <ConsentSheet email="jane@example.com" history={history} closeHref="/users" />
    </NextIntlClientProvider>,
  );

describe("ConsentSheet", () => {
  it("shows the current state and the timeline with readable labels", () => {
    sheet({
      current: [d("cookie_analytics", false, "2026-10-02T10:00:00Z", "preferences"), d("email_pref:news", true, "2026-10-01T10:00:00Z")],
      events: [
        d("cookie_analytics", false, "2026-10-02T10:00:00Z", "preferences"),
        d("cookie_analytics", true, "2026-10-01T10:00:00Z"),
        d("email_pref:news", true, "2026-10-01T10:00:00Z"),
      ],
    });
    expect(screen.getByText("Decisions recorded for jane@example.com. Newest first; the IP is never shown.")).toBeInTheDocument();
    expect(screen.getAllByText("Analytics cookies")).toHaveLength(3);
    expect(screen.getAllByText("Emails: news")).toHaveLength(2);
    expect(screen.getAllByText("Refused")).toHaveLength(2);
    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });

  it("says when the user has no recorded decision", () => {
    sheet({ current: [], events: [] });
    expect(screen.getByText("No consent decision recorded for this user.")).toBeInTheDocument();
  });

  it("shows a load error instead of a false empty state", () => {
    sheet(null);
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load the consent history");
  });
});
