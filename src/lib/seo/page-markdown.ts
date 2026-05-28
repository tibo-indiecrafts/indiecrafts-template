/**
 * Page-to-markdown utility for /llms-full.txt and per-page .md endpoints.
 *
 * Walks a page's i18n tree (`messages.pages.<id>.*`) and turns it into a
 * Markdown document an LLM can ingest directly. No per-page config needed
 * — uses the same translations that drive the SEO + UI surfaces.
 *
 * Convention applied to the walked tree:
 *   - `title`        → page H1
 *   - `description`  → leading paragraph
 *   - `hero.*`       → key: value bullets under "## Hero"
 *   - `blocks.<k>`   → "## <k>" section, each property recursed
 *   - `items.<k>`    → "- **<k>**: <body>" bullets when leaf has a body
 *   - other objects  → recurse with bumped heading level
 *   - other strings  → "**<key>**: <value>" bullet
 */

import type { Locale, PageConfig } from "@/config";
import { site } from "@/config";
import { getStaticPathname } from "@/i18n/routing";

type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

/** Read a sub-tree of messages by dotted path; returns null when missing. */
export function getMessagesNode(
  messages: Record<string, unknown>,
  path: string,
): Record<string, unknown> | null {
  const segments = path.split(".");
  let node: unknown = messages;
  for (const s of segments) {
    if (typeof node !== "object" || node === null) return null;
    node = (node as Record<string, unknown>)[s];
  }
  if (typeof node !== "object" || node === null || Array.isArray(node)) return null;
  return node as Record<string, unknown>;
}

function titleCase(s: string): string {
  return s
    .replace(/[-_]/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function isLeafString(v: unknown): v is string {
  return typeof v === "string";
}

function isObject(v: unknown): v is Record<string, Json> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function renderObject(
  obj: Record<string, Json>,
  level: number,
  parentKey?: string,
): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (isLeafString(value)) {
      // Common cases: "title" + "body" / "subtitle" / "description" pairs
      if (key === "body" || key === "subtitle" || key === "description") {
        lines.push(value, "");
      } else if (key === "title" || key === "heading" || key === "name") {
        // Promote to a heading at this level
        lines.push(`${"#".repeat(Math.min(level, 6))} ${value}`, "");
      } else {
        lines.push(`- **${titleCase(key)}**: ${value}`);
      }
    } else if (isObject(value)) {
      const hasTitle = "title" in value || "name" in value || "heading" in value;
      const heading = hasTitle
        ? ""
        : `${"#".repeat(Math.min(level, 6))} ${titleCase(key)}`;
      if (heading) {
        lines.push(heading, "");
      }
      lines.push(renderObject(value, level + 1, key));
    }
  }
  return lines.filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n");
  // Suppress unused parameter warning
  void parentKey;
}

/**
 * Render a page to Markdown using its i18n tree under
 * `messages.pages.<id>.*`. Returns the markdown body — no front matter.
 */
export function renderPageMarkdown(
  page: PageConfig,
  locale: Locale,
  messages: Record<string, unknown>,
): string {
  const node = getMessagesNode(messages, `pages.${page.id}`);
  if (!node) {
    return `# ${page.id}\n\n_(no content under \`messages.pages.${page.id}\`)_\n`;
  }

  const title =
    (isLeafString(node.title) && node.title) ||
    (isLeafString(node.name) && node.name) ||
    page.id;
  const description = isLeafString(node.description) ? node.description : "";

  const pathname = getStaticPathname(page.key, locale);
  const url = `${site.url}${pathname}`;

  const head = [`# ${title}`, "", `URL: ${url}`, ""];
  if (description) head.push(description, "");

  // Render the rest (everything except title/description, which we already
  // emitted) starting at H2.
  const { title: _t, name: _n, description: _d, ...rest } = node;
  void _t;
  void _n;
  void _d;
  const body = renderObject(rest as Record<string, Json>, 2);

  return [...head, body, ""].join("\n");
}

/** Concatenate every visible page's markdown for `/llms-full.txt`. */
export function renderAllPagesMarkdown(
  pages: readonly PageConfig[],
  locale: Locale,
  messages: Record<string, unknown>,
): string {
  return pages.map((p) => renderPageMarkdown(p, locale, messages)).join("\n---\n\n");
}
