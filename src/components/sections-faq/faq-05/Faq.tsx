import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { faq05Namespace } from "./config";
import type { FaqBlock } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-muted/40 text-card-foreground rounded-xl border", className)}
    {...props}
  />
);

export default function Faq(props: Readonly<FaqBlock>) {
  const [, , tRoot] = useScopedT(faq05Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-balance">
            {tRoot(props.bodyKey)}
          </p>
        </div>
        <div className="mt-12 grid gap-3 @lg:grid-cols-2">
          {props.items.map((item, index) => (
            <Card key={index} className="p-5">
              <h3 className="text-foreground text-sm font-medium">
                {tRoot(item.questionKey)}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {tRoot(item.answerKey)}
              </p>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground mt-8 text-center text-sm">
          {tRoot(props.contactPromptKey)}{" "}
          <Link
            href={props.contactHref}
            className="text-primary font-medium hover:underline"
          >
            {tRoot(props.contactLinkKey)}
          </Link>
        </p>
      </div>
    </section>
  );
}
