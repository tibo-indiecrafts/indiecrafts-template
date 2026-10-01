import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/fr.json";
import { SessionsTable, type SessionRow } from "./sessions-table";

const { toastMock, listUserSessions, revokeSession, revokeUserSessions } = vi.hoisted(() => ({
  toastMock: { success: vi.fn(), error: vi.fn() },
  listUserSessions: vi.fn(),
  revokeSession: vi.fn(),
  revokeUserSessions: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: toastMock }));
vi.mock("./actions", () => ({ listUserSessions, revokeSession, revokeUserSessions }));

// 23:30 UTC is already the next day east of UTC — the date proves the UTC zone, the
// month name proves the admin locale (not the browser's).
const row: SessionRow = {
  ts: "2026-10-01T23:30:00.000Z",
  surface: "website",
  user_id: "user_abc",
  session_id: "sess_abc",
  country: "FR",
};

const renderTable = () =>
  render(
    <NextIntlClientProvider locale="fr" messages={messages} timeZone="UTC">
      <SessionsTable rows={[row]} />
    </NextIntlClientProvider>,
  );

afterEach(() => vi.clearAllMocks());

describe("SessionsTable", () => {
  it("shows the sign-in time in the admin locale and UTC, not a raw ISO string", () => {
    renderTable();
    expect(screen.getByText(/1 oct\. 2026.*23:30/)).toBeTruthy();
    expect(screen.queryByText(row.ts)).toBeNull();
  });

  it("shows the user's email, with the Clerk id kept for copy-paste", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={messages} timeZone="UTC">
        <SessionsTable rows={[row]} emails={{ user_abc: "jane@example.com" }} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("jane@example.com")).toBeTruthy();
    expect(screen.getByText("user_abc")).toBeTruthy();
  });

  it("formats a live session's last activity the same way", async () => {
    listUserSessions.mockResolvedValueOnce([
      { id: "sess_1", lastActiveAt: Date.parse("2026-10-01T23:45:00.000Z"), browser: "Firefox" },
    ]);
    renderTable();
    fireEvent.click(screen.getByRole("button", { name: "Gérer" }));
    expect(await screen.findByText(/1 oct\. 2026.*23:45/)).toBeTruthy();
  });

  it("confirms 'sign out everywhere' even while the row is collapsed", async () => {
    revokeUserSessions.mockResolvedValueOnce({ ok: true });
    renderTable();
    fireEvent.click(screen.getByRole("button", { name: "Déconnecter l'utilisateur" }));
    await waitFor(() => expect(toastMock.success).toHaveBeenCalledWith("Terminé."));
    expect(revokeUserSessions).toHaveBeenCalledWith("user_abc");
  });

  it("reports a failed revoke as an error", async () => {
    revokeUserSessions.mockResolvedValueOnce({ ok: false, error: "failed" });
    renderTable();
    fireEvent.click(screen.getByRole("button", { name: "Déconnecter l'utilisateur" }));
    await waitFor(() => expect(toastMock.error).toHaveBeenCalledWith("Échec de l'action."));
  });
});
