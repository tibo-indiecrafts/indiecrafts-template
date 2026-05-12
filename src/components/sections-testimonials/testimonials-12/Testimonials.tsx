import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials12Namespace } from "./config";
import type { TestimonialsBlock } from "./schema";

/**
 * Tailark `mist-testimonials-2` — JSX verbatim. 3-column testimonial
 * grid (`@lg:grid-cols-2 @3xl:grid-cols-3`) on `bg-muted py-24`
 * inside `max-w-5xl @container`. Header: `text-4xl font-semibold`
 * title + lead body. Each card: a `bg-background rounded-2xl
 * rounded-bl ring-1 ring-foreground/10` chat-bubble (rounded except
 * bottom-left corner, mimicking a speech tail) housing the quote,
 * with a `size-6` Avatar + name + dot + role footer beneath.
 */
export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [, , tRoot] = useScopedT(testimonials12Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted py-24">
        <div className="@container mx-auto w-full max-w-5xl px-6">
          <div className="mb-12">
            <h2 id={headingId} className="text-foreground text-4xl font-semibold">
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground my-4 text-lg text-balance">
              {tRoot(props.bodyKey)}
            </p>
          </div>
          <div className="grid gap-6 @lg:grid-cols-2 @3xl:grid-cols-3">
            {props.items.map((item, index) => {
              const name = tRoot(item.nameKey);
              return (
                <div key={index}>
                  <div className="bg-background ring-foreground/10 rounded-2xl rounded-bl border border-transparent px-4 py-3 ring-1">
                    <p className="text-foreground">{tRoot(item.contentKey)}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
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
