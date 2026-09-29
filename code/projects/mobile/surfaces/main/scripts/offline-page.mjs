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
/** JSON that is safe inside an inline <script> (no `</script>` break-out). */
const scriptJson = (v) => JSON.stringify(v).replace(/</g, "\\u003c");

/**
 * The page Capacitor shows when the app surface cannot load (`server.errorPath`). It is
 * served from the shell's local origin, so Retry navigates back to `serverUrl` (a reload
 * would only reload this page). It also hides the native splash screen — the app's
 * NativeBridge never runs here. Every locale ships inline (set as text, never HTML); the
 * device language picks one, English as fallback. The colors are neutral error-screen
 * defaults, not brand tokens — no app is loaded.
 */
export function renderOfflinePage({ appName, messages, serverUrl }) {
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
const MESSAGES = ${scriptJson(messages)};
const SERVER_URL = ${scriptJson(serverUrl)};
const lang = (navigator.language || "en").slice(0, 2);
const m = MESSAGES[lang] ?? MESSAGES.en;
document.documentElement.lang = MESSAGES[lang] ? lang : "en";
document.getElementById("t").textContent = m.title;
document.getElementById("b").textContent = m.body;
const r = document.getElementById("r");
r.textContent = m.retry;
r.onclick = () => location.replace(SERVER_URL);
window.Capacitor?.Plugins?.SplashScreen?.hide?.();
</script></body></html>
`;
}
