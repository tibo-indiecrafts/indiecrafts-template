import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportSection } from "./ExportSection";

const copy = {
  heading: "Download your data",
  body: "b",
  button: "Download my data",
  pending: "Preparing…",
  success: "Ready",
  error: "Something went wrong",
};

// The surface injects `submitExport` (its step-up wrapper) — the section must use it, not
// the plain request, or a stale session can never pass the reverification check.
describe("ExportSection", () => {
  it("uses the injected submitExport and opens the download", async () => {
    const submitExport = vi
      .fn()
      .mockResolvedValue({ ok: true, url: "https://dl.test/x" });
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(
      <ExportSection
        copy={copy}
        apiUrl="https://api.test"
        getToken={async () => "t"}
        submitExport={submitExport}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Download my data" }),
    );
    await waitFor(() => expect(screen.getByText("Ready")).toBeTruthy());
    expect(submitExport).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith(
      "https://dl.test/x",
      "_blank",
      "noopener",
    );
  });

  it("shows the error copy when the step-up is cancelled or the export fails", async () => {
    const submitExport = vi.fn().mockResolvedValue({ ok: false });
    render(
      <ExportSection
        copy={copy}
        apiUrl="https://api.test"
        getToken={async () => "t"}
        submitExport={submitExport}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Download my data" }),
    );
    await waitFor(() =>
      expect(screen.getByText("Something went wrong")).toBeTruthy(),
    );
  });
});
