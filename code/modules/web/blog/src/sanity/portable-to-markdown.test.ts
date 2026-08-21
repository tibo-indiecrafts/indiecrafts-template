import { describe, expect, it, vi } from "vitest";
import type { PortableTextBlock } from "@portabletext/react";

const { warn } = vi.hoisted(() => ({ warn: vi.fn() }));
vi.mock("@indiecrafts/packages-shared-logger", () => ({ logger: { warn, error: vi.fn() } }));

const { portableTextToMarkdown } = await import("./portable-to-markdown");

// The serializer takes loose Sanity data; one typed cast keeps the fixtures terse.
const run = (blocks: unknown[]) =>
  portableTextToMarkdown(blocks as PortableTextBlock[]);
const block = (props: Record<string, unknown>) => ({
  _type: "block",
  markDefs: [],
  children: [],
  ...props,
});
const span = (text: string, marks: string[] = []) => ({
  _type: "span",
  text,
  marks,
});

describe("portableTextToMarkdown", () => {
  it("maps heading styles and blockquote", () => {
    expect(
      run([
        block({ style: "h1", children: [span("A")] }),
        block({ style: "h3", children: [span("B")] }),
        block({ style: "blockquote", children: [span("C")] }),
      ]),
    ).toBe("# A\n\n### B\n\n> C");
  });

  it("a default block is a plain paragraph", () => {
    expect(run([block({ children: [span("hi")] })])).toBe("hi");
  });

  it("list items take precedence over style", () => {
    expect(
      run([block({ listItem: "bullet", style: "h1", children: [span("x")] })]),
    ).toBe("- x");
    expect(run([block({ listItem: "number", children: [span("y")] })])).toBe(
      "1. y",
    );
  });

  it("renders an image with a capped width, or nothing when the asset is missing", () => {
    expect(
      run([{ _type: "image", alt: "cat", asset: { url: "http://x/i.jpg" } }]),
    ).toBe("![cat](http://x/i.jpg?w=1200&auto=format&fit=max&q=75)");
    expect(run([{ _type: "image", alt: "cat" }])).toBe("");
  });

  it("skips an unknown block type and logs it once", () => {
    expect(run([{ _type: "mystery" }])).toBe("");
    expect(warn).toHaveBeenCalledWith(
      "portable-to-markdown: skipping unknown block type",
      { type: "mystery" },
    );
  });

  it("applies strong/em/code marks", () => {
    expect(run([block({ children: [span("b", ["strong"])] })])).toBe("**b**");
    expect(run([block({ children: [span("i", ["em"])] })])).toBe("_i_");
    expect(run([block({ children: [span("c", ["code"])] })])).toBe("`c`");
  });

  it("resolves a link markDef by key", () => {
    expect(
      run([
        block({
          markDefs: [{ _key: "l1", _type: "link", href: "http://x" }],
          children: [span("link", ["l1"])],
        }),
      ]),
    ).toBe("[link](http://x)");
  });

  it("ignores a non-span child", () => {
    expect(run([block({ children: [{ _type: "other", text: "no" }] })])).toBe(
      "",
    );
  });
});
