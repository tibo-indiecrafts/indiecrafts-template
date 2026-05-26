import type { CustomHtmlModule } from "@/sanity/types";

/**
 * Custom HTML — escape hatch for editor-authored markup (e.g. embed
 * scripts, third-party widgets). Renders with `dangerouslySetInnerHTML`,
 * so trust the source: editors with Studio access can inject arbitrary
 * HTML/JS. Lock down via Sanity roles if that's a concern.
 */
export function CustomHtml(props: CustomHtmlModule) {
  if (!props.html) return null;
  return (
    <section
      id={props.anchor}
      className="mx-auto max-w-3xl px-(--gutter) py-8"
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  );
}
