import Link from "next/link";
import { Container } from "@/components/ui-primitives/grid-1-customers-one-container";
import { Bolt } from "@/components/ui-primitives/svgs/grid-1-customers-one-bolt";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { PrimeVideo } from "@/components/ui-primitives/svgs/grid-1-customers-one-prime-video";

export function MainCustomers() {
  return (
    <section className="bg-muted/50">
      <Container className="border-0 bg-transparent mask-t-from-50% **:data-[slot=content]:pt-0">
        <div />
      </Container>
      <Container className="bg-transparent **:data-[slot=content]:py-0">
        <div
          aria-hidden
          className="absolute inset-x-0 -inset-y-6 mx-auto w-px border-l border-dashed @max-4xl:hidden"
        />
        <div className="grid gap-4 @4xl:grid-cols-2">
          <div
            data-theme="dark"
            className="text-foreground bg-background group relative overflow-hidden rounded-2xl p-8 shadow-xl inset-ring-1 shadow-black/35 @4xl:p-12"
          >
            <div className="relative z-1 space-y-12">
              <Bolt className="*:fill-foreground h-8 w-18" />
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
            </div>
            <div className="absolute inset-0 overflow-hidden mask-b-from-25% opacity-50 duration-200 group-hover:opacity-35">
              <Image
                src="https://images.unsplash.com/photo-1637952112301-6090dca83ccb?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="testimonial background"
                className="size-full object-cover"
                width={2428}
                height={1518}
                sizes="(min-width: 1280px) 1024px, 100vw"
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-1 overflow-hidden rounded-xl border border-white/10 bg-white/5"
            />
          </div>
          <div
            data-theme="dark"
            className="text-foreground bg-background group relative overflow-hidden rounded-2xl shadow-xl shadow-black/35"
          >
            <div className="relative z-1 space-y-12 p-8 @4xl:p-12">
              <PrimeVideo className="h-8 w-24" />
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
            </div>
            <div className="absolute inset-0 overflow-hidden opacity-35 duration-200 group-hover:opacity-25">
              <Image
                src="https://images.unsplash.com/photo-1564330583741-f25fbb9970f4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="testimonial background"
                className="size-full object-cover object-bottom"
                width={2832}
                height={1593}
                sizes="(min-width: 1280px) 1024px, 100vw"
              />
            </div>
            <div
              aria-hidden
              className="absolute inset-1 overflow-hidden rounded-xl border border-white/10 bg-white/5"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
