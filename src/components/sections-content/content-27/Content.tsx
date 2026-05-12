import { useScopedT } from "@/i18n/scoped-t";
import { content27Namespace } from "./config";
import type { ContentBlock } from "./schema";

const SLOTS = ["1", "2", "3"] as const;

export default function Content({ id }: Readonly<ContentBlock>) {
  const [t] = useScopedT(content27Namespace);
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto grid max-w-3xl gap-6 px-6 @2xl:grid-cols-2">
        <h2 id={headingId} className="text-4xl font-medium text-balance">
          {t("title")}
        </h2>

        <div className="flex flex-col gap-6">
          {SLOTS.map((slot) => (
            <p key={slot} className="text-muted-foreground">
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
