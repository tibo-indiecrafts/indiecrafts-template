import { afterEach, describe, expect, it, vi } from "vitest";

const { env, addTransport } = vi.hoisted(() => ({
  env: { value: "production" },
  addTransport: vi.fn(),
}));
vi.mock("@indiecrafts/packages-shared-config", () => ({
  getCurrentEnvironment: () => env.value,
}));
vi.mock("@indiecrafts/packages-shared-logger", () => ({ addTransport }));

const { register } = await import("./instrumentation");

afterEach(() => vi.clearAllMocks());

describe("register", () => {
  it("forwards server errors to Workers Logs in production", async () => {
    env.value = "production";
    await register();
    expect(addTransport).toHaveBeenCalledOnce();
  });

  it("adds nothing outside production (the console already shows errors)", async () => {
    env.value = "development";
    await register();
    expect(addTransport).not.toHaveBeenCalled();
  });
});
