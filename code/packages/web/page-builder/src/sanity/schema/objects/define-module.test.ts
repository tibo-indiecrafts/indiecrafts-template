import { describe, expect, it } from "vitest";
import { defineModule } from "./define-module";

describe("defineModule default preview", () => {
  const schema = defineModule({ name: "module.fixture", title: "Fixture" });
  const prepare = schema.preview!.prepare as (value: { title?: string }) => {
    title: string;
    subtitle: string;
  };

  it("uses the resolved title when present", () => {
    expect(prepare({ title: "My Title" })).toEqual({
      title: "My Title",
      subtitle: "module.fixture",
    });
  });

  it("falls back to (name) when the title is absent", () => {
    expect(prepare({})).toEqual({
      title: "(module.fixture)",
      subtitle: "module.fixture",
    });
  });
});
