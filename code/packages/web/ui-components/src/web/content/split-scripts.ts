/**
 * Split editor-authored HTML into its markup and its `<script>` tags.
 *
 * @see docs/reference/packages/web/ui-components/src/web/content/split-scripts.md
 */

/** One `<script>` lifted out of the HTML: its attributes (a bare attribute → `true`)
 *  and its inline code ("" for an external `src` script). */
export type EmbedScript = {
  attrs: Record<string, string | true>;
  code: string;
};

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
const ATTR = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;

/**
 * A script inside `dangerouslySetInnerHTML` never runs on a client navigation, and on
 * first load the strict nonce CSP blocks it. So `CustomHtml` lifts the scripts out and
 * re-inserts each with the request nonce (`EmbedScripts`).
 * ponytail: a regex, not an HTML parser — fine for pasted embed snippets (trusted
 * editors); a `</script>` inside a JS string literal would split early.
 */
export function splitScripts(html: string): {
  html: string;
  scripts: EmbedScript[];
} {
  const scripts: EmbedScript[] = [];
  const rest = html.replace(SCRIPT, (_tag, rawAttrs: string, code: string) => {
    const attrs: EmbedScript["attrs"] = {};
    for (const [, name, dq, sq, bare] of rawAttrs.matchAll(ATTR))
      attrs[name!.toLowerCase()] = dq ?? sq ?? bare ?? true;
    if (attrs.src || code.trim()) scripts.push({ attrs, code });
    return "";
  });
  return { html: rest, scripts };
}
