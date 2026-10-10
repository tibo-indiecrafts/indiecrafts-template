import { describe, expect, it } from "vitest";
import {
  BLOG_MODULE_TYPES,
  BLOG_SECTION_TYPES,
  BLOG_SIDEBAR_TYPES,
  blogModuleSchemas,
} from "./index";

describe("blog block lists", () => {
  const schemas = blogModuleSchemas.map((s) => s.name).sort();

  it("every blog block has a schema, and every schema is listed", () => {
    const listed = new Set<string>([
      ...BLOG_MODULE_TYPES,
      ...BLOG_SIDEBAR_TYPES,
    ]);
    expect(schemas).toEqual([...listed].sort());
  });

  it("site pages hold only blog layout blocks, never the post's own chrome", () => {
    for (const type of BLOG_SECTION_TYPES)
      expect(BLOG_MODULE_TYPES).toContain(type);
    expect(BLOG_SECTION_TYPES).not.toContain("module.blog-post-content");
    expect(BLOG_SECTION_TYPES).not.toContain("module.blog-index");
  });

  it("the sidebar-only blocks stay out of the blog's page layouts", () => {
    expect(BLOG_MODULE_TYPES).not.toContain("module.blog-toc");
    expect(BLOG_MODULE_TYPES).not.toContain("module.blog-related");
  });
});
