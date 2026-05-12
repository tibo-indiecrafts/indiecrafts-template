"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { useScopedT } from "@/i18n/scoped-t";
import { faq09Namespace } from "./config";
import type { FaqBlock } from "./schema";

/**
 * Tailark `mist-faqs-2` — JSX verbatim. 2-col mist FAQ on `py-16
 * md:py-24` inside `max-w-5xl`. `md:grid-cols-5` split:
 *  - Left (`md:col-span-2`): `text-4xl font-semibold` title + lg
 *    body + (on md+) inline contact prompt + link
 *  - Right (`md:col-span-3`): single Accordion (no card chrome —
 *    items separated by default border lines, `text-base` trigger)
 *  - Mobile-only contact prompt below the Accordion (`md:hidden`)
 */
export default function Faq(props: Readonly<FaqBlock>) {
  const [, , tRoot] = useScopedT(faq09Namespace);
  const headingId = `${props.id}-heading`;

  const contactPrompt: ReactNode = (
    <>
      {tRoot(props.contactPromptKey)}{" "}
      <Link href={props.contactHref} className="text-primary font-medium hover:underline">
        {tRoot(props.contactLinkKey)}
      </Link>
    </>
  );

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-2">
            <h2 id={headingId} className="text-foreground text-4xl font-semibold">
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg text-balance">
              {tRoot(props.bodyKey)}
            </p>
            <p className="text-muted-foreground mt-6 hidden md:block">{contactPrompt}</p>
          </div>

          <div className="md:col-span-3">
            <Accordion type="single" collapsible>
              {props.items.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {tRoot(item.questionKey)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{tRoot(item.answerKey)}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="text-muted-foreground mt-6 md:hidden">{contactPrompt}</p>
        </div>
      </div>
    </section>
  );
}
