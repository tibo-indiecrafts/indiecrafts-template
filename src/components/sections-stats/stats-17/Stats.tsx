import { useScopedT } from "@/i18n/scoped-t";
import { stats17Namespace } from "./config";
import type { StatsBlock } from "./schema";

export default function Stats(props: Readonly<StatsBlock>) {
  const [, , tRoot] = useScopedT(stats17Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 id={headingId} className="text-4xl font-medium lg:text-5xl">
            {tRoot(props.titleKey)}
          </h2>
          <p>{tRoot(props.bodyKey)}</p>
        </div>

        <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
          {props.items.map((item, index) => (
            <div key={index} className="space-y-4">
              <div className="text-5xl font-bold">{tRoot(item.valueKey)}</div>
              <p>{tRoot(item.bodyKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
