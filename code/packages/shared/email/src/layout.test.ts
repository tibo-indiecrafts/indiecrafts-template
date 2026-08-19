import { describe, expect, it } from "vitest";
import { escapeHtml, renderEmailLayout } from "./layout";

describe("escapeHtml", () => {
  it("neutralizes angle brackets, quotes, and ampersands", () => {
    expect(escapeHtml(`<script>"&'`)).toBe("&lt;script&gt;&quot;&amp;&#39;");
  });
});

describe("renderEmailLayout", () => {
  it("wraps content in a full document with the title + preheader", () => {
    const html = renderEmailLayout({
      title: "Hello",
      preheader: "Peek",
      contentHtml: "<p>Body</p>",
    });
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Hello");
    expect(html).toContain("Peek");
    expect(html).toContain("<p>Body</p>");
  });
});
