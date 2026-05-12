import Link from "next/link";
import { ReactNode } from "react";

import { Stripe } from "@/components/ui-primitives/svgs/dark-customers-one-stripe";
import { Hulu } from "@/components/ui-primitives/svgs/dark-customers-one-hulu";
import { VercelWordmark as VercelFull } from "@/components/ui-primitives/svgs/dark-customers-one-vercel";
import { Beacon } from "@/components/ui-primitives/svgs/dark-customers-one-beacon";
import { SupabaseDark as Supabase } from "@/components/ui-primitives/svgs/dark-customers-one-supabase";
import { OpenaiWordmarkDark as OpenAIFull } from "@/components/ui-primitives/svgs/dark-customers-one-openai";

import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui-effects/dark-customers-one-card";

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
    {
      name: "Supabase",
      logo: <Supabase className="h-7 w-32" />,
      title: "Improved workflow",
      description: "How Supabase is transforming their marketing websites.",
      url: "#",
    },
    {
      name: "OpenAI",
      logo: <OpenAIFull className="h-6 w-24" />,
      title: "Improved workflow",
      description: "How OpenAI is transforming their marketing websites.",
      url: "#",
    },
  ];

  return (
    <section id="customers" className="@container">
      <div className="mx-auto max-w-5xl px-6 pb-32">
        <div className="grid grid-cols-2 items-center gap-4 max-md:gap-8 md:grid-cols-4">
          <div className="space-y-0.5 text-center">
            <div className="from-foreground/50 to-foreground/95 bg-linear-to-b bg-clip-text text-7xl font-bold text-transparent [-webkit-text-stroke:0.5px_var(--color-foreground)]">
              90+
            </div>
            <p className="text-muted-foreground">Integrations</p>
          </div>
          <div className="space-y-0.5 text-center">
            <div className="from-foreground/50 to-foreground/95 bg-linear-to-b bg-clip-text text-7xl font-bold text-transparent [-webkit-text-stroke:0.5px_var(--color-foreground)]">
              56%
            </div>
            <p className="text-muted-foreground">Productivity Boost</p>
          </div>
          <div className="col-span-2 max-md:border-t max-md:pt-8 max-md:text-center md:border-l md:pl-12">
            <p className="text-muted-foreground text-lg text-balance">
              Our platform continues to grow with developers and businesses using
              productivity.
            </p>
          </div>
        </div>

        <div className="mt-24 grid gap-6 lg:-mx-8 lg:mt-36 @3xl:grid-cols-2 @4xl:grid-cols-3">
          {customers.map((customer) => (
            <Card
              key={customer.name}
              className="hover:bg-card group relative row-span-3 grid grid-rows-subgrid gap-8 bg-transparent p-6 lg:p-8"
            >
              <div className="not-group-hover:**:fill-foreground mb-2 shrink-0 mask-b-from-0% pb-4">
                {customer.logo}
              </div>

              <div>
                <span className="text-muted-foreground text-sm">{customer.title}.</span>
                <p className="text-foreground balance mt-3 text-xl font-semibold">
                  {customer.description}
                </p>
              </div>
              <Link
                href={customer.url}
                className="text-muted-foreground group-hover:text-primary flex items-center text-sm font-medium before:absolute before:inset-0"
              >
                Read Story
                <ChevronRight
                  className="ml-2 size-3 translate-y-px duration-200 group-hover:translate-x-0.5"
                  strokeWidth={3}
                />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
