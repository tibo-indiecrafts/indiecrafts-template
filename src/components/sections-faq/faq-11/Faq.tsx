"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { useScopedT } from "@/i18n/scoped-t";
import { faq11Namespace } from "./config";
import type { FaqBlock } from "./schema";

/**
 * Tailark `faqs-2` (dusk-kit) — JSX verbatim. Centered narrow
 * column with `max-w-xl` heading (`text-3xl font-bold md:text-4xl
 * lg:text-5xl`) + balanced body, then a chrome-card Accordion
 * (`bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm
 * ring-4 dark:ring-0`) with `border-dashed` AccordionItems. Inline
 * centered contact prompt below, indented `px-8` to align under the
 * Accordion's inner padding.
 */
export default function Faq(props: Readonly<FaqBlock>) {
  const [, , tRoot] = useScopedT(faq11Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2
            id={headingId}
            className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl"
          >
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            {tRoot(props.bodyKey)}
          </p>
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
                  {tRoot(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{tRoot(item.answerKey)}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8">
            {tRoot(props.contactPromptKey)}{" "}
            <Link
              href={props.contactHref}
              className="text-primary font-medium hover:underline"
            >
              {tRoot(props.contactLinkKey)}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
