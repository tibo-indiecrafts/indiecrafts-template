/**
 * Render a stacked list of testimonial quotes.
 *
 * @see docs/reference/packages/web/ui-components/src/web/collection/QuoteList.md
 */
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { QuoteListModule } from "@indiecrafts/packages-web-ui-components/shared/types";
import { RichTitle } from "../RichTitle";
import { ModuleSection } from "../layout/ModuleSection";

/**
 * Testimonials module — design ported from
 * `sections-testimonials/testimonials-06`: a small Quote icon, a large
 * editorial pull quote, then avatar + name + role row beneath. Multiple
 * quotes stack vertically with a thin separator.
 */
export async function QuoteList({
  inline,
  ...props
}: QuoteListModule & { inline?: boolean }) {
  // GROQ can return null entries for references the client can't see;
  // filter them so the renderer never dereferences null.
  const quotes = (props.quotes ?? []).filter(Boolean);
  if (!quotes.length) return null;
  // Locale-aware quotation marks — `typography.quoteStyle.primary` is
  // an array like ["“", "”"] (EN) or ["« ", " »"] (FR).
  const t = await getTranslations("typography");
  const marks = t.raw("quoteStyle.primary") as [string, string];
  const [open, close] = Array.isArray(marks) ? marks : ["“", "”"];
  return (
    <ModuleSection anchor={props.anchor} inline={inline} className="@container">
      <div className="mx-auto w-full max-w-3xl">
        {props.title ? (
          <div className="mb-6 text-center">
            <RichTitle
              as="h2"
              className="text-2xl font-semibold @2xl:text-3xl @4xl:text-4xl"
            >
              {props.title}
            </RichTitle>
          </div>
        ) : null}
        <ul className="divide-border/60 border-border/60 flex w-full flex-col divide-y border-y">
          {quotes.map((q) => (
            <li key={q._id} className="py-6 @2xl:py-8">
              <p className="mb-4 text-lg font-medium @2xl:mb-6 @2xl:text-2xl @2xl:leading-relaxed">
                {open}
                {q.content}
                {close}
              </p>
              <div className="flex items-center gap-3 pl-px">
                {q.image?.asset?.url ? (
                  <div className="ring-foreground/10 aspect-square size-12 shrink-0 overflow-hidden rounded-xl border border-transparent shadow-md ring-1 shadow-black/15">
                    <Image
                      src={q.image.asset.url}
                      alt={q.author ?? ""}
                      width={96}
                      height={96}
                      className="size-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="space-y-0.5 text-base *:block">
                  {q.author ? (
                    <span className="text-foreground font-medium">
                      {q.author}
                    </span>
                  ) : null}
                  {q.role ? (
                    <span className="text-muted-foreground text-sm">
                      {q.role}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ModuleSection>
  );
}
