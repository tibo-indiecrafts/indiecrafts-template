import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { useScopedT } from "@/components/_lib/scoped-t";
import { testimonials08Namespace } from "./config";
import type { TestimonialsBlock } from "./schema";

export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [, , tRoot] = useScopedT(testimonials08Namespace);
  const author = tRoot(props.authorKey);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {author}
      </h2>
      <div className="bg-muted py-24">
        <div className="mx-auto w-full max-w-2xl px-6 text-center">
          <div className="max-w-xl">
            <Quote
              aria-hidden
              className="fill-background stroke-background mx-auto size-8 drop-shadow-sm"
            />
            <blockquote className="mt-6">
              <p className="text-foreground text-xl">{tRoot(props.quoteKey)}</p>
              <footer className="mt-6 flex flex-col items-center justify-center">
                <Avatar className="ring-foreground/10 size-12 border border-transparent shadow ring-1">
                  <AvatarImage src={props.avatarUrl} alt={author} />
                  <AvatarFallback>{author.charAt(0)}</AvatarFallback>
                </Avatar>
                <cite className="text-foreground mt-2 text-lg font-medium">{author}</cite>
                <span className="text-muted-foreground">{tRoot(props.handleKey)}</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
