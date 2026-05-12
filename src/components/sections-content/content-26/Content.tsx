import type { LucideIcon } from "lucide-react";
import { Lightbulb, Pencil, PencilRuler } from "lucide-react";
import { useScopedT } from "@/i18n/scoped-t";
import { content26Namespace } from "./config";
import type { ContentBlock } from "./schema";

const ITEMS: ReadonlyArray<{ slot: "1" | "2" | "3"; Icon: LucideIcon }> = [
  { slot: "1", Icon: Lightbulb },
  { slot: "2", Icon: Pencil },
  { slot: "3", Icon: PencilRuler },
];

/**
 * Tailark `veil-content-3` — JSX verbatim. Centered editorial
 * section inside `max-w-2xl @container` with a headline + lead, then
 * a 3-col icon grid (`@xl:grid-cols-3 grid-cols-2`) where each item
 * shows a `size-4` Lucide glyph above a `border-t pt-6` paragraph
 * carrying a bold inline lead followed by muted body copy. Default
 * Tailwind font is used (no `font-serif` override).
 */
export default function Content({ id }: Readonly<ContentBlock>) {
  const [t] = useScopedT(content26Namespace);
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-4">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {t("title")}
          </h2>
          <p className="text-muted-foreground">{t("body")}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 text-sm @xl:grid-cols-3">
          {ITEMS.map(({ slot, Icon }) => (
            <div key={slot} className="space-y-3 border-t pt-6">
              <Icon aria-hidden className="text-muted-foreground size-4" />
              <p className="text-muted-foreground leading-5">
                <span className="text-foreground font-medium">
                  {t(`items.${slot}.lead`)}
                </span>
                {t(`items.${slot}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
