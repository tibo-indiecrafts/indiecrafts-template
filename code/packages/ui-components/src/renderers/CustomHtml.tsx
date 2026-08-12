import type { CustomHtmlModule } from "@indiecrafts/ui-components/types";

/**
 * Custom HTML — escape hatch for editor-authored markup (embed scripts,
 * third-party widgets). Renders with `dangerouslySetInnerHTML`, so
 * trust the source: editors with Studio access can inject arbitrary
 * HTML/JS. Lock down via Sanity roles if that's a concern.
 *
 * Section sizing matches the rest of the modules so this block doesn't
 * appear noticeably narrower than its neighbours when embedded inside
 * a post body.
 *
 * Any embedded `<iframe>` is forced to its parent's full width — editors paste
 * embed codes with hard-coded `width`/`height` attributes (e.g. a 560px YouTube
 * or a Google Form), and CSS `w-full` overrides the attribute so the embed never
 * ships narrower than the column. `[&_iframe]:…` targets descendant iframes since
 * the markup is injected raw (no class hook on the iframe itself). Height stays
 * as authored; wrap in a ratio box in the embed code if you need responsive height.
 */
export function CustomHtml(props: CustomHtmlModule) {
  if (!props.html) return null;
  return (
    <section
      id={props.anchor}
      className="w-full py-8 md:py-12 [&_iframe]:block [&_iframe]:w-full [&_iframe]:max-w-full"
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  );
}
