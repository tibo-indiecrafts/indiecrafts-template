import type { LucideIcon } from "lucide-react";
import { Lightbulb, Pencil, PencilRuler } from "lucide-react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { content26Namespace } from "./config";
import type { ContentBlock } from "./schema";

const ITEMS: ReadonlyArray<{ slot: "1" | "2" | "3"; Icon: LucideIcon }> = [
  { slot: "1", Icon: Lightbulb },
  { slot: "2", Icon: Pencil },
  { slot: "3", Icon: PencilRuler },
];

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
