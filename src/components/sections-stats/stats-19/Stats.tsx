import { useScopedT } from "@/i18n/scoped-t";
import { stats19Namespace } from "./config";
import type { StatsBlock } from "./schema";

/**
 * Tailark `veil-stats-1` — JSX verbatim. Centered veil section
 * inside `max-w-2xl @container` with title + body, then a
 * `@xl:grid-cols-3 grid-cols-2` row of inline-style stat lines.
 * Each cell is a `border-y py-6 text-xl` paragraph with a bold
 * `<span>` value followed by trailing copy. Default Tailwind font
 * (no `font-serif` override).
 */
export default function Stats(props: Readonly<StatsBlock>) {
  const [, , tRoot] = useScopedT(stats19Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-4">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground text-balance">{tRoot(props.bodyKey)}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 text-sm @xl:grid-cols-3">
          {props.items.map((item, index) => (
            <div key={index} className="border-y py-6">
              <p className="text-muted-foreground text-xl">
                <span className="text-foreground font-medium">
                  {tRoot(item.valueKey)}
                </span>
                {tRoot(item.trailingKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
