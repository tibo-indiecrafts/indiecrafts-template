import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createFormatter, createTranslator } from "next-intl";
import messages from "../../../../messages/en.json";

// The four read-only data pages (churn · sessions · security · system), called as plain
// async functions and their JSX rendered. Mocks the boundaries only: next-intl's server
// API (a real translator over en.json), the api (`fetch`), Clerk's email lookup, and the
// sessions table (a client component with its own test).
const { fetchMock, fetchEmails, requireAdminPage } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  fetchEmails: vi.fn(async () => ({}) as Record<string, string>),
  requireAdminPage: vi.fn(async (_locale: string) => {}),
}));
vi.stubGlobal("fetch", fetchMock);
vi.mock("@/lib/require-admin", () => ({ requireAdminPage }));
vi.mock("next-intl/server", () => ({
  setRequestLocale: () => {},
  getTranslations: async (arg: string | { namespace: string }) =>
    createTranslator({
      locale: "en",
      messages,
      namespace: (typeof arg === "string" ? arg : arg.namespace) as never,
    }),
  getFormatter: async () => createFormatter({ locale: "en", timeZone: "UTC" }),
}));
vi.mock("@/i18n/routing", () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/lib/clerk-users", () => ({ fetchEmails }));
vi.mock("./sessions-table", () => ({
  SessionsTable: ({ rows, emails }: { rows: unknown[]; emails: unknown }) => (
    <p>
      {rows.length} rows · {JSON.stringify(emails)}
    </p>
  ),
}));

const params = Promise.resolve({ locale: "en" });
const API = "https://api.x.dev";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

type Page = (p: { params: typeof params }) => Promise<React.ReactElement>;
// Imported once, at collect time — a fresh import of the UI graph per test is slow.
const pages: Record<string, Page> = {
  "./churn/page": (await import("./churn/page")).default,
  "./sessions/page": (await import("./sessions/page")).default,
  "./security/page": (await import("./security/page")).default,
};

async function page(path: string) {
  let Page = pages[path];
  if (!Page) {
    // The system page reads its env at module load, so it is imported fresh per test.
    vi.resetModules();
    Page = ((await import(path)) as { default: Page }).default;
  }
  render(await Page({ params }));
}

function configureApi() {
  vi.stubEnv("API_URL", API);
  vi.stubEnv("APP_API_TOKEN", "t0ken");
}

beforeEach(() => {
  // Unset by default; each test opts in.
  for (const k of [
    "API_URL",
    "APP_API_TOKEN",
    "WEBSITE_URL",
    "APP_URL",
    "WORKERS_URL",
    "CLOUDFLARE_SECURITY_URL",
  ])
    vi.stubEnv(k, "");
});
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

const bearer = expect.objectContaining({
  headers: expect.objectContaining({ authorization: "Bearer t0ken" }),
});

describe("churn page", () => {
  it("shows the unavailable alert and never calls the api when unconfigured", async () => {
    await page("./churn/page");
    expect(screen.getByRole("alert").textContent).toMatch(/Could not load churn data/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the alert, not empty tables, when the api errors", async () => {
    configureApi();
    fetchMock.mockResolvedValueOnce(json({}, 500));
    await page("./churn/page");
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("reads /v1/churn with the server bearer and labels unknown reason codes", async () => {
    configureApi();
    fetchMock.mockResolvedValueOnce(
      json({
        total: 7,
        byDay: [{ date: "2026-10-01", count: 7 }],
        byReason: [
          { reason: "too_expensive", count: 4 },
          { reason: "<script>", count: 3 },
        ],
        recentFeedback: [
          { deleted_at: "2026-10-01", reason: null, feedback: null, competitor: "Acme" },
        ],
      }),
    );
    await page("./churn/page");
    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/churn`, bearer);
    expect(screen.getByText("7", { selector: "p" })).toBeTruthy();
    expect(screen.getByRole("cell", { name: "Too expensive" })).toBeTruthy();
    // A code outside CHURN_REASON_CODES (and a null one) renders as "Unknown", never raw.
    expect(screen.getAllByRole("cell", { name: "Unknown" })).toHaveLength(2);
    expect(screen.queryByText("<script>")).toBeNull();
    expect(screen.getByRole("cell", { name: "—" })).toBeTruthy();
  });
});

describe("sessions page", () => {
  it("shows the empty state and never calls the api when unconfigured", async () => {
    await page("./sessions/page");
    expect(screen.getByText("No sessions recorded yet.")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reads the last 100 sign-ins with the bearer and resolves their emails", async () => {
    configureApi();
    fetchMock.mockResolvedValueOnce(
      json({ data: [{ ts: "2026-10-01T10:00:00Z", user_id: "user_a" }] }),
    );
    fetchEmails.mockResolvedValueOnce({ user_a: "a@x.dev" });
    await page("./sessions/page");
    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/sessions?limit=100`, bearer);
    expect(fetchEmails).toHaveBeenCalledWith(["user_a"]);
    expect(screen.getByText(/1 rows · \{"user_a":"a@x.dev"\}/)).toBeTruthy();
  });
});

describe("security page", () => {
  it("shows the load-error alert (not 'all clear') when unconfigured", async () => {
    await page("./security/page");
    expect(screen.getByRole("alert").textContent).toMatch(
      /Could not load the incident feed/,
    );
    expect(screen.queryByText("No security incidents recorded.")).toBeNull();
    expect(screen.getByText(/Set CLOUDFLARE_SECURITY_URL/)).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the load-error alert when the api errors", async () => {
    configureApi();
    fetchMock.mockResolvedValueOnce(json({}, 503));
    await page("./security/page");
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("shows the empty state for a healthy, empty feed", async () => {
    configureApi();
    fetchMock.mockResolvedValueOnce(json({ data: [] }));
    await page("./security/page");
    expect(fetchMock).toHaveBeenCalledWith(`${API}/v1/security?limit=100`, bearer);
    expect(screen.getByText("No security incidents recorded.")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("labels known event types and severities, shows unknown ones raw", async () => {
    configureApi();
    vi.stubEnv("CLOUDFLARE_SECURITY_URL", "https://dash.cloudflare.com/x/security");
    fetchMock.mockResolvedValueOnce(
      json({
        data: [
          {
            ts: "2026-10-01T10:00:00Z",
            event_type: "failed_login",
            severity: "high",
            surface: "app",
            user_id: null,
            country: "FR",
            description: null,
          },
          {
            ts: "2026-10-01T11:00:00Z",
            event_type: "new_thing",
            severity: "weird",
            surface: null,
            user_id: "user_b",
            country: null,
            description: "d",
          },
        ],
      }),
    );
    await page("./security/page");
    expect(screen.getByRole("cell", { name: "Failed sign-in" })).toBeTruthy();
    expect(screen.getByText("High")).toBeTruthy();
    expect(screen.getByRole("cell", { name: "new_thing" })).toBeTruthy();
    expect(screen.getByText("weird")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /Open Cloudflare Security Events/ }),
    ).toBeTruthy();
  });
});

// A fresh import of the system page graph is slow under a parallel run.
describe("system page", { timeout: 30_000 }, () => {
  it("marks every surface and worker 'Not configured' and calls nothing when unset", async () => {
    await page("./system/page");
    // website · app · api · workers
    expect(screen.getAllByText("Not configured")).toHaveLength(4);
    expect(screen.getByText("API unreachable or not configured")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the bearer to the api /health only, never to public surfaces", async () => {
    configureApi();
    vi.stubEnv("WEBSITE_URL", "https://www.x.dev");
    fetchMock.mockImplementation(async (url: string) =>
      url.endsWith("/api/version")
        ? json({ version: "1.2.3", commit: "abc" })
        : url.endsWith("/health")
          ? json({ version: "9.9.9", commit: "def", db: { audit: "ok", main: "error" } })
          : json({}, 500),
    );
    await page("./system/page");
    const health = fetchMock.mock.calls.find(([u]) => u === `${API}/health`);
    expect(health?.[1]).toEqual(bearer);
    const version = fetchMock.mock.calls.find(
      ([u]) => u === "https://www.x.dev/api/version",
    );
    expect(JSON.stringify(version?.[1])).not.toMatch(/t0ken/);
    expect(screen.getByRole("cell", { name: "1.2.3" })).toBeTruthy();
    expect(screen.getByText("error")).toBeTruthy();
  });
});

describe("the page gate", () => {
  // Real next-intl `redirect` throws; the gate's own test covers who gets redirected.
  const denied = () => requireAdminPage.mockRejectedValueOnce(new Error("NEXT_REDIRECT"));

  it.each(["./churn/page", "./sessions/page", "./security/page", "./system/page"])(
    "%s never reads its data without an admin session",
    async (path) => {
      configureApi();
      vi.stubEnv("WEBSITE_URL", "https://www.x.dev");
      vi.stubEnv("WORKERS_URL", "https://workers.x.dev");
      denied();
      await expect(page(path)).rejects.toThrow("NEXT_REDIRECT");
      expect(requireAdminPage).toHaveBeenCalledWith("en");
      expect(fetchMock).not.toHaveBeenCalled();
      expect(fetchEmails).not.toHaveBeenCalled();
    },
    30_000, // the system page is imported fresh
  );
});
