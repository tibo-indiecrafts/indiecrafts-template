import { test } from "node:test";
import assert from "node:assert/strict";
import { planSidebarMigration } from "./sidebar-migrate.mjs";

let n = 0;
const key = () => `k${++n}`;

test("an empty dataset gets the settings, and nothing else", () => {
  const plan = planSidebarMigration([], key);
  assert.deepEqual(
    plan.creates.map((d) => d._id),
    ["sidebarSettings-en", "sidebarSettings-fr"],
  );
  assert.deepEqual(
    plan.creates[0].byType.post.blocks.map((b) => b._type),
    ["module.blog-toc", "module.blog-related"],
  );
  assert.deepEqual(plan.homes, []);
  assert.deepEqual(plan.blogs, []);
});

test("adds the featured block to each home page that lacks one, drafts included", () => {
  const plan = planSidebarMigration(
    [
      { _id: "page-home-en", _type: "page", isHome: true, language: "en", sections: [] },
      { _id: "drafts.page-home-en", _type: "page", isHome: true, language: "en" },
      {
        _id: "page-home-fr",
        _type: "page",
        isHome: true,
        language: "fr",
        sections: [{ _type: "module.blog-featured" }],
      },
    ],
    key,
  );
  assert.deepEqual(
    plan.homes.map((h) => h.id),
    ["page-home-en", "drafts.page-home-en"],
  );
  assert.equal(plan.homes[0].block.layout, "editorial");
  assert.equal(plan.homes[0].block.title, "Notes from the studio");
});

test("re-running does nothing", () => {
  const plan = planSidebarMigration(
    [
      { _id: "sidebarSettings-en", _type: "sidebarSettings" },
      { _id: "sidebarSettings-fr", _type: "sidebarSettings" },
      { _id: "blog", _type: "blog", display: { post: { date: true } } },
    ],
    key,
  );
  assert.deepEqual(plan, { creates: [], homes: [], blogs: [], skipped: [] });
});

test("unsets the old TOC toggle wherever it is set", () => {
  const plan = planSidebarMigration(
    [{ _id: "blog", _type: "blog", display: { post: { tableOfContents: false } } }],
    key,
  );
  assert.deepEqual(plan.blogs, ["blog"]);
});

test("keeps a card the editor had turned off, and covers every locale with a home", () => {
  const plan = planSidebarMigration(
    [
      { _id: "blog", _type: "blog", display: { post: { tableOfContents: false } } },
      { _id: "page-home-de", _type: "page", isHome: true, language: "de", sections: [] },
    ],
    key,
  );
  assert.deepEqual(
    plan.creates.map((d) => d._id),
    ["sidebarSettings-en", "sidebarSettings-fr", "sidebarSettings-de"],
  );
  assert.deepEqual(
    plan.creates[0].byType.post.blocks.map((b) => b._type),
    ["module.blog-related"],
  );
  assert.deepEqual(plan.homes, []);
  assert.deepEqual(plan.skipped, ["page-home-de"]);
});
