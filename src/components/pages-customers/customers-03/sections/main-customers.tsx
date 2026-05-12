import { Container } from "@/components/ui-primitives/grid-2-customers-one-container";

import { Bolt } from "@/components/ui-primitives/svgs/grid-2-customers-one-bolt";
import { SupabaseLight as Supabase } from "@/components/ui-primitives/svgs/grid-2-customers-one-supabase";

import Link from "next/link";

import { ChevronRight } from "lucide-react";

export function MainCustomers() {
  return (
    <section>
      <Container asGrid className="grid @4xl:grid-cols-10">
        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
        <div className="@4xl:col-span-8">
          <div className="grid gap-px @2xl:grid-cols-2">
            <div
              data-grid-content
              className="group relative row-span-4 grid grid-rows-subgrid gap-12 p-8 @4xl:p-12"
            >
              <Bolt className="*:last:fill-foreground! h-7 w-18" />
              <p className="text-3xl font-normal">
                our streaming optimization suite to{" "}
                <span className="text-foreground font-semibold">
                  reduce buffering by 62% during peak viewing hours.
                </span>
              </p>

              <Link
                href="#"
                className="text-primary flex items-center font-medium before:absolute before:inset-0"
              >
                Read Story
                <ChevronRight
                  className="ml-2 size-3 translate-y-0.5 duration-200 group-hover:translate-x-0.5"
                  strokeWidth={3}
                />
              </Link>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 *:block">
                  <span className="text-2xl font-semibold">
                    99.9 <span className="text-foreground/75 text-lg">%</span>
                  </span>
                  <p className="text-sm text-balance">
                    <strong className="font-medium">Uptime guarantee</strong> for all our
                    services.
                  </p>
                </div>
                <div className="space-y-2 *:block">
                  <span className="text-2xl font-semibold">24/7</span>
                  <p className="text-sm text-balance">
                    <strong className="font-medium">24/7 support</strong> available around
                    the clock.
                  </p>
                </div>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded opacity-0 shadow-2xl shadow-indigo-900/15 duration-200 group-hover:opacity-100"
              />
            </div>

            <div
              data-grid-content
              className="group relative row-span-4 grid grid-rows-subgrid gap-12 p-8 @4xl:p-12"
            >
              <Supabase className="h-8 w-36" />
              <p className="text-3xl font-normal">
                Prime implemented our streaming optimization suite to{" "}
                <span className="text-foreground font-semibold">
                  reduce buffering by 62% during peak viewing hours.
                </span>
              </p>

              <Link
                href="#"
                className="text-primary flex items-center font-medium before:absolute before:inset-0"
              >
                Read Story
                <ChevronRight
                  className="ml-2 size-3 translate-y-0.5 duration-200 group-hover:translate-x-0.5"
                  strokeWidth={3}
                />
              </Link>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 *:block">
                  <span className="text-2xl font-semibold">
                    99.9 <span className="text-foreground/75 text-lg">%</span>
                  </span>
                  <p className="text-sm text-balance">
                    <strong className="font-medium">Uptime guarantee</strong> for all our
                    services.
                  </p>
                </div>
                <div className="space-y-2 *:block">
                  <span className="text-2xl font-semibold">24/7</span>
                  <p className="text-sm text-balance">
                    <strong className="font-medium">24/7 support</strong> available around
                    the clock.
                  </p>
                </div>
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded opacity-0 shadow-2xl shadow-indigo-900/15 duration-200 group-hover:opacity-100"
              />
            </div>
          </div>
        </div>
        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
      </Container>
      <Container>
        <div className="h-16"></div>
      </Container>
    </section>
  );
}
