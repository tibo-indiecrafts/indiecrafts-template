import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";

vi.mock("@clerk/nextjs", () => ({ ClerkProvider: () => null }));
const { AppClerkProvider } = await import("./provider");

type ClerkProps = { signUpUrl?: string };
const props = (el: ReturnType<typeof AppClerkProvider>) =>
  (el as ReactElement<ClerkProps>).props;

afterEach(() => vi.unstubAllEnvs());

describe("AppClerkProvider — sign-up URL", () => {
  // Without it, the sign-in modal's "Sign up" link signs up INSIDE the modal: no
  // `unsafeMetadata`, so no locale (English welcome email) and no marketing decision.
  it("routes Clerk's sign-up links to the app's own localized page", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    expect(
      props(
        AppClerkProvider({
          children: null,
          locale: "fr",
          signUpPath: "/sign-up",
        }),
      ).signUpUrl,
    ).toBe("/fr/sign-up");
    expect(
      props(
        AppClerkProvider({
          children: null,
          locale: "en",
          signUpPath: "/sign-up",
        }),
      ).signUpUrl,
    ).toBe("/sign-up");
  });

  it("leaves it unset for a surface with no sign-up page (admin)", () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    expect(
      props(AppClerkProvider({ children: null, locale: "fr" })).signUpUrl,
    ).toBeUndefined();
  });
});
