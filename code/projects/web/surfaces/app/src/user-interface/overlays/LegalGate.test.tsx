import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { NextIntlClientProvider } from "next-intl";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// Clerk keeps getToken stable across renders; only userId changes on sign-in.
const auth = vi.hoisted(() => {
  const state = {
    userId: null as string | null,
    getToken: async () => null as string | null,
  };
  state.getToken = async () => state.userId && "jwt";
  return state;
});
const syncLegalConsent = vi.hoisted(() =>
  vi.fn(async (_input: { acceptedHere: boolean; version: string }) => false),
);
vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ userId: auth.userId, getToken: auth.getToken }),
}));
vi.mock("@indiecrafts/packages-shared-compliance/shared", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  fetchLegalVersion: async () => "v2",
  syncLegalConsent,
}));

afterEach(() => {
  vi.unstubAllEnvs();
  syncLegalConsent.mockClear();
  localStorage.clear();
  auth.userId = null;
});

async function mountGate() {
  vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.test");
  vi.resetModules();
  const { SignedInLegalGate } = await import("./LegalGate");
  const { legalStore } = await import("./stores");
  const root = createRoot(document.createElement("div"));
  const render = () =>
    act(async () =>
      root.render(
        <NextIntlClientProvider locale="en" messages={{}} onError={() => {}}>
          <SignedInLegalGate locale="en" />
        </NextIntlClientProvider>,
      ),
    );
  return { root, render, legalStore };
}

// Each test re-imports the gate cold (`vi.resetModules`), which a `--coverage` run slows past
// the 5 s default on a busy runner.
describe("SignedInLegalGate", { timeout: 15_000 }, () => {
  // Sign-in is a client-side navigation: the gate stays mounted. Without a re-check, a
  // user who already accepted on another surface keeps seeing the banner until a reload.
  it("re-reads the server acceptance when the user signs in", async () => {
    const { root, render } = await mountGate();
    await render(); // signed out
    const before = syncLegalConsent.mock.calls.length;
    auth.userId = "user_1";
    await render(); // signed in, same mounted tree
    expect(syncLegalConsent.mock.calls.length).toBeGreaterThan(before);
    await act(async () => root.unmount());
  });

  // The accept-time write is fire-and-forget: a reload, an offline moment or a failed
  // token refresh can drop it (seen in the Android shell). The next load must re-send it,
  // or the user's other surfaces keep asking forever.
  it("asks to re-send an acceptance made here that the server may not have", async () => {
    const { root, render, legalStore } = await mountGate();
    legalStore.save({ version: "v2", t: 1 });
    auth.userId = "user_1";
    await render();
    expect(syncLegalConsent).toHaveBeenLastCalledWith(
      expect.objectContaining({
        version: "v2",
        acceptedHere: true,
        surface: "app",
      }),
    );
    await act(async () => root.unmount());
  });

  it("never accepts on the user's behalf: no local acceptance → acceptedHere false", async () => {
    const { root, render } = await mountGate();
    auth.userId = "user_1";
    await render();
    expect(syncLegalConsent).toHaveBeenLastCalledWith(
      expect.objectContaining({ version: "v2", acceptedHere: false }),
    );
    await act(async () => root.unmount());
  });
});
