"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { useScopedT } from "@/i18n/scoped-t";
import { faq10Namespace } from "./config";
import type { FaqBlock } from "./schema";

export default function Faq(props: Readonly<FaqBlock>) {
  const [, , tRoot] = useScopedT(faq10Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-12">
          <h2
            id={headingId}
            className="text-foreground text-center text-4xl font-semibold"
          >
            {tRoot(props.titleKey)}
          </h2>

          <Accordion type="single" collapsible className="-mx-2 sm:mx-0">
            {props.items.map((item) => (
              <div className="group" key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-muted peer rounded-xl border-none px-5 py-1 data-[state=open]:border-none md:px-7"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {tRoot(item.questionKey)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{tRoot(item.answerKey)}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-5 -mb-px group-last:hidden peer-data-[state=open]:opacity-0 md:mx-7" />
              </div>
            ))}
          </Accordion>

          <p className="text-muted-foreground text-center">
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
