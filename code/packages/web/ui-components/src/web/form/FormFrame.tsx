/**
 * The block frame of every public form: section, card, heading, then the success line or the form.
 *
 * @see docs/reference/packages/web/ui-components/src/web/form/FormFrame.md
 */
// Client-side part (no "use client" entry: only the client forms render it).
import type { ReactNode } from "react";
import { cn } from "@indiecrafts/packages-shared-utils/cn";

export type FormVariant = "card" | "inline" | "banner";

/**
 * The block frame: the section, the variant's card, the heading + body, then either the
 * success message or the form. `headingAs` — `h3` inside a page's blocks, `h1` when the
 * form IS the page.
 */
export function FormFrame({
  anchor,
  variant = "card",
  heading,
  body,
  headingAs: Heading = "h3",
  done,
  success,
  children,
}: {
  anchor?: string;
  variant?: FormVariant;
  heading?: string;
  body?: string;
  headingAs?: "h1" | "h2" | "h3";
  done: boolean;
  success: string;
  children: ReactNode;
}) {
  const banner = variant === "banner";
  const inline = variant === "inline";
  return (
    <section id={anchor} className="not-prose my-8 md:my-12">
      <div
        className={cn(
          "mx-auto",
          variant === "card" &&
            "bg-card max-w-xl rounded-2xl border p-8 text-center md:p-10",
          inline &&
            "flex max-w-3xl flex-col gap-5 rounded-xl border p-6 md:flex-row md:items-center md:justify-between md:gap-8",
          banner &&
            "bg-primary text-primary-foreground max-w-4xl rounded-2xl px-6 py-12 text-center md:py-16",
        )}
      >
        <div className={inline ? "md:max-w-sm" : "mx-auto max-w-lg"}>
          {heading ? (
            <Heading
              className={cn(
                "font-sans font-semibold text-balance",
                banner
                  ? "text-2xl md:text-3xl"
                  : "text-foreground text-xl md:text-2xl",
              )}
            >
              {heading}
            </Heading>
          ) : null}
          {body ? (
            <p
              className={cn(
                "mt-2 text-pretty",
                banner ? "text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {body}
            </p>
          ) : null}
        </div>

        <div
          className={inline ? "w-full md:max-w-sm" : "mx-auto mt-6 max-w-md"}
        >
          {done ? (
            <p
              role="status"
              aria-live="polite"
              className={cn(
                "rounded-lg px-4 py-3 text-sm",
                banner
                  ? "bg-primary-foreground/10"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {success}
            </p>
          ) : (
            children
          )}
        </div>
      </div>
    </section>
  );
}
