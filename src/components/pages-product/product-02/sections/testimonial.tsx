import { Container } from "@/components/ui-effects/grid-2-product-two-container";
import Image from "next/image";
import { Spotify } from "@/components/ui-primitives/svgs/grid-2-product-two-spotify";

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";

export const TestimonialSection = () => {
  return (
    <Container className="bg-background border-dashed">
      <div className="grid @4xl:grid-cols-10">
        <div className="max-w-2xl p-6 md:py-12 lg:py-20 @4xl:col-span-8 @4xl:col-start-2 @4xl:pl-12">
          <Spotify className="h-7 w-20" />

          <div className="mt-6 lg:mt-12">
            <p className='text-xl *:leading-relaxed before:mr-1 before:content-["\201C"] after:ml-1 after:content-["\201D"] md:text-2xl'>
              Using Acme has been like unlocking a secret design superpower. It&apos;s the
              perfect fusion of simplicity and versatility, enabling us to create UIs that
              are as stunning as they are user-friendly.
            </p>

            <div className="mt-12 flex items-center gap-3">
              <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
                <Image src={MESCHAC_AVATAR} alt="Meschac Avatar" width={56} height={56} />
              </div>

              <div className="space-y-px">
                <p className="text-sm font-medium">Meschac Irung</p>
                <p className="text-muted-foreground text-xs">Creator of Acme</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
