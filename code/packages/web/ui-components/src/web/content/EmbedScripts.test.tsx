import { afterEach, describe, expect, it } from "vitest";
import { runScripts } from "./EmbedScripts";

// A detached parent: happy-dom (like a browser) fetches nothing until a script is in the
// document, so the test drives load/error itself.
let parent = document.createElement("div");
const inserted = () =>
  [...parent.querySelectorAll("script")].map((s) => ({
    src: s.getAttribute("src"),
    code: s.textContent,
    nonce: s.nonce,
    async: s.async,
    uid: s.getAttribute("data-uid"),
    onload: s.getAttribute("onload"),
  }));
const tick = () => new Promise((r) => setTimeout(r, 0));

afterEach(() => {
  parent = document.createElement("div");
});

describe("runScripts", () => {
  it("inserts each script with the nonce and its attributes, minus on* handlers", async () => {
    await runScripts(
      [{ attrs: { "data-uid": "42", onload: "x()" }, code: "window.qaA = 1;" }],
      "n0nce",
      parent,
    );
    expect(inserted()).toEqual([
      {
        src: null,
        code: "window.qaA = 1;",
        nonce: "n0nce",
        async: false,
        uid: "42",
        onload: null,
      },
    ]);
  });

  it("keeps order: an inline script waits for the external one before it to load", async () => {
    const done = runScripts(
      [
        { attrs: { src: "https://cdn.example/lib.js" }, code: "" },
        { attrs: {}, code: "window.qaInit = 1;" },
      ],
      "n0nce",
      parent,
    );
    await tick();
    expect(inserted().map((s) => s.src ?? s.code)).toEqual([
      "https://cdn.example/lib.js",
    ]);
    parent.querySelector("script")!.dispatchEvent(new Event("load"));
    await done;
    expect(inserted().map((s) => s.src ?? s.code)).toEqual([
      "https://cdn.example/lib.js",
      "window.qaInit = 1;",
    ]);
  });

  it("goes on after an external script fails to load", async () => {
    const done = runScripts(
      [
        { attrs: { src: "https://cdn.example/down.js" }, code: "" },
        { attrs: {}, code: "window.qaAfter = 1;" },
      ],
      undefined,
      parent,
    );
    await tick();
    parent.querySelector("script")!.dispatchEvent(new Event("error"));
    await done;
    expect(inserted()).toHaveLength(2);
  });

  it("returns a cleanup that removes what it inserted", async () => {
    const cleanup = await runScripts(
      [{ attrs: {}, code: "window.qaB = 1;" }],
      "n",
      parent,
    );
    cleanup();
    expect(inserted()).toEqual([]);
  });
});
