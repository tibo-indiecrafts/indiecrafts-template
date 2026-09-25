import { test } from "node:test";
import assert from "node:assert/strict";
import { findTypeAware } from "./lint-no-types.mjs";

test("passes for an AST-only config (our current setup)", () => {
  const cfg = `import nextTs from "eslint-config-next/typescript";
    export default [{ rules: { "@typescript-eslint/no-unused-vars": "warn" } }];`;
  assert.deepEqual(findTypeAware("eslint.config.mjs", cfg), []);
});

test("flags parserOptions.project (the type graph)", () => {
  const cfg = `languageOptions: { parserOptions: { project: "./tsconfig.json" } }`;
  assert.equal(findTypeAware("x", cfg).length, 1);
});

test("flags projectService", () => {
  const hits = findTypeAware("x", "parserOptions: { projectService: true }");
  assert.equal(hits.length, 1);
  assert.match(hits[0], /projectService/);
});

test("flags a *-type-checked preset", () => {
  assert.match(
    findTypeAware("x", "...tseslint.configs.recommendedTypeChecked,")[0],
    /type-aware/,
  );
});
