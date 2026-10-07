import { describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";

const { openSignIn } = vi.hoisted(() => ({ openSignIn: vi.fn() }));
vi.mock("@clerk/nextjs", () => ({ useClerk: () => ({ openSignIn }) }));
const { SignInModalButton } = await import("./sign-in-modal-button");

describe("SignInModalButton", () => {
  // The modal signs up in place; without this metadata the new account has no locale
  // and its welcome email falls back to English.
  it("opens the sign-in modal with the visitor's locale for an in-modal sign-up", () => {
    const el = SignInModalButton({
      locale: "fr",
      label: "Se connecter",
    }) as ReactElement<{
      onClick: () => void;
      children: string;
    }>;
    expect(el.props.children).toBe("Se connecter");
    el.props.onClick();
    expect(openSignIn).toHaveBeenCalledWith({
      unsafeMetadata: { locale: "fr" },
    });
  });
});
