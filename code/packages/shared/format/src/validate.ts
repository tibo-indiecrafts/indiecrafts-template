/**
 * Identity/contact validators + formatters — email, phone, postal code, IBAN, EU
 * VAT number. Pure + dependency-free. Phone validity is loose (E.164 shape) — for
 * strict per-country validation swap in `libphonenumber-js` at the call site.
 */

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const isEmail = (s: string): boolean => EMAIL.test(s.trim());

/** Loose E.164 check: optional `+`, 8–15 digits after stripping spaces/dashes/parens. */
export function isPhone(input: string): boolean {
  const s = input.replace(/[\s().-]/g, "");
  return /^\+?\d{8,15}$/.test(s);
}

/** Light international grouping: keeps `+CC` then groups the rest in pairs ("+33 6 12 34 56 78"-ish). */
export function formatPhone(input: string): string {
  const s = input.replace(/[\s().-]/g, "");
  const plus = s.startsWith("+");
  const digits = plus ? s.slice(1) : s;
  if (!/^\d{6,15}$/.test(digits)) return input;
  // Country code = first 1–3 digits when international; group the national part in pairs.
  const cc = plus ? digits.slice(0, digits.length > 10 ? 2 : 1) : "";
  const national = digits.slice(cc.length);
  const grouped = national.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  return [plus ? `+${cc}` : "", grouped].filter(Boolean).join(" ");
}

// Per-country postal-code patterns; unknown countries accept a permissive default.
const POSTAL: Record<string, RegExp> = {
  FR: /^\d{5}$/,
  DE: /^\d{5}$/,
  ES: /^\d{5}$/,
  IT: /^\d{5}$/,
  BE: /^\d{4}$/,
  NL: /^\d{4}\s?[A-Za-z]{2}$/,
  US: /^\d{5}(-\d{4})?$/,
  GB: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/,
};
export function isPostalCode(code: string, country: string): boolean {
  const re = POSTAL[country.toUpperCase()] ?? /^[A-Za-z\d][A-Za-z\d\s-]{2,9}$/;
  return re.test(code.trim());
}

/** IBAN check-digit validation (ISO 13616 / mod-97). */
export function isIban(input: string): boolean {
  const s = input.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) =>
    String(c.charCodeAt(0) - 55),
  );
  let remainder = 0;
  for (const ch of numeric) remainder = (remainder * 10 + Number(ch)) % 97;
  return remainder === 1;
}

/** Group an IBAN into 4-char blocks for display. */
export function formatIban(input: string): string {
  return input
    .replace(/\s+/g, "")
    .toUpperCase()
    .replace(/(.{4})(?=.)/g, "$1 ");
}

/** EU VAT number shape: 2-letter country prefix + 2–13 alphanumerics incl. ≥1 digit (format only, not VIES-checked). */
export function isVatNumber(input: string): boolean {
  return /^[A-Z]{2}(?=[A-Z0-9]*\d)[A-Z0-9]{2,13}$/.test(
    input.replace(/\s+/g, "").toUpperCase(),
  );
}
