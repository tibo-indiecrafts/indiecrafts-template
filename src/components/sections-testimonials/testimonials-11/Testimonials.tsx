import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/components/_lib/scoped-t";
import { testimonials11Namespace } from "./config";
import type { TestimonialsBlock } from "./schema";

const STAR_INDEXES = [0, 1, 2, 3, 4] as const;

export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [, , tRoot] = useScopedT(testimonials11Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        Customer testimonials
      </h2>
      <div className="py-24">
        <div className="@container mx-auto w-full max-w-5xl px-6">
          <div className="grid gap-6 @lg:grid-cols-2 @3xl:grid-cols-3 @3xl:gap-12">
            {props.items.map((item, index) => {
              const name = tRoot(item.nameKey);
              return (
                <div key={index}>
                  <div className="flex gap-1" aria-label={`${item.stars} out of 5 stars`}>
                    {STAR_INDEXES.map((i) => (
                      <Star
                        key={i}
                        aria-hidden
                        className={cn(
                          "size-4",
                          i < item.stars
                            ? "fill-primary stroke-primary"
                            : "fill-foreground/15 stroke-transparent",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-foreground my-4">{tRoot(item.contentKey)}</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                      <AvatarImage src={item.avatarUrl} alt={name} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-foreground text-sm font-medium">{name}</div>
                    <span aria-hidden className="bg-foreground/25 size-1 rounded-full" />
                    <span className="text-muted-foreground text-sm">
                      {tRoot(item.roleKey)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
