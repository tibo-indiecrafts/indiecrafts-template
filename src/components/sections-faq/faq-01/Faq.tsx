import { useScopedT } from "@/i18n/scoped-t";
import { faq01Namespace } from "./config";
import type { FaqBlock } from "./schema";

export default function Faq(props: Readonly<FaqBlock>) {
  const [, tr, tRoot] = useScopedT(faq01Namespace);

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
              {tr(props.titleKey, "title")}
            </h2>
            {props.bodyKey ? (
              <p className="text-muted-foreground">{tr(props.bodyKey, "body")}</p>
            ) : null}
          </div>
          <dl className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            {props.items.map((item, i) => (
              <div key={item.id} className={i === 0 ? "pb-6" : "py-6"}>
                <dt className="font-medium">{tRoot(item.questionKey)}</dt>
                <dd className="text-muted-foreground mt-4">{tRoot(item.answerKey)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
