import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { hero24Namespace } from "./config";
import type { HeroBlock } from "./schema";

export default function Hero(props: Readonly<HeroBlock>) {
  const [, , tRoot] = useScopedT(hero24Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-20">
        <div className="lg:flex lg:items-center lg:gap-12">
          <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
            <Link
              href={props.announcement.href}
              className="mx-auto flex w-fit items-center gap-2 rounded-(--radius) border p-1 pr-3 lg:ml-0"
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
              className="mt-10 text-4xl font-bold text-balance md:text-5xl xl:text-5xl"
            >
              {tRoot(props.titleKey)}
            </h1>
            <p className="mt-8">{tRoot(props.bodyKey)}</p>

            <div>
              <form
                action=""
                className="mx-auto my-10 max-w-sm lg:my-12 lg:mr-auto lg:ml-0"
              >
                <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                  <Mail
                    aria-hidden
                    className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5"
                  />

                  <label className="sr-only" htmlFor={`${props.id}-email`}>
                    {tRoot(props.emailPlaceholderKey)}
                  </label>
                  <input
                    id={`${props.id}-email`}
                    placeholder={tRoot(props.emailPlaceholderKey)}
                    className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                    type="email"
                  />

                  <div className="md:pr-1.5 lg:pr-0">
                    <Button
                      type="submit"
                      aria-label={tRoot(props.submitAriaLabelKey)}
                      className="rounded-(--radius)"
                    >
                      <span className="hidden md:block">
                        {tRoot(props.submitLabelKey)}
                      </span>
                      <SendHorizonal
                        className="relative mx-auto size-5 md:hidden"
                        strokeWidth={2}
                      />
                    </Button>
                  </div>
                </div>
              </form>

              <ul className="list-inside list-disc space-y-2">
                {props.bullets.map((bulletKey) => (
                  <li key={bulletKey}>{tRoot(bulletKey)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3">
          <div className="relative">
            <div className="to-background absolute -inset-17 z-1 bg-radial-[at_65%_25%] from-transparent to-40%" />
            <Image
              className="hidden dark:block"
              src={props.imageDarkSrc}
              alt={tRoot(props.imageAltKey)}
              width={2796}
              height={2008}
            />
            <Image
              className="dark:hidden"
              src={props.imageLightSrc}
              alt={tRoot(props.imageAltKey)}
              width={2796}
              height={2008}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
