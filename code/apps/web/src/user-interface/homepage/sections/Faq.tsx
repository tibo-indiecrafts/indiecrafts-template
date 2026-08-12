"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@indiecrafts/ui/accordion";
import { features } from "@indiecrafts/config";
import { getFaqItems } from "@/lib/faq";

/**
 * FAQ section. Editorial two-column layout — a sticky heading column and the
 * accordion beside it — so it reads differently from the centered sections
 * above/below it. Self-contained: reads its Q&A from
 * `messages.pages.<pageId>.faq` and renders nothing when the `faq` feature is
 * off or the page has no items, so callers can mount it unconditionally.
 *
 * The same `faq` messages array feeds FAQPage JSON-LD (`PageSchemas`) and the
 * llms.txt output automatically — see `@/lib/faq`.
 */
export function Faq({ pageId }: Readonly<{ pageId: string }>) {
  const t = useTranslations();

  if (!features.faq) return null;
  const items = getFaqItems(t.raw, pageId);
  if (items.length === 0) return null;

  const titleId = `${pageId}-faq-title`;

  return (
    <section aria-labelledby={titleId} className="border-b py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-8 px-(--gutter) md:grid-cols-[minmax(0,20rem)_1fr]">
        <div className="md:sticky md:top-24 md:self-start">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            {t("faq.eyebrow")}
          </p>
          <h2
            id={titleId}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl"
          >
            {t("faq.title")}
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="py-5 text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground max-w-2xl text-[0.95rem] leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
