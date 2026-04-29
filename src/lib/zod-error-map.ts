/**
 * Zod error → translation-key mapping.
 *
 * Zod schemas stay authored in English (compile-time ergonomic, easy to
 * diff). At render time `translateZodError()` looks each message up in the
 * table below and, if matched, returns its key — pass that key into
 * `t(...)` from next-intl to show the localized string.
 *
 * Unknown messages fall back to the raw English — nothing is ever lost.
 *
 * Pattern inspired by wahio/front/src/utils/zod-error-map.ts.
 */

import type { ZodIssue } from "zod";

const MAP: Record<string, string> = {
  Required: "validation.required",
  "Expected string, received null": "validation.required",
  "Invalid email": "validation.invalidEmail",
  "Invalid email address": "validation.invalidEmail",
  "Invalid url": "validation.invalidUrl",
  "Invalid URL": "validation.invalidUrl",
  "String must contain at least 1 character(s)": "validation.tooShort",
  "Number must be greater than 0": "validation.mustBePositive",
  "Number must be greater than or equal to 0": "validation.nonNegative",
};

/**
 * Translate a single Zod issue's message.
 * Returns a next-intl key if matched, or the original English as a fallback.
 */
export function mapZodMessage(message: string): string {
  return MAP[message] ?? message;
}

/**
 * Translate every issue on a ZodError in one pass.
 * Produces `{ "email": "validation.invalidEmail", "password": "..." }`
 * keyed by dotted path, ready to spread into form state.
 */
export function translateZodIssues(issues: ZodIssue[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const path = issue.path.join(".") || "_form";
    out[path] = mapZodMessage(issue.message);
  }
  return out;
}
