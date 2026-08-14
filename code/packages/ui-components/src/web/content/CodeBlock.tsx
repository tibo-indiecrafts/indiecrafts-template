import { codeToHtml } from "shiki";

/**
 * Highlighted code block for the body — a `codeBlock` object (`language`,
 * optional `filename`, `code`). Shiki runs server-side (async, no client JS)
 * with a light + dark theme pair; the colours swap under `[data-theme="dark"]`
 * via CSS in `@indiecrafts/ui-tokens` (`.shiki` rules). `not-prose` keeps the
 * typography plugin from restyling Shiki's markup.
 *
 * An unknown language degrades to a plain `<pre>` (Shiki throws on unsupported
 * grammars) — no broken render, no highlighting.
 */
export async function CodeBlock({ value }: { value: unknown }) {
  const v = (value ?? {}) as { code?: string; language?: string; filename?: string };
  const code = v.code ?? "";
  if (!code.trim()) return null;

  const lang = (v.language || "text").toLowerCase();
  let html: string | null = null;
  try {
    html = await codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: "light",
    });
  } catch {
    html = null;
  }

  return (
    <div className="not-prose ring-border/60 relative my-6 overflow-hidden rounded-xl ring-1">
      {v.filename || v.language ? (
        <div className="border-border/60 text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs">
          <span className="font-mono">{v.filename}</span>
          {v.language ? (
            <span className="font-mono uppercase">{v.language}</span>
          ) : null}
        </div>
      ) : null}
      {html ? (
        <div
          className="text-sm [&>pre]:m-0! [&>pre]:overflow-x-auto [&>pre]:p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="bg-muted/40 overflow-x-auto p-4 text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
