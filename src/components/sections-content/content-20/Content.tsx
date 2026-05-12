"use client";

import { motion } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui-primitives/grid-2-landing-button";
import { Container } from "@/components/ui-primitives/grid-2-landing-container";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { content20Namespace } from "./config";
import type { ContentBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-medium">{chunks}</strong>
  ),
};

function CardDecorator({ className }: { className?: string }) {
  return (
    <>
      <span
        className={cn(
          "border-primary absolute -top-px -left-px block size-2 rounded-tl-xs border-t border-l",
          className,
        )}
      />
      <span
        className={cn(
          "border-primary absolute -top-px -right-px block size-2 rounded-tr-xs border-t border-r",
          className,
        )}
      />
      <span
        className={cn(
          "border-primary absolute -bottom-px -left-px block size-2 rounded-bl-xs border-b border-l",
          className,
        )}
      />
      <span
        className={cn(
          "border-primary absolute -right-px -bottom-px block size-2 rounded-br-xs border-r border-b",
          className,
        )}
      />
    </>
  );
}

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content20Namespace);
  const [isFull, setIsFull] = useState(false);

  return (
    <section aria-labelledby={`${props.id}-heading`}>
      <h2 id={`${props.id}-heading`} className="sr-only">
        Manifesto
      </h2>
      <Container className="border-t-0 py-16 max-lg:px-6 lg:py-24">
        <div
          data-state={isFull ? "full" : "collapsed"}
          className="relative mx-auto max-w-2xl"
        >
          <motion.div
            className={cn("relative overflow-hidden", !isFull && "mask-b-from-45%")}
            initial={{ height: "22rem" }}
            animate={{ height: isFull ? "auto" : "22rem" }}
            exit={{ height: "22rem" }}
          >
            <div className="text-muted-foreground space-y-4 text-xl *:leading-relaxed md:text-2xl">
              {props.paragraphKeys.map((key, index) => (
                <p key={index}>{tRoot.rich(key, RICH_STRONG)}</p>
              ))}
            </div>
          </motion.div>
          <div className="group relative mt-6 w-fit">
            <CardDecorator className="border-primary size-2 group-hover:scale-115" />
            <Button
              type="button"
              onClick={() => setIsFull((v) => !v)}
              className="flex rounded pr-2.5"
              variant="ghost"
              size="sm"
              aria-expanded={isFull}
            >
              <span>
                {tRoot(isFull ? props.readLessLabelKey : props.readMoreLabelKey)}
              </span>
              {isFull ? (
                <Minus
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="size-3.5! opacity-50 duration-300"
                />
              ) : (
                <Plus
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="size-3.5! opacity-50 duration-300 group-hover:rotate-90"
                />
              )}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
