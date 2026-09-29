import { afterEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { policyVersion } from "@/config";
import { useEffectiveLegalVersion } from "./stores";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function Probe() {
  return <p>{useEffectiveLegalVersion() ?? "loading"}</p>;
}

async function render() {
  const el = document.createElement("div");
  await act(async () => createRoot(el).render(<Probe />));
  return el;
}

afterEach(() => vi.restoreAllMocks());

describe("useEffectiveLegalVersion", () => {
  // An Accept before the live version arrives would record the static fallback, and
  // the banner would come back on the next load. So: no version until the fetch settles.
  it("returns nothing while the website's version is loading", async () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));
    expect((await render()).textContent).toBe("loading");
  });

  it("returns the website's live version once fetched", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ version: "live-7" }), { status: 200 }),
    );
    expect((await render()).textContent).toBe("live-7");
  });

  it("falls back to the static policyVersion when the fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 500 }));
    expect((await render()).textContent).toBe(policyVersion);
  });
});
