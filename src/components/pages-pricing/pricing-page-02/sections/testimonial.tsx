/* eslint-disable -- Acme Pro upstream verbatim, kept as-is */
import { Container } from "@/components/ui-primitives/grid-1-pricing-container";
import { Quote } from "lucide-react";
import { Stripe } from "@/components/ui-primitives/svgs/grid-1-pricing-stripe";

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";

export const Testimonial = () => {
  return (
    <section>
      <Container className="**:data-[slot=content]:bg-background border-dashed **:data-[slot=content]:py-0 max-lg:**:data-[slot=content]:px-6">
        <div className="mx-auto max-w-2xl py-12 lg:pt-16">
          <Quote
            aria-hidden
            className="fill-background stroke-background size-6 drop-shadow-sm"
          />
          <Stripe className="mt-6 h-auto w-16" />
          <div className="mt-6">
            <p className='text-xl *:leading-relaxed before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-2xl'>
              Using Acme has been like unlocking a secret design superpower. It's the
              perfect fusion of simplicity and versatility, enabling us to create UIs that
              are as stunning as they are user-friendly.
            </p>

            <div className="mt-12 flex items-center gap-3">
              <div className="ring-foreground/10 aspect-square size-10 overflow-hidden rounded-lg border border-transparent shadow-md ring-1 shadow-black/15">
                <img
                  src={MESCHAC_AVATAR}
                  alt="Méschac Irung"
                  loading="lazy"
                  width={460}
                  height={460}
                />
              </div>
              <div className="space-y-px">
                <p className="text-sm font-medium">Méschac Irung</p>
                <p className="text-muted-foreground text-xs">Founder & CEO, Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Container aria-hidden className="border-dashed **:data-[slot=content]:py-12">
        <div />
      </Container>
    </section>
  );
};
