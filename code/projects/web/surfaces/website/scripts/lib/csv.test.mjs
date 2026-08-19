import assert from "node:assert/strict";
import { test } from "node:test";

import { csvCell } from "./csv.mjs";

test("passes plain values through unquoted", () => {
  assert.equal(csvCell("hello"), "hello");
  assert.equal(csvCell(42), "42");
  assert.equal(csvCell(null), "");
  assert.equal(csvCell(undefined), "");
});

test("RFC 4180 quotes commas, quotes, and newlines", () => {
  assert.equal(csvCell("a,b"), '"a,b"');
  assert.equal(csvCell('he said "hi"'), '"he said ""hi"""');
  assert.equal(csvCell("line1\nline2"), '"line1\nline2"');
});

test("neutralises formula injection", () => {
  // Leading = + - @ (and tab/CR) are prefixed with a quote so a spreadsheet
  // treats them as text, not a formula.
  assert.equal(csvCell("=1+1"), "'=1+1");
  assert.equal(csvCell("=HYPERLINK(http://x)"), "'=HYPERLINK(http://x)");
  // a formula that also embeds a quote → guarded AND RFC-quoted
  assert.equal(csvCell('=HYPERLINK("http://x")'), '"\'=HYPERLINK(""http://x"")"');
  assert.equal(csvCell("+cmd"), "'+cmd");
  assert.equal(csvCell("-2"), "'-2");
  assert.equal(csvCell("@SUM(A1)"), "'@SUM(A1)");
});

test("a formula value that also needs quoting stays valid", () => {
  // starts with '=' AND contains a comma → guarded then quoted
  assert.equal(csvCell("=1,2"), '"\'=1,2"');
});
