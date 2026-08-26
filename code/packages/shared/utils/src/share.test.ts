import { describe, expect, it } from "vitest";
import { shareTargets } from "./share";

describe("shareTargets", () => {
  it("returns X, LinkedIn, Facebook targets with URL-encoded url + title", () => {
    const targets = shareTargets("https://x.dev/a b", "Hi & bye");
    expect(targets.map((t) => t.key)).toEqual(["x", "linkedin", "facebook"]);

    const x = targets.find((t) => t.key === "x")!;
    expect(x.href).toContain("https%3A%2F%2Fx.dev%2Fa%20b"); // url encoded
    expect(x.href).toContain("Hi%20%26%20bye"); // title encoded

    expect(targets.find((t) => t.key === "linkedin")!.href).toContain(
      "share-offsite/?url=",
    );
    expect(targets.find((t) => t.key === "facebook")!.href).toContain(
      "sharer.php?u=",
    );
  });
});
