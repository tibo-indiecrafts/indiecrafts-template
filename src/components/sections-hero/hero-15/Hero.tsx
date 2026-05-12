"use client";
import { CreditCard } from "@/components/ui-illustrations/credit-card";
import { AnimatedGroup } from "@/components/ui-effects/animated-group";
import { LogoCloud04Section as LogoCloud } from "@/components/sections-logo-cloud/logo-cloud-04";
import { Button } from "@/components/ui-primitives/button";
import { Link } from "@/i18n/routing";
import { useScopedT } from "@/i18n/scoped-t";
import { hero15CtaHref, hero15Namespace } from "./config";

export function Hero() {
  const [t] = useScopedT(hero15Namespace);

  return (
    <section
      aria-labelledby="hero-15-title"
      className="bg-background relative [--color-foreground:var(--color-indigo-950)] dark:[--color-foreground:var(--color-white)]"
    >
      <div className="from-background bg-linear-to-b to-indigo-500/6 pt-24 pb-20 md:pt-32 lg:pt-36 lg:pb-72">
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center perspective-near">
          <CreditCard />
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.25,
                    delayChildren: 0,
                  },
                },
              },
              item: {
                hidden: {
                  opacity: 0,
                  filter: "blur(12px)",
                  y: -16,
                },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    bounce: 0.3,
                    duration: 1,
                  },
                },
              },
            }}
          >
            <h1
              id="hero-15-title"
              className="text-foreground mx-auto mt-16 text-5xl font-semibold text-balance"
            >
              {t("title.first")}{" "}
              <span className="bg-linear-to-b from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                {t("title.accent")}
              </span>{" "}
              {t("title.rest")}
            </h1>

            <div className="mx-auto mt-4 max-w-md">
              <p className="text-muted-foreground mb-6 text-lg text-balance">
                {t("body")}
              </p>

              <Button asChild className="rounded-full">
                <Link href={hero15CtaHref as Parameters<typeof Link>[0]["href"]}>
                  {t("cta")}
                </Link>
              </Button>
            </div>
          </AnimatedGroup>

          <LogoCloud />
        </div>
      </div>
    </section>
  );
}
