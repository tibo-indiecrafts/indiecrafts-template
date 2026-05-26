import { useScopedT } from "@/components/_lib/scoped-t";
import { content11Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [, tr, tRoot] = useScopedT(content11Namespace);

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-semibold text-balance lg:text-5xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground">{tr(props.introKey, "intro")}</p>
        </div>

        <dl className="grid gap-0.5 *:text-center md:grid-cols-3">
          {props.items.map((item, i) => (
            <div key={i} className="space-y-4 rounded-(--radius) border py-12">
              <dt className="sr-only">{tRoot(item.labelKey)}</dt>
              <dd className="text-5xl font-bold">{tRoot(item.valueKey)}</dd>
              <dd className="text-muted-foreground">{tRoot(item.labelKey)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
