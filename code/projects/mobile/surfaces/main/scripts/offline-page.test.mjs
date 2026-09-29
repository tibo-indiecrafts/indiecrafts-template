import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { renderOfflinePage } from "./offline-page.mjs";

const messages = {
  en: {
    title: "You're offline",
    body: "Check your connection.",
    retry: "Try again",
  },
  fr: {
    title: "Vous êtes hors ligne",
    body: "Vérifiez votre connexion.",
    retry: "Réessayer",
  },
};
const SERVER = "http://localhost:3002";

/** Run the page's inline script with a stubbed browser + Capacitor bridge. */
function run(html, { language, bridge = true } = {}) {
  const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const els = { t: {}, b: {}, r: {} };
  const calls = { replace: [], hide: 0 };
  const sandbox = {
    navigator: { language },
    document: { documentElement: {}, getElementById: (id) => els[id] },
    location: { replace: (u) => calls.replace.push(u) },
    window: bridge
      ? {
          Capacitor: {
            Plugins: { SplashScreen: { hide: () => calls.hide++ } },
          },
        }
      : {},
  };
  vm.runInNewContext(script, sandbox);
  return { els, calls, lang: sandbox.document.documentElement.lang };
}

test("embeds every locale and the app name", () => {
  const html = renderOfflinePage({
    appName: "Acme",
    messages,
    serverUrl: SERVER,
  });
  assert.match(html, /<title>Acme<\/title>/);
  assert.match(html, /Try again/);
  assert.match(html, /Réessayer/);
});

test("escapes HTML in the app name and messages", () => {
  const html = renderOfflinePage({
    appName: `A<b>&"`,
    messages: { en: { title: "<script>x</script>", body: "&", retry: `"` } },
    serverUrl: SERVER,
  });
  assert.doesNotMatch(html, /<script>x<\/script>/);
  assert.match(html, /A&lt;b&gt;&amp;&quot;/);
});

test("shows the device language, falling back to English", () => {
  const html = renderOfflinePage({
    appName: "Acme",
    messages,
    serverUrl: SERVER,
  });
  assert.equal(
    run(html, { language: "fr-FR" }).els.t.textContent,
    "Vous êtes hors ligne",
  );
  const de = run(html, { language: "de-DE" });
  assert.equal(de.els.t.textContent, "You're offline");
  assert.equal(de.lang, "en");
});

test("Retry goes back to the app server, not the bundled offline page", () => {
  const html = renderOfflinePage({
    appName: "Acme",
    messages,
    serverUrl: SERVER,
  });
  const { els, calls } = run(html, { language: "en" });
  els.r.onclick();
  assert.deepEqual(calls.replace, [SERVER]);
});

test("hides the native splash so the offline page is visible", () => {
  const html = renderOfflinePage({
    appName: "Acme",
    messages,
    serverUrl: SERVER,
  });
  assert.equal(run(html, { language: "en" }).calls.hide, 1);
  // Outside the shell (no bridge) the page still renders without throwing.
  assert.equal(
    run(html, { language: "en", bridge: false }).els.t.textContent,
    "You're offline",
  );
});
