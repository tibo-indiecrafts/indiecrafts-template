import { useTranslations } from "next-intl";
import type { Faq1Block } from "./schema";

export default function Faq1(props: Readonly<Faq1Block>) {
  const t = useTranslations();

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="scroll-py-16 border-b py-16 md:scroll-py-32 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
          <div className="text-center lg:text-left">
            <h2
              id={`${props.id}-title`}
              className="mb-4 text-3xl font-semibold md:text-4xl"
            >
              {t(props.titleKey)}
            </h2>
            {props.bodyKey ? (
              <p className="text-muted-foreground">{t(props.bodyKey)}</p>
            ) : null}
          </div>
          <dl className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            {props.items.map((item, i) => (
              <div key={item.id} className={i === 0 ? "pb-6" : "py-6"}>
                <dt className="font-medium">{t(item.questionKey)}</dt>
                <dd className="text-muted-foreground mt-4">{t(item.answerKey)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
