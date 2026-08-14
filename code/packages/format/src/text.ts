/** Plain text helpers — locale-agnostic string shaping. */

/** Trim to `max` chars on a word-ish boundary, adding an ellipsis. */
export function truncate(text: string, max: number, ellipsis = "…"): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "").trimEnd() + ellipsis;
}

/** Initials from a name — "Ada Lovelace" → "AL". */
export function initials(name: string, max = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Reading time in minutes (≥ 1). Append the "read"/"de lecture" label in UI copy. */
export function readingTime(text: string, wordsPerMinute = 200): number {
  return Math.max(1, Math.ceil(wordCount(text) / wordsPerMinute));
}

/** Collapse whitespace + truncate to a one-line excerpt. */
export function excerpt(text: string, max = 160): string {
  return truncate(text.replace(/\s+/g, " ").trim(), max);
}

/** Mask an email for display: "john.doe@x.com" → "j***@x.com". */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || !local) return email;
  return `${local.charAt(0)}${"*".repeat(Math.max(1, local.length - 1))}@${domain}`;
}

export type NameStyle = "full" | "lastFirst" | "initialLast";
export function nameFormat(name: { first?: string; last?: string }, style: NameStyle = "full"): string {
  const first = (name.first ?? "").trim();
  const last = (name.last ?? "").trim();
  if (style === "lastFirst") return [last, first].filter(Boolean).join(", ");
  if (style === "initialLast") return [first ? `${first.charAt(0)}.` : "", last].filter(Boolean).join(" ");
  return [first, last].filter(Boolean).join(" ");
}

/** "https://www.example.com/path?q=1" → "example.com". */
export function prettyUrl(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Lowercase extension without the dot — "photo.JPG" → "jpg". */
export function fileExtension(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i > 0 ? filename.slice(i + 1).toLowerCase() : "";
}
