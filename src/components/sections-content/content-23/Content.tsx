import { ArrowRight } from "lucide-react";
import { useScopedT } from "@/i18n/scoped-t";
import { content23Namespace } from "./config";
import type { ContentBlock } from "./schema";

const STATS = ["1", "2", "3", "4"] as const;
const FEATURES = ["1", "2", "3"] as const;

/**
 * Tailark `mist-content-4` — JSX verbatim. Section heading + lead
 * over a 3-column emoji-icon feature grid (`@sm:grid-cols-2 @2xl:grid-cols-3`)
 * followed by a bordered stat list (4 items) with ArrowRight bullets.
 * The whole block is constrained to `max-w-2xl` and centered.
 */
export default function Content({ id }: Readonly<ContentBlock>) {
  const [t] = useScopedT(content23Namespace);
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="@container mx-auto max-w-2xl">
            <div>
              <h2 id={headingId} className="text-foreground text-4xl font-semibold">
                {t("title")}
              </h2>
              <p className="text-muted-foreground mt-4 mb-12 text-xl">{t("body")}</p>
            </div>

            <div className="my-12 grid gap-6 @sm:grid-cols-2 @2xl:grid-cols-3">
              {FEATURES.map((slot) => (
                <div key={slot} className="space-y-2">
                  <span aria-hidden className="mb-4 block text-3xl">
                    {t(`features.${slot}.emoji`)}
                  </span>
                  <h3 className="text-xl font-medium">{t(`features.${slot}.title`)}</h3>
                  <p className="text-muted-foreground">{t(`features.${slot}.body`)}</p>
                </div>
              ))}
            </div>

            <div className="border-t">
              <ul className="text-muted-foreground mt-8 space-y-2">
                {STATS.map((slot) => (
                  <li key={slot} className="-ml-0.5 flex items-center gap-1.5">
                    <ArrowRight className="size-4 opacity-50" />
                    <span className="text-foreground font-medium">
                      {t(`stats.${slot}.value`)}
                    </span>{" "}
                    {t(`stats.${slot}.label`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
