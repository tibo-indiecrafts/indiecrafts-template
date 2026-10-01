import { describe, expect, it } from "vitest";
import { renderDataRequestNotificationEmail } from "./data-request-notification";

describe("renderDataRequestNotificationEmail", () => {
  const base = {
    requestTypeLabel: "Effacement",
    email: "user@example.com",
  };

  it("fills {{type}} / {{email}} in a custom subject", () => {
    const { subject } = renderDataRequestNotificationEmail({
      ...base,
      subjectTemplate: "RGPD {{type}} — {{email}}",
    });
    expect(subject).toBe("RGPD Effacement — user@example.com");
  });

  it("falls back to a default subject carrying the type", () => {
    const { subject } = renderDataRequestNotificationEmail(base);
    expect(subject).toContain("Effacement");
  });

  it("escapes a hostile message into the HTML body (no raw tag)", () => {
    const { html, text } = renderDataRequestNotificationEmail({
      ...base,
      message: "<script>alert(1)</script>",
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
    // Plain-text part keeps the raw message (no HTML context there).
    expect(text).toContain("<script>alert(1)</script>");
  });

  it("omits the message block when none is given", () => {
    const { html } = renderDataRequestNotificationEmail(base);
    expect(html).not.toContain("Message");
  });

  it("links the admin review screen when a reviewUrl is given", () => {
    const { html, text } = renderDataRequestNotificationEmail({
      ...base,
      reviewUrl: "https://admin.example.com/data-requests",
    });
    expect(html).toContain('href="https://admin.example.com/data-requests"');
    expect(text).toContain("https://admin.example.com/data-requests");
  });

  it("names the admin screen (no button, no Studio) when no reviewUrl is set", () => {
    const { html, text } = renderDataRequestNotificationEmail(base);
    expect(html).not.toContain("Voir la demande</a>");
    expect(html + text).not.toContain("Studio");
    expect(text).toContain("Data requests");
  });
});
