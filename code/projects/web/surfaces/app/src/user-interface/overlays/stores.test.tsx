import { afterEach, describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { legalStore, useRecord } from "./stores";

function Probe() {
  const record = useRecord(legalStore);
  return <p>{record === undefined ? "unread" : JSON.stringify(record)}</p>;
}

afterEach(() => localStorage.clear());

describe("useRecord", () => {
  // The server has no localStorage, so the server snapshot must not read it: a stored
  // record at hydration would hide a banner the server HTML already rendered, and React
  // 19 leaves that stale DOM in place.
  it("reports 'not read yet' on the server render, even with a stored record", () => {
    legalStore.save({ version: "2026-01", t: 1 });
    expect(renderToString(<Probe />)).toContain("unread");
  });
});
