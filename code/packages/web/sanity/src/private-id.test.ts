import { describe, expect, it } from "vitest";
import { privateId } from "./private-id";

describe("privateId", () => {
  it("prefixes the type and a uuid, so the id has a dot (hidden from anonymous reads)", () => {
    expect(privateId("contactMessage")).toMatch(
      /^private\.contactMessage\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("returns a new id each call", () => {
    expect(privateId("comment")).not.toBe(privateId("comment"));
  });
});
