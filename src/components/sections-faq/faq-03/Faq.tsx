import { DynamicIcon } from "lucide-react/dynamic";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui-primitives/accordion";
import { useScopedT } from "@/i18n/scoped-t";
import { faq03Namespace } from "./config";
import type { FaqBlock } from "./schema";

export default function Faq(props: Readonly<FaqBlock>) {
  const [, tr, tRoot] = useScopedT(faq03Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-muted dark:bg-background py-20"
    >
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2
                id={`${props.id}-title`}
                className="mt-4 text-3xl font-bold text-balance"
              >
                {tr(props.titleKey, "title")}
              </h2>
              <p className="text-muted-foreground mt-4">
                {tr(props.supportTextKey, "support.text")}{" "}
                <a
                  href={props.supportHref ?? "#contact"}
                  className="text-primary font-medium hover:underline"
                >
                  {tr(props.supportLinkKey, "support.link")}
                </a>
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {props.items.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background rounded-lg border px-4 shadow-xs last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex size-6" aria-hidden="true">
                        <DynamicIcon name={item.icon} className="m-auto size-4" />
                      </span>
                      <span className="text-base">{tRoot(item.questionKey)}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{tRoot(item.answerKey)}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
