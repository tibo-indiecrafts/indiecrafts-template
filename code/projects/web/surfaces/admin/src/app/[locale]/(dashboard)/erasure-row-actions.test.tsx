import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { ErasureRowActions } from "./erasure-row-actions";

// Keyboard + screen-reader behaviour of the row actions: each button names its request, the
// email field takes focus when it appears, and Enter submits it.
const { retryErasure } = vi.hoisted(() => ({ retryErasure: vi.fn() }));
vi.mock("./monitoring-actions", () => ({
  retryErasure,
  closeErasure: vi.fn(),
}));
vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

const renderRow = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ErasureRowActions id={6} status="confirmed" />
    </NextIntlClientProvider>,
  );

describe("ErasureRowActions", () => {
  it("names the request in each button's accessible name", () => {
    renderRow();
    expect(
      screen.getByRole("button", { name: "Retry erasure — request #6" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Close manually — request #6" }),
    ).toBeTruthy();
  });

  it("focuses the email field when the api asks for it, and Enter retries with the typed email", async () => {
    const user = userEvent.setup();
    retryErasure.mockResolvedValueOnce({ ok: false, error: "email_required" });
    retryErasure.mockResolvedValueOnce({ ok: true, outcome: "completed" });
    renderRow();
    await user.click(screen.getByRole("button", { name: /Retry erasure/ }));
    const field = await screen.findByLabelText("Subject's email");
    expect(document.activeElement).toBe(field);
    await user.type(field, "subject@x.com{Enter}");
    expect(retryErasure).toHaveBeenLastCalledWith(6, "subject@x.com");
  });
});
