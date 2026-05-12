"use client";
import { Button } from "@/components/ui-primitives/dark-pricing-button";
import { Check } from "lucide-react";
import Link from "next/link";
import { CardTitle, CardDescription } from "@/components/ui-primitives/dark-pricing-card";
import { useState } from "react";
import NumberFlow from "@number-flow/react";

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");
  const annualReduction = 0.75;

  const prices = {
    pro: {
      monthly: 19,
      annually: 19 * annualReduction,
    },
    startup: {
      monthly: 49,
      annually: 49 * annualReduction,
    },
  };

  return (
    <section>
      <div className="pt-12 pb-16 md:pb-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12">
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
          <div className="@container lg:-mx-8">
            <div className="mx-auto @max-4xl:max-w-sm">
              <div className="*:ring-border-illustration grid gap-6 *:rounded-xl *:p-8 *:ring-1 @4xl:grid-cols-3">
                <div className="ring-border row-span-4 grid grid-rows-subgrid gap-8">
                  <div className="self-end">
                    <CardTitle className="text-lg font-medium">Free</CardTitle>
                    <div className="text-muted-foreground mt-1 text-sm text-balance">
                      For developers trying out Acme for the first time
                    </div>
                  </div>

                  <div>
                    <NumberFlow value={0} prefix="$" className="text-3xl font-semibold" />
                    <div className="text-muted-foreground text-sm">Per month</div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="#">Get Started</Link>
                  </Button>

                  <ul className="space-y-4 text-sm">
                    {[
                      "Basic Analytics Dashboard",
                      "5GB Cloud Storage",
                      "Email and Chat Support",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check
                          className="text-muted-foreground size-3"
                          strokeWidth={3.5}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card ring-border row-span-4 grid grid-rows-subgrid gap-8 border border-transparent shadow-xl ring-1 backdrop-blur">
                  <div className="self-end">
                    <CardTitle className="text-lg font-medium">Pro</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1 text-sm text-balance">
                      Ideal for developers who need more features and support
                    </CardDescription>
                  </div>

                  <div>
                    <NumberFlow
                      value={prices.pro[billingPeriod]}
                      format={{
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }}
                      className="text-3xl font-semibold"
                    />
                    <div className="text-muted-foreground text-sm">Per month</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="#">Get Started</Link>
                  </Button>

                  <ul className="space-y-4 text-sm">
                    {[
                      "Everything in Free Plan, plus:",
                      "5GB Cloud Storage",
                      "Email and Chat Support",
                      "Access to Community Forum",
                      "Single User Access",
                      "Access to Basic Templates",
                      "Mobile App Access",
                      "1 Custom Report Per Month",
                      "Monthly Product Updates",
                      "Standard Security Features",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="group flex items-center gap-2 first:font-medium"
                      >
                        <Check
                          className="text-muted-foreground size-3 group-first:hidden"
                          strokeWidth={3.5}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ring-border row-span-4 grid grid-rows-subgrid gap-8">
                  <div className="self-end">
                    <CardTitle className="text-lg font-medium">Startup</CardTitle>
                    <CardDescription className="text-muted-foreground mt-1 text-sm text-balance">
                      For startups that need more advanced features and support.
                    </CardDescription>
                  </div>

                  <div>
                    <NumberFlow
                      value={prices.startup[billingPeriod]}
                      format={{
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }}
                      className="text-3xl font-semibold"
                    />
                    <div className="text-muted-foreground text-sm">Per month</div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="#">Get Started</Link>
                  </Button>

                  <ul className="space-y-4 text-sm">
                    {[
                      "Everything in Pro Plan, plus:",
                      "5GB Cloud Storage",
                      "Email and Chat Support",
                      "Multi-User Access",
                      "1 Custom Report Per Month",
                      "Monthly Product Updates",
                      "Standard Security Features",
                      "Access to Advanced Templates",
                      "Access to Community Forum",
                      "Mobile App Access",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="group flex items-center gap-2 first:font-medium"
                      >
                        <Check
                          className="text-muted-foreground size-3 group-first:hidden"
                          strokeWidth={3.5}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
