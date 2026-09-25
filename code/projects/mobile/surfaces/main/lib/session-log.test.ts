import { logSignIn, logFailedLogin } from "./session-log";

// jest runs with no EXPO_PUBLIC_API_URL / EXPO_PUBLIC_EVENTS_TOKEN set, so both loggers
// return early WITHOUT a network call (mirrors agent.test.ts's env guard).
describe("session-log (mobile env guard + never-throw)", () => {
  const ORIGINAL_ENV = process.env;

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  it("logSignIn resolves without throwing when EXPO_PUBLIC_* is unset", async () => {
    await expect(logSignIn("user_1")).resolves.toBeUndefined();
  });

  it("logFailedLogin resolves without throwing when EXPO_PUBLIC_* is unset", async () => {
    await expect(logFailedLogin()).resolves.toBeUndefined();
  });

  it("logSignIn resolves without throwing when fetch fails", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      EXPO_PUBLIC_API_URL: "https://api.example.test",
      EXPO_PUBLIC_EVENTS_TOKEN: "token",
    };
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("network down"));
    await expect(logSignIn("user_1", "sess_1")).resolves.toBeUndefined();
  });

  it("logFailedLogin resolves without throwing when fetch fails", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      EXPO_PUBLIC_API_URL: "https://api.example.test",
      EXPO_PUBLIC_EVENTS_TOKEN: "token",
    };
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("network down"));
    await expect(logFailedLogin()).resolves.toBeUndefined();
  });

  // NOTE: the request shape (the least-privilege `EVENTS_TOKEN` bearer, and that it only
  // sends the `session`/`security` kinds) is asserted API-side in
  // `code/shared/api/src/index.test.ts` — babel-preset-expo inlines `process.env.EXPO_PUBLIC_*`
  // at transform time, so a jest test cannot inject the token at runtime to exercise the fetch.
});
