import Image from "next/image";
import type { ReactNode } from "react";
import { useScopedT } from "@/components/_lib/scoped-t";
import { content16Namespace } from "./config";
import type { ContentBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-semibold">{chunks}</strong>
  ),
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content16Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto aspect-3/2 max-w-2xl mask-radial-to-65%">
          <Image
            className="rounded-(--radius)"
            src={props.image.src}
            alt={tRoot(props.image.altKey)}
            width={props.image.width}
            height={props.image.height}
            loading="lazy"
          />
        </div>
        <div className="mx-auto max-w-xl space-y-6 text-center">
          <h2
            id={`${props.id}-heading`}
            className="text-3xl font-medium text-balance lg:text-4xl"
          >
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground text-lg text-balance">
            {tRoot.rich(props.bodyKey, RICH_STRONG)}
          </p>
        </div>
      </div>
    </section>
  );
}
