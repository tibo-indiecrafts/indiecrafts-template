import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultLocale } from "@/config";
import { escapeHtml } from "@indiecrafts/packages-web-email";
import en from "../../../../../messages/en.json";
import fr from "../../../../../messages/fr.json";

// The route reads the real bundled messages, so a key missing in the default locale fails here.
const MESSAGES = { en, fr } as const;
vi.mock("@indiecrafts/modules-web-blog/lib/route-gate", () => ({
  isCommentsEnabled: () => true,
}));
vi.mock("@indiecrafts/packages-shared-security/rate-limit", () => ({
  rateLimit: async () => ({ ok: true }),
}));
const { getModerationComment, moderateComment } = vi.hoisted(() => ({
  getModerationComment: vi.fn(),
  moderateComment: vi.fn(),
}));
vi.mock("@indiecrafts/modules-web-blog/lib/moderate", () => ({
  isModerationAction: (v: unknown) => v === "approve" || v === "spam" || v === "delete",
  getModerationComment,
  moderateComment,
}));

const { GET, POST } = await import("./route");
const t: Record<string, string> = MESSAGES[defaultLocale as "en" | "fr"].moderation;

const get = (qs: string) =>
  GET(new Request(`https://x.test/api/comments/moderate?${qs}`));
const post = (body: Record<string, string>) =>
  POST(
    new Request("https://x.test/api/comments/moderate", {
      method: "POST",
      body: new URLSearchParams(body),
    }),
  );

beforeEach(() => vi.clearAllMocks());

describe("comment moderation page — default-locale copy from messages", () => {
  it("both locales define every moderation key", () => {
    expect(Object.keys(fr.moderation).sort()).toEqual(Object.keys(en.moderation).sort());
  });

  it("400s an unknown action", async () => {
    const res = await get("token=x&action=hack");
    expect(res.status).toBe(400);
    expect(await res.text()).toContain(escapeHtml(t.unknownAction!));
  });

  it("410s an unknown or used token, with a Studio link", async () => {
    getModerationComment.mockResolvedValue(null);
    const res = await get("token=x&action=approve");
    expect(res.status).toBe(410);
    const html = await res.text();
    expect(html).toContain(escapeHtml(t.expiredBody!));
    expect(html).toContain(`lang="${defaultLocale}"`);
    expect(html).toContain("/studio");
  });

  it("GET renders a confirm form (read-only) and warns before a delete", async () => {
    getModerationComment.mockResolvedValue({
      authorName: "<b>Eve</b>",
      body: "Hi",
      post: "Post",
    });
    const html = await (await get("token=tok&action=delete")).text();
    expect(html).toContain(escapeHtml(t.delete!));
    expect(html).toContain(escapeHtml(t.deleteWarning!));
    expect(html).toContain('<form method="post"');
    expect(html).toContain("&lt;b&gt;Eve&lt;/b&gt;");
    expect(moderateComment).not.toHaveBeenCalled();
  });

  it("POST applies the action and confirms it", async () => {
    moderateComment.mockResolvedValue("ok");
    const html = await (await post({ token: "tok", action: "approve" })).text();
    expect(moderateComment).toHaveBeenCalledWith("tok", "approve");
    expect(html).toContain(escapeHtml(t.approveDone!));
  });
});
