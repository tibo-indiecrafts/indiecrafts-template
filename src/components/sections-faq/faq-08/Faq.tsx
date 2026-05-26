"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { useScopedT } from "@/components/_lib/scoped-t";
import { faq08Namespace } from "./config";
import type { FaqBlock } from "./schema";

export default function Faq(props: Readonly<FaqBlock>) {
  const [, , tRoot] = useScopedT(faq08Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div>
          <h2 id={headingId} className="text-foreground text-4xl font-semibold">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-balance">
            {tRoot(props.bodyKey)}
          </p>
        </div>

        <div className="mt-12">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-foreground/5 w-full rounded-(--radius) border border-transparent px-8 py-3 shadow ring-1"
          >
            {props.items.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-dotted">
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {tRoot(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{tRoot(item.answerKey)}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6">
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
