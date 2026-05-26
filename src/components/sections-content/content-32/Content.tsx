/* eslint-disable @next/next/no-img-element -- decorative external Unsplash backdrop intentionally uses <img> */

import Image from "next/image";
import { useScopedT } from "@/components/_lib/scoped-t";
import { content32Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [t] = useScopedT(content32Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto max-w-2xl">
            <div>
              <span aria-hidden className="text-3xl">
                {t("emoji")}
              </span>
              <h2 id={headingId} className="text-foreground mt-4 text-4xl font-semibold">
                {t("title")}
              </h2>
              <p className="text-muted-foreground mt-4 mb-12 text-xl">{t("body")}</p>
            </div>

            <div className="relative mt-12 overflow-hidden rounded-3xl bg-black/10 md:mt-16">
              <img
                src={props.backdropSrc}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />

              <div className="bg-background relative m-4 overflow-hidden rounded-(--radius) border border-transparent shadow-xl ring-1 shadow-black/15 ring-black/10 sm:m-8 md:m-12">
                <Image
                  src={props.screenshotSrc}
                  alt={t("screenshotAlt")}
                  width={2880}
                  height={1842}
                  className="size-full object-cover object-top-left"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
