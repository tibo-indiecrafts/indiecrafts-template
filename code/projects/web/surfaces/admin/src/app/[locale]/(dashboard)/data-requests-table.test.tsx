import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { DataRequestsTable } from "./data-requests-table";
import type { DataRequestRow } from "@/lib/monitoring";

// The operator view must be exact: a readable right + status, a reply link, the whole
// message (not only an excerpt), and a date in the admin's locale.
const long = "Please send me every record you hold about me. ".repeat(4).trim();
const row: DataRequestRow = {
  id: 7,
  request_type: "withdraw-consent",
  email: "jane@example.com",
  message: long,
  status: "in-progress",
  submitted_at: "2026-10-01T08:30:00.000Z",
  source: "/data-request",
  locale: "fr",
};

const renderTable = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <DataRequestsTable rows={[row]} />
    </NextIntlClientProvider>,
  );

describe("DataRequestsTable", () => {
  it("shows the right and the status as words, not raw keys", () => {
    renderTable();
    expect(screen.getByText("Withdraw consent")).toBeTruthy();
    expect(screen.getByText("In progress")).toBeTruthy();
    expect(screen.queryByText("withdraw-consent")).toBeNull();
  });

  it("links the requester email for a reply", () => {
    renderTable();
    const link = screen.getByRole("link", { name: "jane@example.com" });
    expect(link.getAttribute("href")).toBe("mailto:jane@example.com");
  });

  it("keeps the whole message readable behind the excerpt", () => {
    const { container } = renderTable();
    expect(container.querySelector("details")?.textContent).toContain(long);
  });

  it("formats the date in the admin locale", () => {
    renderTable();
    expect(screen.getByText(/Oct 1, 2026/)).toBeTruthy();
  });
});
