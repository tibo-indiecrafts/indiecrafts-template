import type { CustomHtmlModule } from "@/features/blog/sanity/types";

/**
 * Custom HTML — escape hatch for editor-authored markup (embed scripts,
 * third-party widgets). Renders with `dangerouslySetInnerHTML`, so
 * trust the source: editors with Studio access can inject arbitrary
 * HTML/JS. Lock down via Sanity roles if that's a concern.
 *
 * Section sizing matches the rest of the modules so this block doesn't
 * appear noticeably narrower than its neighbours when embedded inside
 * a post body.
 */
export function CustomHtml(props: CustomHtmlModule) {
  if (!props.html) return null;
  return (
    <section
      id={props.anchor}
      className="w-full py-8 md:py-12"
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  );
}
