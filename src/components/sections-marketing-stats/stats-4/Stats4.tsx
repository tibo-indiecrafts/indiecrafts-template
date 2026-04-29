import { useTranslations } from "next-intl";
import type { Stats4Block } from "./schema";

export default function Stats4(props: Readonly<Stats4Block>) {
  const t = useTranslations();

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-12">
        <div className="relative z-10 max-w-xl space-y-6">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-medium text-balance lg:text-5xl"
          >
            {t(props.titleKey)}
          </h2>
          <p>
            <span className="font-medium">{t(props.leadKey)}</span>
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div>
            <p className="text-muted-foreground">{t(props.supportingKey)}</p>
            <dl className="mt-12 mb-12 grid grid-cols-2 gap-2 md:mb-0">
              {props.items.map((item, i) => (
                <div key={i} className="space-y-4">
                  <dt className="sr-only">{t(item.labelKey)}</dt>
                  <dd className="from-foreground to-muted-foreground bg-linear-to-r bg-clip-text text-5xl font-bold text-transparent">
                    {t(item.valueKey)}
                  </dd>
                  <dd className="text-muted-foreground">{t(item.labelKey)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <blockquote className="border-l-4 pl-4">
              <p>{t(props.quoteKey)}</p>
              <cite className="mt-6 block font-medium not-italic">
                {t(props.authorKey)}
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
