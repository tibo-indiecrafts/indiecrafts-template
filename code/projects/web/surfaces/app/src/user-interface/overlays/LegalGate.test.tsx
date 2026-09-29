import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { NextIntlClientProvider } from "next-intl";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Clerk keeps getToken stable across renders; only userId changes on sign-in.
const auth = vi.hoisted(() => {
  const state = { userId: null as string | null, getToken: async () => null as string | null };
  state.getToken = async () => state.userId && "jwt";
  return state;
});
const readLegalConsent = vi.hoisted(() => vi.fn(async () => null));
vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ userId: auth.userId, getToken: auth.getToken }),
}));
vi.mock("@indiecrafts/packages-shared-compliance/shared", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  fetchLegalVersion: async () => "v2",
  readLegalConsent,
}));

afterEach(() => {
  vi.unstubAllEnvs();
  readLegalConsent.mockClear();
  auth.userId = null;
});

describe("SignedInLegalGate", () => {
  // Sign-in is a client-side navigation: the gate stays mounted. Without a re-check, a
  // user who already accepted on another surface keeps seeing the banner until a reload.
  it("re-reads the server acceptance when the user signs in", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.test");
    vi.resetModules();
    const { SignedInLegalGate } = await import("./LegalGate");
    const root = createRoot(document.createElement("div"));
    const render = () =>
      act(async () =>
        root.render(
          <NextIntlClientProvider locale="en" messages={{}} onError={() => {}}>
            <SignedInLegalGate locale="en" />
          </NextIntlClientProvider>,
        ),
      );

    await render(); // signed out
    const before = readLegalConsent.mock.calls.length;
    auth.userId = "user_1";
    await render(); // signed in, same mounted tree
    expect(readLegalConsent.mock.calls.length).toBeGreaterThan(before);
    await act(async () => root.unmount());
  });
});
