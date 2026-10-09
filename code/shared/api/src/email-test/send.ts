/**
 * Send a sample of every service email (erasure, data request, Clerk, welcome) for the Studio test.
 *
 * @see docs/reference/shared/api/src/email-test/send.md
 */
// The Studio "Envoyer un test" covers the website's emails itself; these are built here, in
// the worker, so the website asks for them (POST /v1/emails/test). Each sample goes through the
// real sender with the real Studio copy, footer and language — only the data is a sample.
// Test sends never copy anyone: the support copy and the QA `bccAll` are dropped.
import type { Env } from "../index";
import {
  fetchErasureEmailStrings,
  resend,
  sendErasureCompleteEmail,
  sendErasureTokenEmail,
} from "../erasure/email";
import { retainedSummary } from "../erasure/execute";
import {
  fetchDataRequestStrings,
  sendDataRequestClosedEmail,
  sendDataRequestReceipt,
} from "../data-request/email";
import { AUTH_SLUGS, fetchAuthEmailStrings } from "../clerk-email/sanity";
import { sendAuthTemplate } from "../clerk-email/handle";
import { sendWelcomeEmail } from "../clerk-email/welcome";

/** `service` — erasure + data request · `account` — the Clerk emails + welcome. */
export const TEST_SCOPES = ["service", "account"] as const;
export type TestScope = (typeof TEST_SCOPES)[number];
export const isTestScope = (value: unknown): value is TestScope =>
  TEST_SCOPES.includes(value as TestScope);

export type TestResult = { label: string; ok: boolean };

const SEND_SPACING_MS = 550; // under Resend's default 2 requests/s

/** The Studio copy with every copy setting off: no `bccAll`, no group's `copySupport`. */
export function withoutCopies<T>(strings: T | null): T | null {
  if (!strings) return strings;
  const out: Record<string, unknown> = {
    ...(strings as Record<string, unknown>),
    bccAll: undefined,
  };
  for (const [key, value] of Object.entries(out))
    if (value && typeof value === "object" && "copySupport" in value)
      out[key] = { ...value, copySupport: false };
  return out as T;
}

/** Sample data — obviously not a real person, request or code. */
const SAMPLE_VARS = {
  otp_code: "000000",
  code: "000000",
  magic_link: "https://example.com/sign-in#test",
  link: "https://example.com/invitation#test",
  device: "Chrome · macOS",
  location: "Paris, FR",
  ip_address: "192.0.2.1",
};

type Sample = {
  label: string;
  /** Sends the sample; false → the group is switched off (skipped, not a failure). The
   *  erasure and data-request senders throw on a failed send; `send` (a watched `resend`)
   *  is for the Clerk ones, as the welcome sender only logs its failure. */
  run: (send: typeof resend) => Promise<boolean | void>;
};

function serviceSamples(env: Env, to: string, locale: string): Sample[] {
  const site = env.WEBSITE_URL || "https://example.com";
  const erasureStrings = async () =>
    withoutCopies(await fetchErasureEmailStrings(env));
  const requestStrings = async () =>
    withoutCopies(await fetchDataRequestStrings(env));
  return [
    {
      label: "erasureToken",
      run: () =>
        sendErasureTokenEmail(
          env,
          { to, confirmUrl: `${site}/erasure/confirm?token=test`, locale },
          erasureStrings,
        ),
    },
    {
      label: "erasureComplete",
      run: () =>
        sendErasureCompleteEmail(
          env,
          { to, retained: retainedSummary(false), locale },
          erasureStrings,
        ),
    },
    {
      label: "dataRequestReceipt",
      run: () =>
        sendDataRequestReceipt(
          env,
          {
            to,
            id: 0,
            requestType: "access",
            submittedAt: new Date().toISOString(),
            locale,
          },
          requestStrings,
        ),
    },
    {
      label: "dataRequestClosed",
      run: () =>
        sendDataRequestClosedEmail(
          env,
          {
            to,
            id: 0,
            outcome: "done",
            note: locale === "fr" ? "Exemple de note." : "Sample note.",
            locale,
          },
          requestStrings,
        ),
    },
  ];
}

function accountSamples(env: Env, to: string, locale: string): Sample[] {
  const strings = async () => withoutCopies(await fetchAuthEmailStrings(env));
  return [
    ...AUTH_SLUGS.map((slug): Sample => ({
      label: slug,
      run: async (send) =>
        sendAuthTemplate(
          env,
          { to, slug, locale, vars: SAMPLE_VARS },
          await strings(),
          send,
        ),
    })),
    {
      label: "welcome",
      run: (send) =>
        sendWelcomeEmail(
          env,
          { to, locale, userId: `test-${crypto.randomUUID()}` },
          send,
          strings,
        ),
    },
  ];
}

/**
 * Send every sample of `scope`, once per locale, one at a time (Resend's rate limit), and
 * report each as `label · locale`. A failed send is reported and the rest still go; a group
 * switched off in the Studio is left out.
 */
export async function sendTestEmails(
  env: Env,
  { to, scope, locales }: { to: string; scope: TestScope; locales: string[] },
  sleep: (ms: number) => Promise<void> = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms)),
): Promise<TestResult[]> {
  const samples = locales.flatMap((locale) =>
    (scope === "service"
      ? serviceSamples(env, to, locale)
      : accountSamples(env, to, locale)
    ).map((s) => ({ ...s, label: `${s.label} · ${locale}` })),
  );
  const results: TestResult[] = [];
  for (const [i, sample] of samples.entries()) {
    if (i > 0) await sleep(SEND_SPACING_MS);
    // The welcome sender logs its own failure instead of throwing: watch the send itself.
    let failed = false;
    const send: typeof resend = async (e, message) => {
      try {
        await resend(e, message);
      } catch (error) {
        failed = true;
        throw error;
      }
    };
    try {
      const sent = await sample.run(send);
      if (sent === false) continue;
      results.push({ label: sample.label, ok: !failed });
    } catch {
      results.push({ label: sample.label, ok: false });
    }
  }
  return results;
}
