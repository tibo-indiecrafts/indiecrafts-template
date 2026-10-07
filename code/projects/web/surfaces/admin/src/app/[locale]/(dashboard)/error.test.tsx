import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/en.json";
import DashboardError from "./error";

describe("DashboardError", () => {
  it("shows the message and retries with reset", () => {
    const reset = vi.fn();
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DashboardError error={new Error("boom")} reset={reset} />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeTruthy();
    // The raw error message never reaches the screen.
    expect(screen.queryByText("boom")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
