import { useTranslations } from "next-intl";
import type { Stats3Block } from "./schema";

export default function Stats3(props: Readonly<Stats3Block>) {
  const t = useTranslations();

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-semibold text-balance lg:text-5xl"
          >
            {t(props.titleKey)}
          </h2>
          <p className="text-muted-foreground">{t(props.introKey)}</p>
        </div>

        <dl className="grid gap-0.5 *:text-center md:grid-cols-3">
          {props.items.map((item, i) => (
            <div key={i} className="space-y-4 rounded-(--radius) border py-12">
              <dt className="sr-only">{t(item.labelKey)}</dt>
              <dd className="text-5xl font-bold">{t(item.valueKey)}</dd>
              <dd className="text-muted-foreground">{t(item.labelKey)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
