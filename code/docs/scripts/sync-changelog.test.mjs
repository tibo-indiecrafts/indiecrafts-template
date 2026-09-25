#!/usr/bin/env node
// Self-check: node scripts/sync-changelog.test.mjs  (asserts, no framework).
import assert from "node:assert/strict";
import {
  neutralizeRelativeLinks,
  protectVueBraces,
} from "./sync-changelog.mjs";

// relative links are stripped to their text
assert.equal(
  neutralizeRelativeLinks("see [the docs](../docs/x.md)"),
  "see the docs",
);
assert.equal(
  neutralizeRelativeLinks("[a](./a) and [b](../../b.md)"),
  "a and b",
);

// http(s), in-site absolute, and anchors are KEPT
const keep = "[ext](https://x.io) [in](/packages/README) [a](#top)";
assert.equal(neutralizeRelativeLinks(keep), keep);

// mixed line
assert.equal(
  neutralizeRelativeLinks("[gone](../y) then [kept](/z)"),
  "gone then [kept](/z)",
);

// braces in inline code are wrapped in <code v-pre>; plain code is untouched
assert.equal(
  protectVueBraces("a `{{email}}` subject"),
  "a <code v-pre>{{email}}</code> subject",
);
assert.equal(protectVueBraces("`plain code`"), "`plain code`");

console.log("ok — sync-changelog neutralizeRelativeLinks + protectVueBraces");
