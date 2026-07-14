import { useTranslations } from "next-intl";
import { Mail, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CtaBlock = {
  type: "cta";
  id: string;
  /**
   * i18n namespace — e.g. `"pages.home.blocks.cta"`. The section reads
   * `t("title")`, `t("body")`, `t("emailPlaceholder")`, and `t("submit")`
   * relative to this root.
   */
  namespace: string;
};

export function Cta(props: Readonly<CtaBlock>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations(props.namespace as any);
  const emailPlaceholder = t("emailPlaceholder");

  return (
    <section aria-labelledby={`${props.id}-title`} className="border-b py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="text-center">
          <h2
            id={`${props.id}-title`}
            className="text-4xl font-semibold text-balance lg:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-4">{t("body")}</p>

          <form action="" className="mx-auto mt-10 max-w-sm lg:mt-12">
            <div className="bg-background has-[input:focus]:ring-ring relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
              <label className="sr-only" htmlFor={`${props.id}-email`}>
                {emailPlaceholder}
              </label>
              <Mail
                aria-hidden="true"
                className="text-muted-foreground pointer-events-none absolute inset-y-0 left-5 my-auto size-5"
              />
              <input
                id={`${props.id}-email`}
                type="email"
                placeholder={emailPlaceholder}
                className="h-14 w-full bg-transparent pl-12 focus:outline-none"
              />
              <div className="md:pr-1.5 lg:pr-0">
                <Button className="rounded-(--radius)">
                  <span className="hidden md:block">{t("submit")}</span>
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
