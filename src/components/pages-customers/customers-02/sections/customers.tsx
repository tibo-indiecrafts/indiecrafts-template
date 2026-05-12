import Link from "next/link";
import { Container } from "@/components/ui-primitives/grid-1-customers-one-container";
import { ReactNode } from "react";

import { Stripe } from "@/components/ui-primitives/svgs/grid-1-customers-one-stripe";
import { Hulu } from "@/components/ui-primitives/svgs/grid-1-customers-one-hulu";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/grid-1-customers-one-vercel";
import { Beacon } from "@/components/ui-primitives/svgs/grid-1-customers-one-beacon";
import { ChevronRight } from "lucide-react";

interface Customer {
  name: string;
  logo: ReactNode;
  title: string;
  description: string;
  url: string;
}

export function Customers() {
  const customers: Customer[] = [
    {
      name: "Stripe",
      logo: <Stripe className="h-7 w-16" />,
      title: "65% Faster",
      description: "How Stripe is scaling their marketing websites.",
      url: "#",
    },
    {
      name: "Hulu",
      logo: <Hulu className="h-6 w-17" />,
      title: "High-performance",
      description: "How Hulu is building and scaling their marketing websites.",
      url: "#",
    },
    {
      name: "Vercel",
      logo: <VercelFull className="h-6 w-28" />,
      title: "Fast and secure",
      description: "How Vercel is building and scaling their marketing websites.",
      url: "#",
    },
    {
      name: "Beacon",
      logo: <Beacon className="h-6 w-24" />,
      title: "Improved workflow",
      description: "How Beacon is transforming their marketing websites.",
      url: "#",
    },
  ];

  return (
    <section id="customers">
      <Container aria-hidden className="border-dashed **:data-[slot=content]:py-8">
        <div />
      </Container>
      <Container className="border-b-dashed border-b md:**:data-[slot=content]:py-0">
        <div
          aria-hidden
          className="absolute inset-x-0 -inset-y-10 mx-auto w-px border-l border-dashed @max-3xl:hidden"
        />
        <div className="grid @max-3xl:border-y @3xl:grid-cols-2">
          {customers.map((customer) => (
            <div
              key={customer.name}
              className="hover:bg-card group relative row-span-3 grid grid-rows-subgrid gap-12 p-8 @max-3xl:not-last:border-b @3xl:p-12 @3xl:not-nth-last-2:border-b @3xl:last:border-b-0"
            >
              <div className="not-group-hover:**:fill-foreground mb-8 shrink-0">
                {customer.logo}
              </div>

              <div>
                <span className="text-muted-foreground text-sm">{customer.title}.</span>
                <p className="text-foreground balance mt-3 text-3xl font-semibold">
                  {customer.description}
                </p>
              </div>
              <Link
                href={customer.url}
                className="text-primary flex items-center text-sm font-medium before:absolute before:inset-0"
              >
                Read Story
                <ChevronRight
                  className="ml-2 size-3 translate-y-px duration-200 group-hover:translate-x-0.5"
                  strokeWidth={3}
                />
              </Link>
            </div>
          ))}
        </div>
      </Container>
      <Container
        aria-hidden
        className="border-t-0 border-dashed bg-transparent mask-b-from-65% **:data-[slot=content]:py-6"
      >
        <div />
      </Container>
    </section>
  );
}
