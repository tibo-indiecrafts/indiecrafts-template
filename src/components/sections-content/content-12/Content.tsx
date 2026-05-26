"use client";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui-primitives/button";
import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { content12Namespace } from "./config";
import type { ContentBlock } from "./schema";

const RICH_STRONG = {
  strong: (chunks: ReactNode) => (
    <strong className="text-foreground font-medium">{chunks}</strong>
  ),
};

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content12Namespace);
  const [isFull, setIsFull] = useState(false);

  return (
    <section
      aria-labelledby={`${props.id}-heading`}
      className="bg-background py-16 md:py-32"
    >
      <h2 id={`${props.id}-heading`} className="sr-only">
        Long-form essay
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="bg-card ring-foreground/5 relative mx-auto max-w-2xl rounded-3xl border border-transparent p-8 pb-20 shadow ring-1 sm:p-12 sm:pb-24">
          <Button
            type="button"
            onClick={() => setIsFull((v) => !v)}
            className="group absolute bottom-8 left-8 z-10 flex pr-2.5 sm:bottom-10 sm:left-12"
            variant="secondary"
            size="sm"
            aria-expanded={isFull}
          >
            <span>{tRoot(isFull ? props.readLessLabelKey : props.readMoreLabelKey)}</span>
            {isFull ? (
              <Minus
                strokeWidth={2.5}
                aria-hidden="true"
                className="!size-3.5 opacity-50 duration-300"
              />
            ) : (
              <Plus
                strokeWidth={2.5}
                aria-hidden="true"
                className="!size-3.5 opacity-50 duration-300 group-hover:rotate-90"
              />
            )}
          </Button>

          <motion.div
            className={cn("relative overflow-hidden", !isFull && "mask-b-from-45%")}
            initial={{ height: "22rem" }}
            animate={{ height: isFull ? "auto" : "22rem" }}
            exit={{ height: "22rem" }}
          >
            <div className="text-muted-foreground space-y-4 text-lg *:leading-relaxed">
              {props.paragraphKeys.map((key, index) => (
                <p key={index}>{tRoot.rich(key, RICH_STRONG)}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
