import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const state = vi.hoisted(() => ({ active: false }));
vi.mock("@indiecrafts/packages-web-auth/clerk-active", () => ({
  useClerkActive: () => state.active,
}));

const { RequireClerk } = await import("./RequireClerk");
const reload = vi.fn();

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  reload.mockClear();
  state.active = false;
});

Object.defineProperty(window, "location", {
  value: { ...window.location, pathname: "/sign-in", reload },
  writable: true,
});

describe("RequireClerk", () => {
  it("renders the Clerk UI when Clerk is loaded, and clears the reload guard", () => {
    state.active = true;
    sessionStorage.setItem("clerk-reload", "/sign-in");
    render(<RequireClerk>sign-in form</RequireClerk>);
    expect(screen.getByText("sign-in form")).toBeTruthy();
    expect(reload).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("clerk-reload")).toBeNull();
  });

  it("without Clerk (a client-side arrival), renders nothing and reloads once", () => {
    const { container } = render(<RequireClerk>sign-in form</RequireClerk>);
    expect(container.innerHTML).toBe("");
    expect(reload).toHaveBeenCalledOnce();
    cleanup();
    // Still no Clerk after that reload: stop, don't loop.
    render(<RequireClerk>sign-in form</RequireClerk>);
    expect(reload).toHaveBeenCalledOnce();
  });
});
