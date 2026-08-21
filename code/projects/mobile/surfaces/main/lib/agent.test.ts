import { callAgent } from "./agent";

// jest runs with no EXPO_PUBLIC_API_URL / EXPO_PUBLIC_AGENT_TOKEN set, so the mobile
// env guard fires: fail closed WITHOUT a network call (the bundle token is required).
describe("callAgent (mobile env guard)", () => {
  it("fails closed when the API base/token env is unset", async () => {
    const res = await callAgent("content-research", "some goal", "en");
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toMatch(/EXPO_PUBLIC/);
  });
});
