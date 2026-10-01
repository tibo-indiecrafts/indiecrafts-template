import { describe, expect, it, vi } from "vitest";
import { callErasureSelf, callExportSelf } from "./use-clerk-auth-port";

// `callErasureSelf` is the exact call `useReverification` wraps in `useClerkAuthPort` —
// the step-up path both live surfaces actually use (not the default `submitAccountErasure`
// path). This guards that a later refactor can't silently drop the survey on that path.
describe("callErasureSelf", () => {
  it("forwards the full survey (reason + feedback + competitor) into rawErasureFetch's input", async () => {
    const doRawErasureFetch = vi.fn().mockResolvedValue({ status: 200 });
    const getToken = async () => "tkn";

    await callErasureSelf(
      "https://api.example.test",
      getToken,
      "you@example.com",
      { reason: "too_hard", feedback: "confusing", competitor: "Acme" },
      doRawErasureFetch,
    );

    expect(doRawErasureFetch).toHaveBeenCalledWith({
      apiUrl: "https://api.example.test",
      getToken,
      email: "you@example.com",
      reason: "too_hard",
      feedback: "confusing",
      competitor: "Acme",
    });
  });

  it("passes through with no survey fields when none are given", async () => {
    const doRawErasureFetch = vi.fn().mockResolvedValue({ status: 200 });
    const getToken = async () => "tkn";

    await callErasureSelf(
      "https://api.example.test",
      getToken,
      "you@example.com",
      undefined,
      doRawErasureFetch,
    );

    expect(doRawErasureFetch).toHaveBeenCalledWith({
      apiUrl: "https://api.example.test",
      getToken,
      email: "you@example.com",
    });
  });
});

// The export runs behind the same step-up: `callExportSelf` is what `useReverification`
// wraps for "Download my data".
describe("callExportSelf", () => {
  it("passes the api url and the token getter to rawExportFetch", async () => {
    const doRawExportFetch = vi
      .fn()
      .mockResolvedValue({ status: 200, downloadUrl: "u" });
    const getToken = async () => "tkn";
    await callExportSelf(
      "https://api.example.test",
      getToken,
      doRawExportFetch,
    );
    expect(doRawExportFetch).toHaveBeenCalledWith({
      apiUrl: "https://api.example.test",
      getToken,
    });
  });
});
