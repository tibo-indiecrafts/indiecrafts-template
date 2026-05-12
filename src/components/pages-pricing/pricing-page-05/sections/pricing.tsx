/* eslint-disable -- Tailark Pro upstream verbatim, kept as-is */
"use client";
import { Button } from "@/components/ui-primitives/grid-2-pricing-two-button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  CardTitle,
  CardDescription,
} from "@/components/ui-primitives/grid-2-pricing-two-card";
import { useState } from "react";
import NumberFlow from "@number-flow/react";
import {
  Container,
  Separator,
} from "@/components/ui-primitives/grid-2-pricing-two-container";

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");

  const annualReduction = 0.75;

  const price = {
    monthly: 349,
    annually: Math.round(349 * annualReduction),
  };

  const features = [
    "Team Collaboration",
    "Custom Templates",
    "24/7 Customer Support",
    "API Access",
    "White Labeling",
    "SSO Integration",
    "Dedicated Manager",
    "Custom Reporting",
  ];

  return (
    <section>
      <Container asGrid className="**:data-[slot=content]:pt-12">
        <div>
          <div data-grid-content className="p-6">
            <div
              data-period={billingPeriod}
              className="bg-foreground/5 *:text-foreground/75 relative mx-auto grid w-fit grid-cols-2 rounded-full p-1 *:block *:h-8 *:w-24 *:rounded-full *:text-sm *:hover:opacity-75"
            >
              <div
                aria-hidden
                className="bg-card ring-foreground/5 pointer-events-none absolute inset-1 w-1/2 translate-x-full rounded-full border border-transparent shadow ring-1 transition-transform duration-500 ease-in-out in-data-[period=monthly]:translate-x-0"
              />
              <button
                onClick={() => setBillingPeriod("monthly")}
                {...(billingPeriod === "monthly" && { "data-active": true })}
                className="data-active:text-foreground relative data-active:font-medium"
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annually")}
                {...(billingPeriod === "annually" && { "data-active": true })}
                className="data-active:text-foreground relative data-active:font-medium"
              >
                Annually
              </button>
            </div>
            <div className="mt-3 text-center text-xs">
              <span className="text-primary font-medium">Save 25%</span> On Annual Billing
            </div>
          </div>
        </div>
        <div className="grid gap-px @2xl:grid-cols-[1fr_auto_1fr] @4xl:grid-cols-4">
          <div aria-hidden data-grid-content className="@max-2xl:hidden" />

          <div className="grid w-full grid-cols-2 gap-px @2xl:@max-4xl:w-lg @4xl:col-span-2">
            <div
              data-grid-content
              className="bg-card relative col-span-full space-y-6 p-6 text-center shadow-2xl shadow-indigo-900/15 @4xl:p-8"
            >
              <div>
                <CardTitle className="text-2xl font-medium">
                  All-in-One Solution
                </CardTitle>
                <CardDescription className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm text-balance">
                  Everything you need in one simple plan
                </CardDescription>
              </div>
              <div className="mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-3">
                <NumberFlow
                  value={price[billingPeriod]}
                  format={{
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }}
                  className="[font-feature-settings:'tnum'] text-5xl font-bold tracking-tight"
                />
                <div className="text-left">
                  <span className="text-sm">Per month</span>
                  <div className="text-muted-foreground w-22 text-xs">
                    Billed {billingPeriod}
                  </div>
                </div>
              </div>
              <Button asChild size="lg">
                <Link href="#">Get Started Now</Link>
              </Button>
              <div
                aria-hidden
                className="mx-16 h-px bg-[linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] bg-size-[6px_1px] bg-repeat-x opacity-25"
              />
              <CardDescription className="text-muted-foreground mx-auto mt-1 max-w-xs text-sm text-balance">
                No hidden fees. Cancel anytime. Invoices available for easy reimbursement
              </CardDescription>
            </div>

            <div data-grid-content className="p-6 @4xl:p-8">
              <ul role="list" className="grid gap-4 text-left text-sm">
                {features.slice(0, 4).map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 shrink-0 fill-emerald-500/10 stroke-emerald-500/15 *:last:stroke-emerald-600 *:last:drop-shadow dark:*:last:stroke-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div data-grid-content className="p-6 @4xl:p-8">
              <ul role="list" className="grid gap-4 text-left text-sm">
                {features.slice(4).map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 shrink-0 fill-emerald-500/10 stroke-emerald-500/15 *:last:stroke-emerald-600 *:last:drop-shadow dark:*:last:stroke-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div aria-hidden data-grid-content className="@max-2xl:hidden" />
        </div>
      </Container>
      <Separator />
    </section>
  );
}
