import { afterEach, describe, expect, it, vi } from "vitest";

const logError = vi.hoisted(() => vi.fn());
vi.mock("@indiecrafts/packages-shared-logger", () => ({
  logger: { error: logError },
}));
const { persistLocale } = await import("./persist-locale");

type ClerkUser = {
  unsafeMetadata: Record<string, unknown>;
  update: ReturnType<typeof vi.fn>;
};
const withUser = (user: ClerkUser | null) =>
  Object.assign(globalThis, { Clerk: { user } });

afterEach(() => {
  delete (globalThis as { Clerk?: unknown }).Clerk;
  logError.mockClear();
});

describe("persistLocale", () => {
  it("is a no-op when Clerk isn't loaded or no one is signed in", () => {
    expect(() => persistLocale("fr")).not.toThrow();
    withUser(null);
    expect(() => persistLocale("fr")).not.toThrow();
  });

  it("saves a changed locale, keeping the other metadata", () => {
    const user = {
      unsafeMetadata: { locale: "en", marketing_email: true },
      update: vi.fn(async () => ({})),
    };
    withUser(user);
    persistLocale("fr");
    expect(user.update).toHaveBeenCalledWith({
      unsafeMetadata: { locale: "fr", marketing_email: true },
    });
  });

  it("skips the write when the locale is already stored", () => {
    const user = { unsafeMetadata: { locale: "fr" }, update: vi.fn() };
    withUser(user);
    persistLocale("fr");
    expect(user.update).not.toHaveBeenCalled();
  });

  it("logs a failed write instead of throwing", async () => {
    withUser({
      unsafeMetadata: {},
      update: vi.fn(async () => Promise.reject(new TypeError("network"))),
    });
    persistLocale("fr");
    await vi.waitFor(() =>
      expect(logError).toHaveBeenCalledWith("locale sync to Clerk failed", {
        name: "TypeError",
      }),
    );
  });
});
