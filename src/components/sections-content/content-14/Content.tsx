import Image from "next/image";
import type { ReactNode } from "react";
import { AspectRatio } from "@/components/ui-primitives/aspect-ratio";
import { useScopedT } from "@/i18n/scoped-t";
import { content14Namespace } from "./config";
import type { ContentBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-semibold">{chunks}</strong>
  ),
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content14Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background py-16 md:py-32"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Visual & multimodal capabilities
      </h2>
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          {props.items.map((item, index) => (
            <div key={index} className="row-span-3 grid grid-rows-subgrid gap-6">
              <h3 className="text-muted-foreground">{tRoot(item.titleKey)}</h3>
              <AspectRatio
                ratio={1 / 1}
                className="ring-border rounded-xl border border-transparent bg-white p-6 shadow ring-1"
              >
                <Image
                  src={item.image.src}
                  alt={tRoot(item.altKey)}
                  width={item.image.width}
                  height={item.image.height}
                  className="aspect-square size-full object-cover"
                />
              </AspectRatio>
              <p className="text-muted-foreground">
                {tRoot.rich(item.bodyKey, RICH_STRONG)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
