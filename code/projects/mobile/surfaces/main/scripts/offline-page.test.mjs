import { test } from "node:test";
import assert from "node:assert/strict";
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

test("embeds every locale and the app name", () => {
  const html = renderOfflinePage({ appName: "Acme", messages });
  assert.match(html, /<title>Acme<\/title>/);
  assert.match(html, /Try again/);
  assert.match(html, /Réessayer/);
});

test("escapes HTML in the app name and messages", () => {
  const html = renderOfflinePage({
    appName: `A<b>&"`,
    messages: { en: { title: "<script>x</script>", body: "&", retry: `"` } },
  });
  assert.doesNotMatch(html, /<script>x<\/script>/);
  assert.match(html, /A&lt;b&gt;&amp;&quot;/);
});

test("falls back to English for an unknown device locale", () => {
  const html = renderOfflinePage({ appName: "Acme", messages });
  assert.match(html, /MESSAGES\[lang\] \?\? MESSAGES\.en/);
});
