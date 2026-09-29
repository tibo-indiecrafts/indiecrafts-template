/**
 * Render the shell's bundled offline page.
 *
 * @see docs/reference/projects/mobile/main/scripts/offline-page.md
 */

const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/**
 * The page Capacitor shows when the app surface cannot load (`server.errorPath`).
 * Every locale ships inline; the device language picks one, English as fallback.
 * The colors are neutral error-screen defaults, not brand tokens — no app is loaded.
 */
export function renderOfflinePage({ appName, messages }) {
  const safe = Object.fromEntries(
    Object.entries(messages).map(([k, m]) => [
      k,
      { title: esc(m.title), body: esc(m.body), retry: esc(m.retry) },
    ]),
  );
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(appName)}</title>
<style>
:root{color-scheme:light dark;--bg:#fff;--fg:#0a0a0a;--muted:#696969}
@media (prefers-color-scheme:dark){:root{--bg:#0a0a0a;--fg:#fafafa;--muted:#a1a1a1}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:16px system-ui,sans-serif;padding:24px;box-sizing:border-box;text-align:center}
p{color:var(--muted)}button{font:inherit;padding:12px 20px;border-radius:10px;border:1px solid currentColor;background:none;color:inherit}
</style></head>
<body><main><h1 id="t"></h1><p id="b"></p><button id="r" type="button"></button></main>
<script>
const MESSAGES = ${JSON.stringify(safe)};
const lang = (navigator.language || "en").slice(0, 2);
const m = MESSAGES[lang] ?? MESSAGES.en;
document.documentElement.lang = MESSAGES[lang] ? lang : "en";
document.getElementById("t").innerHTML = m.title;
document.getElementById("b").innerHTML = m.body;
const r = document.getElementById("r");
r.innerHTML = m.retry;
r.onclick = () => location.reload();
</script></body></html>
`;
}
