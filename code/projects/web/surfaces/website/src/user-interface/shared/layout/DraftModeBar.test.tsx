import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const state = vi.hoisted(() => ({ inPresentation: null as boolean | null }));
vi.mock("next-sanity/hooks", () => ({
  useIsPresentationTool: () => state.inPresentation,
}));

const { DraftModeBar } = await import("./DraftModeBar");
const renderBar = () => render(<DraftModeBar label="Preview" exit="Exit preview" />);

afterEach(cleanup);

describe("DraftModeBar", () => {
  it("links to the disable route outside the Studio", () => {
    state.inPresentation = false;
    renderBar();
    expect(screen.getByRole("link", { name: "Exit preview" }).getAttribute("href")).toBe(
      "/api/draft-mode/disable",
    );
  });

  it.each([true, null])("stays hidden when in the Studio is %s", (value) => {
    state.inPresentation = value;
    renderBar();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
