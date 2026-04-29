import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import type { Faq2Block } from "./schema";

export default function Faq2(props: Readonly<Faq2Block>) {
  const t = useTranslations();

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="mx-auto max-w-xl text-center">
          <h2
            id={`${props.id}-title`}
            className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl"
          >
            {t(props.titleKey)}
          </h2>
          {props.bodyKey ? (
            <p className="text-muted-foreground mt-4 text-balance">{t(props.bodyKey)}</p>
          ) : null}
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {props.items.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-dashed">
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {t(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{t(item.answerKey)}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {props.supportTextKey && props.supportLinkKey && props.supportHref ? (
            <p className="text-muted-foreground mt-6 px-8">
              {t(props.supportTextKey)}{" "}
              <a
                href={props.supportHref}
                className="text-primary font-medium hover:underline"
              >
                {t(props.supportLinkKey)}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
