import { Mail, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/i18n/scoped-t";
import { cta01Namespace } from "./config";
import type { CallToActionBlock } from "./schema";

export default function CallToAction(props: Readonly<CallToActionBlock>) {
  const [, tr] = useScopedT(cta01Namespace);

  return (
    <section aria-labelledby={`${props.id}-title`} className="border-b py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="text-center">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-semibold text-balance lg:text-5xl"
          >
            {tr(props.titleKey, "title")}
          </h2>
          {props.bodyKey ? (
            <p className="text-muted-foreground mt-4">{tr(props.bodyKey, "body")}</p>
          ) : null}

          <form action="" className="mx-auto mt-10 max-w-sm lg:mt-12">
            <div className="bg-background has-[input:focus]:ring-ring relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
              <label className="sr-only" htmlFor={`${props.id}-email`}>
                {tr(props.emailPlaceholderKey, "emailPlaceholder")}
              </label>
              <Mail
                aria-hidden="true"
                className="text-muted-foreground pointer-events-none absolute inset-y-0 left-5 my-auto size-5"
              />
              <input
                id={`${props.id}-email`}
                type="email"
                placeholder={tr(props.emailPlaceholderKey, "emailPlaceholder")}
                className="h-14 w-full bg-transparent pl-12 focus:outline-none"
              />
              <div className="md:pr-1.5 lg:pr-0">
                <Button className="rounded-(--radius)">
                  <span className="hidden md:block">
                    {tr(props.submitLabelKey, "submit")}
                  </span>
                  <SendHorizonal
                    aria-hidden="true"
                    className="relative mx-auto size-5 md:hidden"
                    strokeWidth={2}
                  />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
