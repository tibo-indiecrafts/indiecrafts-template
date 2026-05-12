import { useScopedT } from "@/i18n/scoped-t";
import { content25Namespace } from "./config";
import type { ContentBlock } from "./schema";

const SLOTS = ["1", "2"] as const;

/**
 * Tailark `veil-content-2` — JSX verbatim. Simple veil section
 * inside `max-w-2xl @container` with a serif `font-serif text-4xl`
 * headline above a 2-col paragraph grid (`@xl:gap-12 grid-cols-2`),
 * each paragraph carrying a bold inline `<span>` lead followed by
 * muted body copy, separated from the headline by a `border-t`.
 */
export default function Content({ id }: Readonly<ContentBlock>) {
  const [t] = useScopedT(content25Namespace);
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <h2 id={headingId} className="text-4xl font-medium text-balance">
          {t("title")}
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-6 @xl:gap-12">
          {SLOTS.map((slot) => (
            <p key={slot} className="text-muted-foreground border-t pt-6">
              <span className="text-foreground font-medium">
                {t(`items.${slot}.lead`)}
              </span>
              {t(`items.${slot}.body`)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
