import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { DataRequestsTable } from "./data-requests-table";
import type { DataRequestRow } from "@/lib/monitoring";

// The locale-aware Link needs the Next router; a plain anchor keeps the href testable.
vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

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
  // Past due on any clock, so "Overdue" is deterministic.
  due_at: "2020-11-01T08:30:00.000Z",
  source: "/data-request",
  locale: "fr",
};

const renderTable = (rows: DataRequestRow[] = [row]) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <DataRequestsTable rows={rows} />
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

  it("opens the request's side sheet from the right", () => {
    renderTable();
    const link = screen.getByRole("link", { name: /Withdraw consent/ });
    expect(link.getAttribute("href")).toBe("/data-requests?id=7");
  });

  it("flags an open request past its due date, never a closed one", () => {
    renderTable([row, { ...row, id: 8, status: "done" }]);
    expect(screen.getAllByText("Overdue")).toHaveLength(1);
  });
});
