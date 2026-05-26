"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Clock, CreditCard, Globe, Package, Truck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { useScopedT } from "@/components/_lib/scoped-t";
import { faq12Namespace } from "./config";
import type { FaqBlock, FaqIcon } from "./schema";

const ICON_REGISTRY: Record<FaqIcon, LucideIcon> = {
  clock: Clock,
  creditCard: CreditCard,
  truck: Truck,
  globe: Globe,
  package: Package,
};

export default function Faq(props: Readonly<FaqBlock>) {
  const [, , tRoot] = useScopedT(faq12Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-muted dark:bg-background py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 id={headingId} className="mt-4 text-3xl font-bold">
                {tRoot(props.titleKey)}
              </h2>
              <p className="text-muted-foreground mt-4">
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
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {props.items.map((item) => {
                const Icon = ICON_REGISTRY[item.iconKey];
                return (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="bg-background rounded-lg border px-4 shadow-xs last:border-b"
                  >
                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex size-6">
                          <Icon aria-hidden className="m-auto size-4" />
                        </div>
                        <span className="text-base">{tRoot(item.questionKey)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5">
                      <div className="px-9">
                        <p className="text-base">{tRoot(item.answerKey)}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
