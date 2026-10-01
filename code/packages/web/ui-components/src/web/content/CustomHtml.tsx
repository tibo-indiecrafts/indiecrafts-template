/**
 * Render editor-authored raw HTML.
 *
 * @see docs/reference/packages/web/ui-components/src/web/content/CustomHtml.md
 */
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import type { CustomHtmlModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { EmbedScripts } from "./EmbedScripts";
import { splitScripts } from "./split-scripts";

/**
 * Custom HTML — escape hatch for editor-authored markup (embed scripts,
 * third-party widgets, a provider's newsletter form). Renders with
 * `dangerouslySetInnerHTML`, so trust the source: editors with Studio access can
 * inject arbitrary HTML/JS. Lock down via Sanity roles if that's a concern.
 *
 * ponytail: stored-XSS surface by design — a trusted-author escape hatch.
 * NOT sanitized on purpose: the block's whole job is to embed `<script>` /
 * `<iframe>` widgets, which any real HTML sanitizer strips. The backstop is
 * the app CSP (`@indiecrafts/packages-shared-security` `buildCsp` — `object-src 'none'`,
 * `frame-src`/`form-action`/`connect-src` allowlists). An external provider's
 * form/iframe/API host needs to be in `EMBED_HOSTS` (`next.config.ts`) — a
 * same-origin form (POST `/api/newsletter`) needs nothing.
 *
 * **Scripts.** `<script>` tags are lifted out (`splitScripts`) and rendered by
 * `EmbedScripts` with the request nonce, on every mount — markup scripts would
 * never run on a client navigation, and the strict CSP blocks them on first load.
 * With the nonce, `'strict-dynamic'` also trusts whatever the snippet loads.
 *
 * **Width.** `contained` (default) caps at `max-w-6xl` + the page gutter, so a
 * custom form sits with the other blocks; `full` spans the viewport but **keeps
 * the gutter** so content never touches the screen edges. Inline (a blog body),
 * the surrounding `.prose` column already owns width + padding, so we drop both.
 *
 * Any embedded `<iframe>` is forced to full width — editors paste embed codes with
 * hard-coded `width`/`height` (e.g. a 560px YouTube or a Google Form), and CSS
 * `w-full` overrides the attribute so the embed never ships narrower than the
 * column. A raw `<form>`/`<input>` isn't forced — style its own control widths in
 * the embed. Height stays as authored; wrap in a ratio box for responsive height.
 */
export function CustomHtml({
  html,
  anchor,
  width = "contained",
  inline,
}: CustomHtmlModule & { inline?: boolean }) {
  if (!html) return null;
  const { html: markup, scripts } = splitScripts(html);
  const iframe = "[&_iframe]:block [&_iframe]:w-full [&_iframe]:max-w-full";
  if (inline) {
    return (
      <>
        <div
          id={anchor}
          className={cn("not-prose my-8", iframe)}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
        <EmbedScripts scripts={scripts} />
      </>
    );
  }
  return (
    <>
      <section
        id={anchor}
        className={cn(
          "px-(--gutter) py-8 md:py-12",
          width === "full" ? "w-full" : "mx-auto max-w-6xl",
          iframe,
        )}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
      <EmbedScripts scripts={scripts} />
    </>
  );
}
