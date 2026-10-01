import { env } from "cloudflare:test";
import { describe, expect, it, vi } from "vitest";
import type { Env } from "../index";
import {
  dueAt,
  handleDataRequestDetail,
  handleDataRequestStatus,
} from "./status";

const E = env as unknown as Env;

async function seed(status = "new", locale = "fr") {
  const r = await E.MAIN_DB!.prepare(
    "INSERT INTO data_requests (request_type, email, message, status, submitted_at, locale) VALUES ('access', 'jane@example.com', 'hi', ?, '2026-10-01T08:30:00.000Z', ?) RETURNING id",
  )
    .bind(status, locale)
    .first<{ id: number }>();
  return r!.id;
}

const post = (id: number, body: unknown, bearer = "test-token") =>
  new Request(`https://x/v1/data-requests/${id}/status`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${bearer}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

const get = (id: number) =>
  new Request(`https://x/v1/data-requests/${id}`, {
    headers: { authorization: "Bearer test-token" },
  });

describe("dueAt", () => {
  it("adds one calendar month", () => {
    expect(dueAt("2026-10-01T08:30:00.000Z")).toBe("2026-11-01T08:30:00.000Z");
  });

  it("clamps to the last day of a shorter month", () => {
    expect(dueAt("2026-01-31T10:00:00.000Z")).toBe("2026-02-28T10:00:00.000Z");
  });
});

describe("POST /v1/data-requests/:id/status", () => {
  it("401 without the bearer", async () => {
    const id = await seed();
    const res = await handleDataRequestStatus(post(id, {}, "nope"), E, id);
    expect(res.status).toBe(401);
  });

  it("starts a new request and records an event", async () => {
    const id = await seed();
    const res = await handleDataRequestStatus(
      post(id, { status: "in-progress", from: "new", by: "user_a" }),
      E,
      id,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      status: "in-progress",
      notified: false,
    });
    const ev = await E.MAIN_DB!.prepare(
      "SELECT status, actor, notified FROM data_request_events WHERE request_id = ?",
    )
      .bind(id)
      .first();
    expect(ev).toEqual({ status: "in-progress", actor: "user_a", notified: 0 });
  });

  it("closes with an email in the row's locale and marks the event notified", async () => {
    const id = await seed("in-progress", "fr");
    const sendClosed = vi.fn(async () => true);
    const res = await handleDataRequestStatus(
      post(id, {
        status: "done",
        from: "in-progress",
        note: "Fait.",
        notify: true,
        by: "user_a",
      }),
      E,
      id,
      { sendClosed },
    );
    expect(await res.json()).toEqual({
      ok: true,
      status: "done",
      notified: true,
    });
    expect(sendClosed).toHaveBeenCalledWith(E, {
      to: "jane@example.com",
      id,
      outcome: "done",
      note: "Fait.",
      locale: "fr",
    });
    const ev = await E.MAIN_DB!.prepare(
      "SELECT notified, note FROM data_request_events WHERE request_id = ?",
    )
      .bind(id)
      .first();
    expect(ev).toEqual({ notified: 1, note: "Fait." });
  });

  it("keeps the change when the email fails (notified: false)", async () => {
    const id = await seed();
    const sendClosed = vi.fn(async () => {
      throw new Error("resend 500");
    });
    const res = await handleDataRequestStatus(
      post(id, {
        status: "rejected",
        from: "new",
        note: "No.",
        notify: true,
        by: "u",
      }),
      E,
      id,
      { sendClosed },
    );
    expect(await res.json()).toEqual({
      ok: true,
      status: "rejected",
      notified: false,
    });
    const row = await E.MAIN_DB!.prepare(
      "SELECT status FROM data_requests WHERE id = ?",
    )
      .bind(id)
      .first<{ status: string }>();
    expect(row?.status).toBe("rejected");
  });

  it("note_required when emailing a closing without a note", async () => {
    const id = await seed();
    const res = await handleDataRequestStatus(
      post(id, {
        status: "done",
        from: "new",
        note: " ",
        notify: true,
        by: "u",
      }),
      E,
      id,
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "note_required" });
  });

  it("not_allowed from a closed status (no reopen)", async () => {
    const id = await seed("done");
    const res = await handleDataRequestStatus(
      post(id, { status: "in-progress", from: "done", by: "u" }),
      E,
      id,
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ error: "not_allowed" });
  });

  it("changed when another admin moved it first (stale from), and no email", async () => {
    const id = await seed("in-progress");
    const sendClosed = vi.fn(async () => true);
    const res = await handleDataRequestStatus(
      post(id, {
        status: "done",
        from: "new",
        note: "x",
        notify: true,
        by: "u",
      }),
      E,
      id,
      { sendClosed },
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ error: "changed" });
    expect(sendClosed).not.toHaveBeenCalled();
  });

  it.each([
    [{ status: "nope", from: "new", by: "u" }],
    [{ status: "done", from: "new" }],
    [{ status: "done", from: "new", by: "u", note: "x".repeat(4001) }],
  ])("invalid body %#", async (body) => {
    const id = await seed();
    const res = await handleDataRequestStatus(post(id, body), E, id);
    expect(res.status).toBe(400);
  });

  it("not_found for an unknown id", async () => {
    const res = await handleDataRequestStatus(
      post(999999, { status: "done", from: "new", by: "u" }),
      E,
      999999,
    );
    expect(res.status).toBe(404);
  });
});

describe("GET /v1/data-requests/:id", () => {
  it("returns the request, its due date and its history", async () => {
    const id = await seed();
    await handleDataRequestStatus(
      post(id, { status: "in-progress", from: "new", by: "user_a" }),
      E,
      id,
    );
    const res = await handleDataRequestDetail(get(id), E, id);
    expect(res.status).toBe(200);
    const { data } = (await res.json()) as {
      data: Record<string, unknown> & { events: unknown[] };
    };
    expect(data).toMatchObject({
      id,
      email: "jane@example.com",
      status: "in-progress",
      due_at: "2026-11-01T08:30:00.000Z",
    });
    expect(data.events).toEqual([
      expect.objectContaining({
        status: "in-progress",
        actor: "user_a",
        notified: false,
      }),
    ]);
  });

  it("404 for an unknown id", async () => {
    const res = await handleDataRequestDetail(get(999999), E, 999999);
    expect(res.status).toBe(404);
  });
});
