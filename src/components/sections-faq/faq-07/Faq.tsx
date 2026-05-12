"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { useScopedT } from "@/i18n/scoped-t";
import { faq07Namespace } from "./config";
import type { FaqBlock } from "./schema";

/**
 * Tailark `veil-faqs-3` — JSX verbatim. Centered single-column FAQ
 * accordion on `bg-background @container py-24` inside `max-w-2xl`.
 * Each item is wrapped in a `group` div so the divider hairline
 * (`<hr>`) hides on the active row + on the last item. Active row
 * itself gets a `data-[state=open]:bg-muted/50 rounded-xl` tint.
 * Closing line: contact prompt + inline link. Default Tailwind
 * font (no `font-serif` override).
 */
export default function Faq(props: Readonly<FaqBlock>) {
  const [, , tRoot] = useScopedT(faq07Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <h2 id={headingId} className="text-center text-4xl font-medium">
          {tRoot(props.titleKey)}
        </h2>
        <Accordion type="single" collapsible className="mt-12">
          {props.items.map((item) => (
            <div className="group" key={item.id}>
              <AccordionItem
                value={item.id}
                className="data-[state=open]:bg-muted/50 peer rounded-xl border-none px-5 py-1 transition-colors"
              >
                <AccordionTrigger className="cursor-pointer py-4 text-sm font-medium hover:no-underline">
                  {tRoot(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground pb-2 text-sm">
                    {tRoot(item.answerKey)}
                  </p>
                </AccordionContent>
              </AccordionItem>
              <hr className="mx-5 group-last:hidden peer-data-[state=open]:opacity-0" />
            </div>
          ))}
        </Accordion>
        <p className="text-muted-foreground mt-8 text-center text-sm">
          {tRoot(props.contactPromptKey)}{" "}
          <Link
            href={props.contactHref}
            className="text-primary font-medium hover:underline"
          >
            {tRoot(props.contactLinkKey)}
          </Link>
        </p>
      </div>
    </section>
  );
}
