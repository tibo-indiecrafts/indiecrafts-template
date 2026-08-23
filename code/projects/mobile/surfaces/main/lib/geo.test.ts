import { loadConsentMode } from "./geo";

// jest runs with no EXPO_PUBLIC_API_URL set (like agent.test.ts) and AsyncStorage empty, so
// loadConsentMode can't reach the api and has nothing cached — it must fail SAFE to opt-in.
test("loadConsentMode fails safe to opt-in with no api + no cache", async () => {
  expect(await loadConsentMode()).toBe("opt-in");
});
