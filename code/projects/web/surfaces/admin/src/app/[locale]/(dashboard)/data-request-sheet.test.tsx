import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { DataRequestSheet } from "./data-request-sheet";
import type { DataRequestDetail } from "@/lib/monitoring";

// The operator's whole job on one request: read it, see its deadline and history, and
// move it — closing with a reply prefilled in the requester's language.
const { setDataRequestStatus, toast, refresh } = vi.hoisted(() => ({
  setDataRequestStatus: vi.fn(),
  toast: { success: vi.fn(), warning: vi.fn(), error: vi.fn() },
  refresh: vi.fn(),
}));
vi.mock("./monitoring-actions", () => ({ setDataRequestStatus }));
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ refresh, replace: vi.fn() }),
}));
vi.mock("sonner", () => ({ toast }));

const req = (status: string): DataRequestDetail => ({
  id: 7,
  request_type: "access",
  email: "jane@example.com",
  message: "Send me my data.",
  status,
  submitted_at: "2026-10-01T08:30:00.000Z",
  due_at: "2026-11-01T08:30:00.000Z",
  source: "/fr/exercer-mes-droits",
  locale: "fr",
  policy_version: "2026-01-01",
  events: [
    {
      id: 1,
      status: "in-progress",
      note: null,
      actor: "user_a",
      notified: false,
      at: "2026-10-02T09:00:00.000Z",
    },
  ],
});
const prefill = {
  done: "Bonjour, demande traitée.",
  rejected: "Bonjour,\n\nMotif : [indiquez le motif]",
};
const renderSheet = (status = "new") =>
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <DataRequestSheet request={req(status)} prefill={prefill} />
    </NextIntlClientProvider>,
  );

describe("DataRequestSheet", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows the request: reply link, full message, due date, history", () => {
    renderSheet();
    expect(
      screen.getByRole("link", { name: "jane@example.com" }).getAttribute("href"),
    ).toBe("mailto:jane@example.com");
    expect(screen.getByText("Send me my data.")).toBeTruthy();
    expect(screen.getByText(/Nov 1, 2026/)).toBeTruthy();
    expect(screen.getByText(/user_a/)).toBeTruthy();
  });

  it("offers only the moves the status allows", () => {
    const { unmount } = renderSheet("in-progress");
    expect(screen.queryByRole("button", { name: "Start" })).toBeNull();
    expect(screen.getByRole("button", { name: "Mark done" })).toBeTruthy();
    unmount();
    renderSheet("done");
    expect(screen.getByText("This request is closed.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Mark done" })).toBeNull();
  });

  it("starts a new request", async () => {
    const user = userEvent.setup();
    setDataRequestStatus.mockResolvedValue({ ok: true, notified: false });
    renderSheet("new");
    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(setDataRequestStatus).toHaveBeenCalledWith(7, "new", "in-progress", "", false);
    expect(toast.success).toHaveBeenCalled();
  });

  it("prefills the reply in the requester's language and sends it", async () => {
    const user = userEvent.setup();
    setDataRequestStatus.mockResolvedValue({ ok: true, notified: true });
    renderSheet("new");
    await user.click(screen.getByRole("button", { name: "Mark done" }));
    const note = screen.getByLabelText("Reply to the requester") as HTMLTextAreaElement;
    expect(note.value).toBe("Bonjour, demande traitée.");
    expect(
      screen.getByRole("checkbox", { name: "Email the requester" }).getAttribute("data-state"),
    ).toBe("checked");
    await user.click(screen.getByRole("button", { name: "Confirm: done" }));
    expect(setDataRequestStatus).toHaveBeenCalledWith(
      7,
      "new",
      "done",
      "Bonjour, demande traitée.",
      true,
    );
    expect(toast.success).toHaveBeenCalled();
  });

  it("blocks an empty reply, and warns when the email was not sent", async () => {
    const user = userEvent.setup();
    setDataRequestStatus.mockResolvedValue({ ok: true, notified: false });
    renderSheet("new");
    await user.click(screen.getByRole("button", { name: "Reject" }));
    const note = screen.getByLabelText("Reply to the requester");
    await user.clear(note);
    const confirm = screen.getByRole("button", { name: "Confirm: rejected" });
    expect((confirm as HTMLButtonElement).disabled).toBe(true);
    await user.type(note, "Motif : not our data.");
    await user.click(confirm);
    expect(toast.warning).toHaveBeenCalled();
  });

  it("shows the api's refusal", async () => {
    const user = userEvent.setup();
    setDataRequestStatus.mockResolvedValue({ ok: false, error: "changed" });
    renderSheet("new");
    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(toast.error).toHaveBeenCalledWith(
      "Someone changed this request — reload the page.",
    );
  });

  it("cannot send a refusal until the [reason] placeholder is replaced", async () => {
    const user = userEvent.setup();
    renderSheet("new");
    await user.click(screen.getByRole("button", { name: "Reject" }));
    const confirm = screen.getByRole("button", { name: "Confirm: rejected" });
    expect((confirm as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(/Replace the text in \[brackets\]/)).toBeTruthy();
    const note = screen.getByLabelText("Reply to the requester");
    await user.clear(note);
    await user.type(note, "Motif : hors de notre périmètre.");
    expect((confirm as HTMLButtonElement).disabled).toBe(false);
  });

  it("reloads the request when someone else changed it", async () => {
    const user = userEvent.setup();
    setDataRequestStatus.mockResolvedValue({ ok: false, error: "changed" });
    renderSheet("new");
    await user.click(screen.getByRole("button", { name: "Start" }));
    expect(refresh).toHaveBeenCalled();
  });
});
