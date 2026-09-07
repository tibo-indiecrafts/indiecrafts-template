import { describe, expect, it } from "vitest";
import { moduleSchemas, MODULE_TYPES } from "./index";

describe("module registry", () => {
  it("moduleSchemas and MODULE_TYPES list the same _type literals", () => {
    const schemaNames = moduleSchemas.map((s) => s.name).sort();
    expect(schemaNames).toEqual([...MODULE_TYPES].sort());
  });
});
