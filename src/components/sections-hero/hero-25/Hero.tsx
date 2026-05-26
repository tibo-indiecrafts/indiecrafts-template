import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { VercelFull } from "@/components/ui-primitives/svgs/vercel";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Hulu } from "@/components/ui-primitives/svgs/hulu";
import { Bolt } from "@/components/ui-primitives/svgs/bolt";
import { Firebase } from "@/components/ui-primitives/svgs/firebase";
import { Beacon } from "@/components/ui-primitives/svgs/beacon";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Figma } from "@/components/ui-primitives/svgs/figma";
import { Cisco } from "@/components/ui-primitives/svgs/cisco";
import { useScopedT } from "@/components/_lib/scoped-t";
import { hero25Namespace } from "./config";
import type { HeroBlock } from "./schema";

export default function Hero(props: Readonly<HeroBlock>) {
  const [, , tRoot] = useScopedT(hero25Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <div className="overflow-hidden">
        <div className="relative pt-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl text-center sm:mx-auto lg:mt-0 lg:mr-auto lg:w-4/5">
              <Link
                href={props.announcement.href}
                className="mx-auto flex w-fit items-center gap-2 rounded-(--radius) border p-1 pr-3"
              >
                <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                  {tRoot(props.announcement.badgeKey)}
                </span>
                <span className="text-sm">{tRoot(props.announcement.labelKey)}</span>
                <span aria-hidden className="block h-4 w-px bg-(--color-border)" />
                <ArrowRight className="size-4" />
              </Link>

              <h1
                id={`${props.id}-heading`}
                className="mt-8 text-4xl font-semibold text-balance md:text-5xl xl:text-6xl xl:[line-height:1.125]"
              >
                {tRoot(props.titleKey)}
              </h1>
              <p className="mx-auto mt-8 hidden max-w-2xl text-lg text-wrap sm:block">
                {tRoot(props.bodyDesktopKey)}
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
                {tRoot(props.bodyMobileKey)}
              </p>

              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href={props.primary.href}>
                    <Rocket className="relative size-4" />
                    <span className="text-nowrap">{tRoot(props.primary.labelKey)}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-6xl overflow-hidden mask-b-from-55% px-4">
            <Image
              className="border-border/25 relative z-2 hidden rounded-2xl border dark:block"
              src={props.imageDarkSrc}
              alt={tRoot(props.imageAltKey)}
              width={2796}
              height={2008}
            />
            <Image
              className="border-border/25 relative z-2 rounded-2xl border dark:hidden"
              src={props.imageLightSrc}
              alt={tRoot(props.imageAltKey)}
              width={2796}
              height={2008}
            />
          </div>
        </div>
      </div>
      <div className="bg-background relative z-10 pb-16">
        <div className="m-auto max-w-5xl px-6">
          <h2 className="text-center text-lg font-medium">
            {tRoot(props.partnersHeadingKey)}
          </h2>
          <div className="**:fill-foreground mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
            <Bolt height={22} width={56} />
            <VercelFull height={22} width={84} />
            <Supabase className="h-6" />
            <Hulu height={18} width={56} />
            <Spotify height={24} width={80} />
            <Firebase height={24} width={80} />
            <Beacon height={24} width={80} />
            <Claude height={26} width={90} />
            <Figma height={24} width={24} />
            <Cisco height={30} width={60} />
          </div>
        </div>
      </div>
    </section>
  );
}
