import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { splitHighlights } from "../shared/rich-title";

/**
 * Shared title primitive. Renders a heading from a string and promotes any
 * `[[word]]` span to the brand accent colour. Owns no typography — pass the
 * element's Tailwind classes via `className` (cn-merged, last wins), so each
 * call site keeps its own type scale. Pure + server-safe (no hooks/state), so
 * it works in RSC and client components, for app titles and Sanity titles alike.
 *
 * The highlight is decorative emphasis only — the full title still reads as one
 * string, so it carries no colour-only meaning and needs no extra ARIA.
 */
type TitleTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

export function RichTitle({
  as: Tag = "h2",
  id,
  className,
  children,
}: {
  as?: TitleTag;
  /** Set when the heading is an `aria-labelledby` target. */
  id?: string;
  className?: string;
  children: string;
}) {
  return (
    <Tag id={id} className={cn(className)}>
      {splitHighlights(children).map((segment, i) =>
        segment.highlight ? (
          <span key={i} className="text-brand">
            {segment.text}
          </span>
        ) : (
          segment.text
        ),
      )}
    </Tag>
  );
}
