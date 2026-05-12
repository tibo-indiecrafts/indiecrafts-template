import Image from "next/image";
import type { ReactNode } from "react";
import { useScopedT } from "@/i18n/scoped-t";
import { content17Namespace } from "./config";
import type { ContentBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-semibold">{chunks}</strong>
  ),
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content17Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background py-16 md:py-24"
    >
      <div className="mx-auto max-w-4xl space-y-12 px-6">
        <h2
          id={`${props.id}-heading`}
          className="text-muted-foreground text-4xl font-semibold text-balance md:w-2/3"
        >
          {tRoot.rich(props.titleKey, RICH_STRONG)}
        </h2>
        <div className="ring-border aspect-video rounded-xl border border-transparent bg-white py-6 shadow ring-1">
          <Image
            src={props.image.src}
            alt={tRoot(props.image.altKey)}
            width={props.image.width}
            height={props.image.height}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          {props.bodyKeys.map((key, index) => (
            <p key={index} className="text-muted-foreground">
              {tRoot.rich(key, RICH_STRONG)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
