import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials10Namespace } from "./config";
import type { TestimonialsBlock } from "./schema";

/**
 * Tailark `mist-testimonials-4` — JSX verbatim. Single left-aligned
 * testimonial on `py-24` inside `max-w-5xl`. Blockquote uses a
 * `before:bg-primary before:w-1 before:rounded-full pl-6` left rail
 * accent, with `text-lg` quote text. Footer pairs a `size-6` Avatar
 * (with `AvatarFallback` initial), `cite` author name, a `size-1`
 * dot separator, and a muted role label.
 */
export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [, , tRoot] = useScopedT(testimonials10Namespace);
  const author = tRoot(props.authorKey);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {author}
      </h2>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <blockquote className="before:bg-primary relative max-w-xl pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full">
            <p className="text-foreground text-lg">{tRoot(props.quoteKey)}</p>
            <footer className="mt-4 flex items-center gap-2">
              <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                <AvatarImage src={props.avatarUrl} alt={author} />
                <AvatarFallback>{author.charAt(0)}</AvatarFallback>
              </Avatar>
              <cite>{author}</cite>
              <span aria-hidden className="bg-foreground/15 size-1 rounded-full" />
              <span className="text-muted-foreground">{tRoot(props.roleKey)}</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
