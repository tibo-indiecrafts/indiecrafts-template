import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { useScopedT } from "@/i18n/scoped-t";
import { testimonials01Namespace } from "./config";
import type { TestimonialsBlock, TestimonialsQuote } from "./schema";

function quoteInitials(author: string): string {
  return author
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

function QuoteBlock({ quote }: { quote: TestimonialsQuote }) {
  const [, , tRoot] = useScopedT(testimonials01Namespace);
  const author = tRoot(quote.authorKey);
  const initials = quoteInitials(author);
  return (
    <blockquote>
      <p className="text-lg font-medium text-pretty sm:text-xl md:text-3xl">
        {tRoot(quote.quoteKey)}
      </p>
      <div className="mt-12 flex items-center justify-center gap-6">
        <Avatar className="size-12">
          {quote.avatarUrl ? (
            <AvatarImage src={quote.avatarUrl} alt="" loading="lazy" />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 border-l pl-6 text-left">
          <cite className="font-medium not-italic">{author}</cite>
          {quote.roleKey ? (
            <span className="text-muted-foreground block text-sm">
              {tRoot(quote.roleKey)}
            </span>
          ) : null}
        </div>
      </div>
    </blockquote>
  );
}

export default function Testimonials(props: Readonly<TestimonialsBlock>) {
  const [t] = useScopedT(testimonials01Namespace);
  const labelId = `${props.id}-label`;
  const isSingle = props.quotes.length === 1;

  return (
    <section aria-labelledby={labelId} className="border-b py-16 md:py-32">
      <span id={labelId} className="sr-only">
        {t("label")}
      </span>
      <div className="mx-auto max-w-5xl px-(--gutter)">
        {isSingle ? (
          <div className="mx-auto max-w-2xl text-center">
            <QuoteBlock quote={props.quotes[0]!} />
          </div>
        ) : (
          <ul className="divide-border mx-auto max-w-2xl divide-y">
            {props.quotes.map((quote) => (
              <li key={quote.id} className="py-12 text-center first:pt-0 last:pb-0">
                <QuoteBlock quote={quote} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
