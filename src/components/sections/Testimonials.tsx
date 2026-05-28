import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";

export type TestimonialsQuote = {
  /** Maps to `<namespace>.quotes.<id>.{quote,author,role}` in messages. */
  id: string;
  avatarUrl?: string;
};

export type TestimonialsBlock = {
  type: "testimonials";
  id: string;
  /** i18n namespace — e.g. `"pages.home.blocks.testimonials"`. */
  namespace: string;
  quotes: readonly TestimonialsQuote[];
};

function quoteInitials(author: string): string {
  return author
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

function QuoteBlock({
  quote,
  namespace,
}: {
  quote: TestimonialsQuote;
  namespace: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(namespace as any);
  const k = (suffix: string) => `quotes.${quote.id}.${suffix}`;
  const author = t(k("author"));
  const initials = quoteInitials(author);
  return (
    <blockquote>
      <p className="text-lg font-medium text-pretty sm:text-xl md:text-3xl">
        {t(k("quote"))}
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
          <span className="text-muted-foreground block text-sm">{t(k("role"))}</span>
        </div>
      </div>
    </blockquote>
  );
}

export function Testimonials(props: Readonly<TestimonialsBlock>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(props.namespace as any);
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
            <QuoteBlock quote={props.quotes[0]!} namespace={props.namespace} />
          </div>
        ) : (
          <ul className="divide-border mx-auto max-w-2xl divide-y">
            {props.quotes.map((quote) => (
              <li key={quote.id} className="py-12 text-center first:pt-0 last:pb-0">
                <QuoteBlock quote={quote} namespace={props.namespace} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
