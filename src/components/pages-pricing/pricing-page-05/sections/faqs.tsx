/* eslint-disable -- Acme Pro upstream verbatim, kept as-is */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-effects/grid-2-pricing-two-accordion";
import Link from "next/link";
import {
  Container,
  Separator,
} from "@/components/ui-effects/grid-2-pricing-two-container";

export function FAQs() {
  const faqItems = [
    {
      group: "General",
      items: [
        {
          id: "item-1",
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 3-5 business days, depending on your location. Express shipping options are available at checkout for 1-2 business day delivery.",
        },
        {
          id: "item-2",
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. For enterprise customers, we also offer invoicing options.",
        },
        {
          id: "item-3",
          question: "Can I change or cancel my order?",
          answer:
            "You can modify or cancel your order within 1 hour of placing it. After this window, please contact our customer support team who will assist you with any changes.",
        },
      ],
    },
    {
      group: "Shipping",
      items: [
        {
          id: "item-1",
          question: "Do you ship internationally?",
          answer:
            "Standard shipping takes 3-5 business days, depending on your location. Express shipping options are available at checkout for 1-2 business day delivery.",
        },
        {
          id: "item-2",
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some specialty items may have different return terms, which will be noted on the product page.",
        },
        {
          id: "item-3",
          question: "Do you ship internationally?",
          answer:
            "Standard shipping takes 3-5 business days, depending on your location. Express shipping options are available at checkout for 1-2 business day delivery.",
        },
      ],
    },
  ];

  return (
    <section id="faqs">
      <Separator />
      <Container asGrid className="md:**:data-[slot=content]:py-0">
        <div className="grid gap-px @2xl:grid-cols-[1fr_auto_1fr] @4xl:grid-cols-4">
          <div aria-hidden data-grid-content className="@max-2xl:hidden" />

          <div className="w-full @2xl:@max-4xl:w-lg @4xl:col-span-2">
            <div className="flex flex-col gap-px">
              <div data-grid-content className="p-6 @4xl:p-8">
                <h2 className="text-foreground text-4xl font-semibold">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground mt-4 text-lg text-balance">
                  Discover quick and comprehensive answers to common questions about our
                  platform, services, and features.
                </p>
              </div>

              <div
                data-grid-content
                className="space-y-8 pt-6 pb-2 md:col-span-3 @4xl:px-2 @4xl:pt-8"
              >
                {faqItems.map((item) => (
                  <div className="space-y-2" key={item.group}>
                    <h3 className="text-foreground pl-6 text-lg font-semibold">
                      {item.group}
                    </h3>
                    <Accordion type="single" collapsible className="-space-y-1">
                      {item.items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="data-[state=open]:bg-muted group peer rounded-2xl border-none px-6 py-1 data-[state=open]:border-none"
                        >
                          <AccordionTrigger className="cursor-pointer rounded-none text-base transition-none not-group-last:border-b hover:no-underline data-[state=open]:border-transparent hover:[&>svg]:translate-y-1 hover:data-[state=open]:[&>svg]:translate-y-0">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground text-base">
                              {item.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>

              <div data-grid-content>
                <p className="text-muted-foreground p-6 text-balance @4xl:p-8">
                  Can't find what you're looking for? Contact our{" "}
                  <Link href="#" className="text-primary font-medium hover:underline">
                    customer support team
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div aria-hidden data-grid-content className="@max-2xl:hidden" />
        </div>
      </Container>
      <Separator />
    </section>
  );
}
