import Image from "next/image";
import type { QuoteListModule } from "@/sanity/types";

export function QuoteList(props: QuoteListModule) {
  // GROQ can return null entries for references the client can't see;
  // filter them so the renderer never dereferences null.
  const quotes = (props.quotes ?? []).filter(Boolean);
  if (!quotes.length) return null;
  const single = quotes.length === 1;
  return (
    <section id={props.anchor} className="mx-auto max-w-5xl px-(--gutter) py-12 md:py-20">
      {props.title ? (
        <h2 className="text-center text-2xl font-semibold md:text-3xl">{props.title}</h2>
      ) : null}
      <ul
        className={
          single
            ? "mt-8 flex justify-center"
            : "divide-border mt-8 grid gap-10 divide-y md:grid-cols-2 md:divide-x md:divide-y-0"
        }
      >
        {quotes.map((q) => (
          <li
            key={q._id}
            className="flex max-w-2xl flex-col items-center gap-6 px-6 py-6 text-center"
          >
            <blockquote className="text-lg font-medium md:text-2xl">
              “{q.content}”
            </blockquote>
            <div className="flex items-center gap-3">
              {q.image?.asset?.url ? (
                <Image
                  src={q.image.asset.url}
                  alt={q.author ?? ""}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
              ) : null}
              <div className="text-left">
                {q.author ? <p className="font-medium">{q.author}</p> : null}
                {q.role ? (
                  <p className="text-muted-foreground text-sm">{q.role}</p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
