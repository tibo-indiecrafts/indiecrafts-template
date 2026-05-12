import { Spotify } from "@/components/ui-primitives/svgs/spotify";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials09Namespace } from "./config";
import type { TestimonialsBlock } from "./schema";

/**
 * Tailark `testimonials-3` — JSX verbatim. Single editorial pull
 * quote on `py-16 md:py-32` inside `max-w-2xl`. Quote text is
 * `text-lg sm:text-xl md:text-3xl font-semibold`. Footer pairs the
 * Spotify wordmark (`*:fill-foreground` for theme color) with a
 * `border-l pl-6` author/role column.
 */
export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [, , tRoot] = useScopedT(testimonials09Namespace);
  const author = tRoot(props.authorKey);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-32">
      <h2 id={headingId} className="sr-only">
        {author}
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl">
          <blockquote>
            <p className="text-lg font-semibold sm:text-xl md:text-3xl">
              {tRoot(props.quoteKey)}
            </p>

            <div className="mt-12 flex items-center gap-6">
              <Spotify height={24} width={80} className="*:fill-foreground" />
              <div className="space-y-1 border-l pl-6">
                <cite className="font-medium">{author}</cite>
                <span className="text-muted-foreground block text-sm">
                  {tRoot(props.roleKey)}
                </span>
              </div>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
