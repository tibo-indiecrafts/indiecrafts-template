import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import type { Faq4Block } from "./schema";

export default function Faq4(props: Readonly<Faq4Block>) {
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
            className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1"
          >
            {props.items.map((item) => (
              <div key={item.id} className="group">
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {t(item.questionKey)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{t(item.answerKey)}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
              </div>
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
