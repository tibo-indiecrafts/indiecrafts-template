import Image from "next/image";
import { useScopedT } from "@/components/_lib/scoped-t";
import { stats20Namespace } from "./config";
import type { StatsBlock } from "./schema";

export default function Stats(props: Readonly<StatsBlock>) {
  const [, , tRoot] = useScopedT(stats20Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="bg-background @container relative border-b pt-24 sm:pb-24"
    >
      <div className="mx-auto grid max-w-2xl px-6 @2xl:grid-cols-2">
        <div>
          <div className="space-y-4">
            <h2 id={headingId} className="text-4xl font-medium text-balance">
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground text-balance">{tRoot(props.bodyKey)}</p>
          </div>
          <div className="mt-12 grid text-sm">
            {props.items.map((item, index) => (
              <div key={index} className="border-t py-6">
                <p className="text-muted-foreground text-xl">
                  <span className="text-foreground font-medium">
                    {tRoot(item.valueKey)}
                  </span>
                  {tRoot(item.trailingKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none relative mask-radial-[50%_100%] mask-radial-from-65% mask-radial-at-bottom sm:absolute sm:right-0 sm:bottom-0 sm:left-1/2 sm:min-w-6xl dark:opacity-50"
      >
        <div className="bg-primary absolute inset-0 z-10 mix-blend-overlay" />
        <Image
          src={props.globeSrc}
          alt={tRoot("blocks.stats-20.globeAlt")}
          className="dark:invert"
          width={2928}
          height={1464}
        />
      </div>
    </section>
  );
}
