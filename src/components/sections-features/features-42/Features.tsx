import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, ChevronRight, Target } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features42Namespace } from "./config";
import type { Features42Block } from "./schema";

export default function Features({ id }: Readonly<Features42Block>) {
  const [t] = useScopedT(features42Namespace);

  return (
    <section aria-labelledby={`${id}-heading`}>
      <div className="bg-muted/50 py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="grid gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <h2
                id={`${id}-heading`}
                className="text-foreground text-4xl font-semibold text-balance"
              >
                {t("title")}
              </h2>
              <Button className="mt-8 pr-2" variant="outline" asChild>
                <Link href="#">
                  {t("learnMore")}
                  <ChevronRight className="size-4 opacity-50" />
                </Link>
              </Button>
            </div>

            <div className="space-y-6 md:col-span-3 md:space-y-10">
              <div>
                <div className="flex items-center gap-2">
                  <Target className="size-5" />
                  <h3 className="text-foreground text-lg font-semibold">
                    {t("items.1.title")}
                  </h3>
                </div>
                <p className="text-muted-foreground mt-3 text-balance">
                  {t("items.1.body")}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="size-5" />
                  <h3 className="text-foreground text-lg font-semibold">
                    {t("items.2.title")}
                  </h3>
                </div>
                <p className="text-muted-foreground mt-3 text-balance">
                  {t("items.2.body")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative -mx-12 mt-16 px-12">
            <div className="bg-background relative mx-auto overflow-hidden rounded-(--radius) border border-transparent shadow-lg ring-1 shadow-black/10 ring-black/10">
              <Image
                src="/placeholder.svg"
                alt={t("imageAlt")}
                width={2880}
                height={1842}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
