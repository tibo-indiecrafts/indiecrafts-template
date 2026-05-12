import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials14Namespace } from "./config";
import type { TestimonialsBlock } from "./schema";

export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [, , tRoot] = useScopedT(testimonials14Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-4">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground text-balance">{tRoot(props.bodyKey)}</p>
        </div>
        <div className="mt-12 grid gap-3 @xl:grid-cols-2">
          {props.items.map((item, index) => {
            const name = tRoot(item.nameKey);
            return (
              <div
                key={index}
                className="bg-card ring-border text-foreground space-y-3 rounded-2xl p-4 text-sm ring-1"
              >
                <div className="flex gap-3">
                  <div className="before:border-foreground/10 relative size-5 shrink-0 rounded-full before:absolute before:inset-0 before:rounded-full before:border">
                    <Image
                      src={item.avatarUrl}
                      alt={name}
                      className="rounded-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                  <p className="text-sm font-medium">
                    {name}{" "}
                    <span className="text-muted-foreground ml-2 font-normal">
                      {tRoot(item.roleKey)}
                    </span>
                  </p>
                </div>

                <p className="text-muted-foreground text-sm">{tRoot(item.quoteKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
