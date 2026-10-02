import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import { AdminRoleForm } from "./admin-role-form";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("./actions", () => ({ grantAdmin: vi.fn() }));

// Demotion is not a dashboard action (Clerk Dashboard only) — the form only grants.
describe("AdminRoleForm", () => {
  it("offers grant only, no revoke", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <AdminRoleForm />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("button", { name: "Grant admin" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /revoke/i })).toBeNull();
  });
});
