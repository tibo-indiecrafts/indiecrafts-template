import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
vi.mock("@indiecrafts/packages-shared-logger", () => ({ logger: { error: vi.fn() } }));

const { default: GlobalError } = await import("./global-error");

afterEach(() => {
  cleanup();
  nav.pathname = "/";
});

const error = Object.assign(new Error("layout failed"), { digest: "d1" });

describe("GlobalError", () => {
  it("loads the default locale's error copy for an unprefixed path", async () => {
    render(<GlobalError error={error} reset={() => undefined} />);
    expect(
      await screen.findByRole("heading", { name: en.pages.error.title }),
    ).toBeTruthy();
    expect(document.documentElement.lang).toBe("en");
  });

  it("reads the locale from the path prefix", async () => {
    nav.pathname = "/fr/blog";
    render(<GlobalError error={error} reset={() => undefined} />);
    expect(
      await screen.findByRole("heading", { name: fr.pages.error.title }),
    ).toBeTruthy();
    expect(document.documentElement.lang).toBe("fr");
  });

  it("retries through reset", async () => {
    const reset = vi.fn();
    render(<GlobalError error={error} reset={reset} />);
    await userEvent.click(
      await screen.findByRole("button", { name: en.pages.error.retryLabel }),
    );
    expect(reset).toHaveBeenCalledOnce();
  });
});
