import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import { content01Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [, tr] = useScopedT(content01Namespace);
  const alt = tr(props.imageAltKey, "imageAlt");

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-(--gutter) md:space-y-16">
        <h2
          id={`${props.id}-title`}
          className="relative z-10 max-w-xl text-4xl font-medium text-balance lg:text-5xl"
        >
          {tr(props.titleKey, "title")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="from-muted relative aspect-76/59 rounded-2xl bg-linear-to-b to-transparent p-px">
              {props.imageDarkUrl ? (
                <Image
                  src={props.imageDarkUrl}
                  className="absolute inset-0 hidden h-full w-full rounded-[15px] object-cover dark:block"
                  alt={alt}
                  width={1207}
                  height={929}
                />
              ) : null}
              <Image
                src={props.imageLightUrl}
                className={`absolute inset-0 h-full w-full rounded-[15px] object-cover shadow ${props.imageDarkUrl ? "dark:hidden" : ""}`}
                alt={alt}
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">{tr(props.leadingKey, "leading")}</p>
            <p className="text-muted-foreground">
              {tr(props.supportingKey, "supporting")}
            </p>

            {props.quoteKey ? (
              <div className="pt-6">
                <blockquote className="border-l-4 pl-4">
                  <p>{tr(props.quoteKey, "quote")}</p>
                  {props.quoteAuthorKey ? (
                    <cite className="mt-6 block font-medium not-italic">
                      {tr(props.quoteAuthorKey, "author")}
                    </cite>
                  ) : null}
                </blockquote>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
