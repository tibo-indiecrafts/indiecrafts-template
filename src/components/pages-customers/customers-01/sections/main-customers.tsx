/* eslint-disable -- Acme Pro upstream JSX kept verbatim for fidelity */

import Link from "next/link";
import { Bolt } from "@/components/ui-primitives/svgs/dark-customers-one-bolt";
import { ChevronRight } from "lucide-react";

export function MainCustomers() {
  return (
    <section className="@container relative">
      <div className="dither absolute inset-0 overflow-hidden mask-b-from-65% mask-radial-[85%_100%] mask-radial-from-65% mask-radial-at-bottom-right mix-blend-overlay">
        <img
          src="https://images.unsplash.com/photo-1653511442060-00c7b10827c4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="testimonial background"
          className="size-full object-cover object-left"
          width={2428}
          height={1518}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden mask-b-from-65% mask-radial-[85%_100%] mask-radial-from-65% mask-radial-at-bottom-right blur-2xl">
        <img
          src="https://images.unsplash.com/photo-1653511442060-00c7b10827c4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="testimonial background"
          className="size-full object-cover object-left"
          width={2428}
          height={1518}
        />
      </div>
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-24 md:py-24 lg:pb-36">
        <div className="lg:-mx-12">
          <div
            data-theme="dark"
            className="text-foreground group relative overflow-hidden rounded-2xl bg-[color-mix(in_oklab,var(--color-gray-950)_40%,var(--color-zinc-900))] p-8 shadow-2xl shadow-black/35 @4xl:p-12"
          >
            <div className="relative z-1">
              <div className="max-w-md space-y-12">
                <Bolt className="*:fill-foreground h-8 w-18" />
                <p className="text-3xl font-normal">
                  Bolt implemented our streaming optimization suite to{" "}
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
                      <strong className="font-medium">Uptime guarantee</strong> for all
                      our services.
                    </p>
                  </div>
                  <div className="space-y-2 *:block">
                    <span className="text-2xl font-semibold">24/7</span>
                    <p className="text-sm text-balance">
                      <strong className="font-medium">24/7 support</strong> available
                      around the clock.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="dither-sm absolute inset-0 overflow-hidden mask-radial-[105%_100%] mask-radial-from-65% mask-radial-at-left opacity-7">
              <img
                src="https://images.unsplash.com/photo-1653511442060-00c7b10827c4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="testimonial background"
                className="size-full object-cover object-left"
                width={2428}
                height={1518}
              />
            </div>
            <div className="absolute inset-0 overflow-hidden mask-radial-[85%_100%] mask-radial-from-65% mask-radial-at-bottom-right opacity-75 duration-200 group-hover:opacity-100">
              <img
                src="https://images.unsplash.com/photo-1653511442060-00c7b10827c4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="testimonial background"
                className="size-full object-cover object-left"
                width={2428}
                height={1518}
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl border opacity-75 ring-1 ring-black/25"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
