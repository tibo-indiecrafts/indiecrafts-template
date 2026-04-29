import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import type { Testimonials1Block } from "./schema";

export default function Testimonials1(props: Readonly<Testimonials1Block>) {
  const t = useTranslations();
  const author = t(props.authorKey);
  const initials = author
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <section aria-labelledby={`${props.id}-label`} className="border-b py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="mx-auto max-w-2xl text-center">
          <p id={`${props.id}-label`} className="sr-only">
            {author}
          </p>
          <blockquote>
            <p className="text-lg font-medium text-pretty sm:text-xl md:text-3xl">
              {t(props.quoteKey)}
            </p>
            <div className="mt-12 flex items-center justify-center gap-6">
              <Avatar className="size-12">
                {props.avatarUrl ? (
                  <AvatarImage src={props.avatarUrl} alt="" loading="lazy" />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 border-l pl-6 text-left">
                <cite className="font-medium not-italic">{author}</cite>
                {props.roleKey ? (
                  <span className="text-muted-foreground block text-sm">
                    {t(props.roleKey)}
                  </span>
                ) : null}
              </div>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
