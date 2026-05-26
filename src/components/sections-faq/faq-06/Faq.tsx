"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { CreditCard, HelpCircle, Package } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import { faq06Namespace } from "./config";
import type { FaqBlock, FaqIcon } from "./schema";

const ICON_REGISTRY: Record<FaqIcon, LucideIcon> = {
  package: Package,
  creditCard: CreditCard,
  helpCircle: HelpCircle,
};

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-muted/40 text-card-foreground rounded-xl border", className)}
    {...props}
  />
);

export default function Faq(props: Readonly<FaqBlock>) {
  const [, , tRoot] = useScopedT(faq06Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            {tRoot(props.bodyKey)}
          </p>
        </div>
        <div className="mt-12 space-y-3">
          {props.categories.map((category, index) => {
            const Icon = ICON_REGISTRY[category.iconKey];
            return (
              <Card key={index} className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Icon aria-hidden className="text-muted-foreground size-4" />
                  <h3 className="text-foreground font-medium">
                    {tRoot(category.titleKey)}
                  </h3>
                </div>
                <Accordion type="single" collapsible>
                  {category.items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="border-dashed last:border-b-0"
                    >
                      <AccordionTrigger className="cursor-pointer py-3 text-sm font-medium hover:no-underline">
                        {tRoot(item.questionKey)}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground pb-1 text-sm">
                          {tRoot(item.answerKey)}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            );
          })}
        </div>
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
