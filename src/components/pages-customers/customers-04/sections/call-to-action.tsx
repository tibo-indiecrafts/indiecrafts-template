import { Button } from "@/components/ui-effects/libre-customers-one-button";
import Link from "next/link";
import { CtaIllustration } from "@/components/ui-illustrations/libre-customers-one-cta-illustration";

export function CallToAction() {
  return (
    <section className="relative border-b">
      <div className="absolute inset-0 mask-b-from-65%">
        <CtaIllustration />
      </div>
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden p-8 md:px-32 md:py-20">
          <div className="relative text-center">
            <h2 className="text-4xl font-semibold text-balance md:text-5xl">
              Create, Sell and Grow
            </h2>
            <p className="text-muted-foreground mt-4 mb-6 text-balance">
              Join a community of over 1000+ companies and developers who have already
              discovered the power of Acme.{" "}
            </p>

            <Button asChild>
              <Link href="#">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
