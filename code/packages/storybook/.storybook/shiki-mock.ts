/**
 * Storybook stub for `shiki`. The real Shiki highlighter loads a WASM engine
 * that hangs in the browser-only story canvas (it runs fine server-side in the
 * app, where `CodeBlock` actually renders). Here `codeToHtml` returns the code
 * in a plain, unhighlighted `<pre class="shiki">` so the CodeBlock stories show
 * the block chrome + code without waiting on WASM. Aliased in main.ts.
 */
const escapeHtml = (s: string) =>
  s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);

export async function codeToHtml(code: string): Promise<string> {
  return `<pre class="shiki" style="background-color:var(--muted)"><code>${escapeHtml(code)}</code></pre>`;
}

export default { codeToHtml };
