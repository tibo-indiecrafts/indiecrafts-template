import Image from "next/image";
import { Cpu, Zap } from "lucide-react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { content22Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [t] = useScopedT(content22Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2
          id={headingId}
          className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl"
        >
          {t("title")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              {t("lead1Plain1")}
              <span className="text-accent-foreground font-bold">{t("lead1Strong")}</span>
              {t("lead1Plain2")}
            </p>
            <p className="text-muted-foreground">{t("lead2")}</p>

            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="size-4" />
                  <h3 className="text-sm font-medium">{t("feature1.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("feature1.body")}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4" />
                  <h3 className="text-sm font-medium">{t("feature2.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{t("feature2.body")}</p>
              </div>
            </div>
          </div>
          <div className="relative mt-6 sm:mt-0">
            <div className="relative aspect-67/34 rounded-2xl bg-linear-to-b from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src={props.imageDarkSrc}
                className="hidden size-full rounded-[15px] object-cover dark:block"
                alt={t("imageAltDark")}
                width={1206}
                height={612}
              />
              <Image
                src={props.imageLightSrc}
                className="size-full rounded-[15px] object-cover shadow dark:hidden"
                alt={t("imageAltLight")}
                width={1206}
                height={612}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
