import Image from "next/image";
import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { useScopedT } from "@/i18n/scoped-t";
import { content28Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [t] = useScopedT(content28Namespace);
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
          <div className="relative mb-6 sm:mb-0">
            <div className="relative aspect-76/59 rounded-2xl bg-linear-to-b from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src={props.imageDarkSrc}
                className="hidden size-full rounded-[15px] object-cover dark:block"
                alt={t("imageAltDark")}
                width={1207}
                height={929}
              />
              <Image
                src={props.imageLightSrc}
                className="size-full rounded-[15px] object-cover shadow dark:hidden"
                alt={t("imageAltLight")}
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              {t("lead1Plain1")}
              <span className="text-accent-foreground font-bold">{t("lead1Strong")}</span>
              {t("lead1Plain2")}
            </p>
            <p className="text-muted-foreground">{t("lead2")}</p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>{t("quote")}</p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">{t("author")}</cite>
                  <Spotify height={24} width={80} className="**:fill-foreground" />
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
