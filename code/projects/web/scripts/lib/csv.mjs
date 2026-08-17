/**
 * CSV cell escaping for the dataset export scripts.
 *
 * Two jobs in one:
 *  1. **Formula-injection guard** — a cell that starts with `= + - @` (or a
 *     tab / CR) is executed as a formula by Excel / Google Sheets. User content
 *     (comment bodies, names) can carry `=HYPERLINK(...)` etc. Prefix a single
 *     quote so the spreadsheet treats it as text. (OWASP CSV injection.)
 *  2. **RFC 4180 quoting** — wrap in double quotes and double any inner quote
 *     when the value contains `"`, a comma, or a newline.
 */
export function csvCell(value) {
  const s = value == null ? "" : String(value);
  const guarded = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /["\n\r,]/.test(guarded) ? `"${guarded.replaceAll('"', '""')}"` : guarded;
}
