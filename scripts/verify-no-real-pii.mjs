#!/usr/bin/env node
/**
 * Scan en.json + config.ts files under src/components for hardcoded demo
 * values that look like real PII. Fails the build if it finds anything
 * outside the allowlist of known-fake demo data.
 *
 * Allowed:
 *   - Email domains: example.com / .org / .net (RFC 2606 reserved),
 *     localhost, plus a small set of recognizable upstream-mock domains
 *     (blocks.so, documenso.com, acme.co) and Sidebar-04 mail-demo brands
 *     (stripe.com, github.com, figma.com, notion.so, google.com,
 *     airbnb.com, linear.app, ycombinator.com).
 *   - Phone numbers in the NANP fictional reserved range:
 *     "+1 (555) 555-0100" through "+1 (555) 555-0199".
 *
 * Anything else is flagged with file:line so the maintainer can either
 * scrub the value or extend the allowlist with a deliberate decision.
 */

import { readFileSync, globSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(process.cwd(), "src/components");
const PATTERNS = [
  // Recursive glob for both en.json and config.ts under every component bucket.
  // Node 22+ ships globSync; we use it to keep this script dependency-free.
  "**/en.json",
  "**/config.ts",
];

// Allowlist of demo email domains. Real client projects should have ZERO
// of these — but for the template we intentionally use them so demos are
// recognizable and obviously fake.
const ALLOWED_EMAIL_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "localhost",
  // Upstream-mock attribution (recognizable as "demo, not yours")
  "blocks.so",
  "documenso.com",
  "acme.co",
  // Sidebar-04 mail-demo brand mocks (recognizable companies, not someone's
  // actual contact). Adding to this list is a deliberate "yes, this is mock
  // brand UI" decision.
  "stripe.com",
  "github.com",
  "figma.com",
  "notion.so",
  "google.com",
  "airbnb.com",
  "linear.app",
  "ycombinator.com",
]);

// Match any phone-shaped string. We want this loose so we catch surprises;
// the allowlist below decides what's acceptable.
const PHONE_RE = /\+?1?[\s.-]?\(?\b[0-9]{3}\b\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}\b/g;

// Allowed phone — must match NANP fictional 555-01XX range.
// Format-tolerant: "+1 (555) 555-0100", "+1-555-555-0100", "555.555.0100"...
const ALLOWED_PHONE_RE = /^\+?1?[\s.-]?\(?555\)?[\s.-]?555[\s.-]?01\d{2}$/;

const EMAIL_RE = /\b([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g;

const violations = [];

const files = PATTERNS.flatMap((pattern) =>
  globSync(pattern, { cwd: ROOT }).map((p) => join(ROOT, p)),
);

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    // Skip comments in .ts files
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

    for (const m of line.matchAll(EMAIL_RE)) {
      const domain = m[2].toLowerCase();
      if (!ALLOWED_EMAIL_DOMAINS.has(domain)) {
        violations.push({
          file,
          line: i + 1,
          kind: "email",
          value: m[0],
          hint: `Domain "${domain}" not in allowlist. Replace with @example.com or extend ALLOWED_EMAIL_DOMAINS in scripts/verify-no-real-pii.mjs with a comment.`,
        });
      }
    }

    for (const m of line.matchAll(PHONE_RE)) {
      const normalized = m[0].replace(/[\s.()-]/g, "");
      const formatted = m[0];
      if (
        !ALLOWED_PHONE_RE.test(formatted) &&
        !/^555555\d{4}$/.test(normalized.replace(/^\+?1/, ""))
      ) {
        // Re-check stricter: only allow normalized 5555550100..5555550199
        const trailing = normalized.replace(/^\+?1/, "");
        if (!/^5555550(1\d{2})$/.test(trailing)) {
          violations.push({
            file,
            line: i + 1,
            kind: "phone",
            value: m[0],
            hint: `Phone outside NANP fictional reserved range. Use "+1 (555) 555-0100"..."+1 (555) 555-0199".`,
          });
        }
      }
    }
  });
}

if (violations.length === 0) {
  console.log(
    `✓ No real-looking PII in src/components/**/{en.json,config.ts} (${files.length} files scanned)`,
  );
  process.exit(0);
}

console.error(
  `✗ Found ${violations.length} potentially-real PII value${violations.length === 1 ? "" : "s"}:\n`,
);
const grouped = violations.reduce((acc, v) => {
  (acc[v.file] ??= []).push(v);
  return acc;
}, {});
for (const [file, list] of Object.entries(grouped)) {
  console.error(`  ${file.replace(ROOT + "/", "")}`);
  for (const v of list) {
    console.error(`    line ${v.line} (${v.kind}): ${v.value}`);
    console.error(`      → ${v.hint}`);
  }
  console.error("");
}
console.error(
  "Fix the violations above, or — if the value is intentional demo data — add the domain to ALLOWED_EMAIL_DOMAINS in scripts/verify-no-real-pii.mjs with a comment explaining why.",
);
process.exit(1);
