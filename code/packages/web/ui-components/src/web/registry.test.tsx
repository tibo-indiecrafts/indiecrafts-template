import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { BlockModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { portableComponents } from "./portable-text-components";
import { renderBlock } from "./registry";

const stats = {
  _type: "module.stat-list",
  _key: "s",
  stats: [{ _key: "a", value: "42", label: "Answers" }],
} as BlockModule;

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);

describe("renderBlock", () => {
  it("renders a known block", () => {
    expect(html(renderBlock(stats, portableComponents))).toContain("Answers");
  });

  it("renders nothing for a block the editor hid", () => {
    expect(
      renderBlock({ ...stats, hidden: true }, portableComponents),
    ).toBeNull();
  });

  it("skips an unknown block instead of throwing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const gone = {
      _type: "module.removed",
      _key: "x",
    } as unknown as BlockModule;
    expect(renderBlock(gone, portableComponents)).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});

describe("portableComponents inline blocks", () => {
  const inline = portableComponents.types!["module.stat-list"] as (p: {
    value: unknown;
  }) => React.ReactNode;

  it("renders an inline block", () => {
    expect(html(inline({ value: stats }))).toContain("Answers");
  });

  it("renders nothing for an inline block the editor hid", () => {
    expect(inline({ value: { ...stats, hidden: true } })).toBeNull();
  });
});
