import { describe, expect, it, vi } from "vitest";
import type {
  AnyModule,
  Post,
  PostListItem,
} from "@indiecrafts/modules-web-blog/sanity/types";

vi.mock(
  "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer",
  () => ({
    Modules: ({ modules }: { modules: AnyModule[] }) =>
      modules.map((m) => m._type).join(","),
  }),
);

const { postSidebar } = await import("./post-sidebar");

const cards = [
  { _type: "module.blog-toc", _key: "t" },
  { _type: "module.blog-related", _key: "r" },
] as AnyModule[];
const withHeadings = {
  _id: "p",
  headings: [{ style: "h2", text: "A" }],
} as Post;
const related = [{ _id: "q" }] as PostListItem[];
const shown = (s: ReturnType<typeof postSidebar>) =>
  (
    s.aside as { props: { modules: AnyModule[] } } | undefined
  )?.props.modules.map((m) => m._type);

describe("postSidebar", () => {
  it("shows both cards, and the phone TOC, when the post has headings and related posts", () => {
    const s = postSidebar(cards, withHeadings, "en", related);
    expect(shown(s)).toEqual(["module.blog-toc", "module.blog-related"]);
    expect(s.mobileToc).toBe(true);
  });

  it("drops the TOC card for a post with no heading", () => {
    const s = postSidebar(cards, { _id: "p" } as Post, "en", related);
    expect(shown(s)).toEqual(["module.blog-related"]);
    expect(s.mobileToc).toBe(false);
  });

  it("leaves no sidebar when every card would render nothing", () => {
    const s = postSidebar(cards, { _id: "p" } as Post, "en", []);
    expect(s.aside).toBeUndefined();
  });
});
