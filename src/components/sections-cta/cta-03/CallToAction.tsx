import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui-effects/grid-1-landing-button";
import { Container } from "@/components/ui-effects/grid-1-landing-container";
import { LayoutIllustration } from "@/components/ui-illustrations/grid-1-landing-layout-illustration";
import { useScopedT } from "@/i18n/scoped-t";
import { cta03Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, , tRoot] = useScopedT(cta03Namespace);
  const external = props.primary.href.startsWith("http");

  return (
    <section aria-labelledby={`${props.id}-heading`} className="relative">
      <Container className="**:data-[slot=content]:py-16">
        <span />
      </Container>
      <Container className="relative **:data-[slot=content]:bg-linear-to-b **:data-[slot=content]:from-blue-400 **:data-[slot=content]:to-indigo-500 **:data-[slot=content]:py-0">
        <div
          aria-hidden
          className="dither-xs pointer-events-none absolute inset-0 mask-y-from-75% mask-x-from-65% mask-x-to-95% mix-blend-darken 2xl:mx-auto 2xl:max-w-7xl"
        >
          <div className="size-full">
            <Image
              src="https://images.unsplash.com/photo-1632314813226-fc0ac70d8569?q=80&w=2352&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="size-full -scale-x-100 object-cover"
              width={2224}
              height={1589}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1520px"
            />
          </div>
        </div>
        <div data-theme="dark" className="relative overflow-hidden pt-8 pl-8 md:p-20">
          <div className="max-w-xl max-md:pr-8">
            <div className="relative">
              <h2
                id={`${props.id}-heading`}
                className="text-foreground text-4xl font-semibold text-balance lg:text-5xl"
              >
                {tRoot(props.titleKey)}
              </h2>
              <p className="text-foreground mt-4 mb-6 text-lg text-balance">
                {tRoot(props.bodyKey)}
              </p>

              <Button asChild>
                <Link
                  href={props.primary.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  {tRoot(props.primary.labelKey)}
                </Link>
              </Button>
            </div>
          </div>
          <div
            data-theme="quartz"
            className="max-lg:mask-b-from-35% max-lg:pt-6 max-md:mt-4 lg:absolute lg:inset-0 lg:top-12 lg:ml-auto lg:w-2/5"
          >
            <LayoutIllustration />
          </div>
        </div>
      </Container>
      <div className="border-b" />
    </section>
  );
}
