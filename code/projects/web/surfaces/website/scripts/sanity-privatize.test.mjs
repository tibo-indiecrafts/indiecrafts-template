import { test } from "node:test";
import assert from "node:assert/strict";
import { planMoves, privateIdFor } from "./sanity-privatize.mjs";

test("privateIdFor: a random id gets the private prefix and its type", () => {
  assert.equal(
    privateIdFor({ _id: "a1b2", _type: "contactMessage" }),
    "private.contactMessage.a1b2",
  );
});

test("privateIdFor: a leading `<type>.` is dropped, so seeded ids match the seed", () => {
  assert.equal(
    privateIdFor({ _id: "comment.demo-approved", _type: "comment" }),
    "private.comment.demo-approved",
  );
});

test("privateIdFor: drafts keep their prefix; the singleton gets its fixed id", () => {
  assert.equal(
    privateIdFor({ _id: "drafts.x9", _type: "waitlistEntry" }),
    "drafts.private.waitlistEntry.x9",
  );
  assert.equal(
    privateIdFor({ _id: "emailStrings", _type: "emailStrings" }),
    "private.emailStrings",
  );
  assert.equal(
    privateIdFor({ _id: "drafts.emailStrings", _type: "emailStrings" }),
    "drafts.private.emailStrings",
  );
});

test("privateIdFor: an id that is private already is left alone (safe to re-run)", () => {
  assert.equal(privateIdFor({ _id: "private.comment.c1", _type: "comment" }), null);
  assert.equal(
    privateIdFor({ _id: "drafts.private.emailStrings", _type: "emailStrings" }),
    null,
  );
});

test("planMoves: moves a reply and its parent, and rewrites the reply's parent reference", () => {
  const parent = { _id: "c1", _type: "comment", _rev: "r1", _updatedAt: "t" };
  const reply = {
    _id: "c2",
    _type: "comment",
    parent: { _type: "reference", _ref: "c1" },
  };
  const done = { _id: "private.comment.c3", _type: "comment" };
  const { creates, patches, deletes } = planMoves([parent, reply, done]);

  assert.deepEqual(
    creates.map((d) => d._id),
    ["private.comment.c1", "private.comment.c2"],
  );
  assert.equal(creates[1].parent._ref, "private.comment.c1");
  assert.equal("_rev" in creates[0], false); // system fields are the API's to set
  assert.deepEqual(deletes, ["c1", "c2"]);
  assert.deepEqual(patches, []);
});

test("planMoves: a draft's references point at the moved published id", () => {
  const reply = {
    _id: "drafts.c2",
    _type: "comment",
    parent: { _type: "reference", _ref: "c1" },
  };
  const { creates } = planMoves([{ _id: "c1", _type: "comment" }, reply]);
  assert.equal(creates[1]._id, "drafts.private.comment.c2");
  assert.equal(creates[1].parent._ref, "private.comment.c1");
});

test("planMoves: another document that references a moved id is rewritten in place", () => {
  const other = {
    _id: "note",
    _type: "note",
    see: [{ _type: "reference", _ref: "w1", _key: "k" }],
  };
  const { patches } = planMoves([{ _id: "w1", _type: "waitlistEntry" }], [other]);
  assert.deepEqual(patches, [
    {
      ...other,
      see: [{ _type: "reference", _ref: "private.waitlistEntry.w1", _key: "k" }],
    },
  ]);
});
