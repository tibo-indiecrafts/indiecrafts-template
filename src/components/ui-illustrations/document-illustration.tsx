import { Signature } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Generic document-card mock — rounded card with skeleton dash rows
 * (header dot + filename, two ledger rows, footer two-tone bar) and a
 * trailing signature glyph. Used by `sections-bento/bento-4/` (also
 * stacked three-up at `-rotate-12 / 0 / +rotate-12` for the "outputs"
 * step of its formula visualization). Pure decoration; mock copy
 * stays hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/bento-4` (upstream `DocumentIllustation`; renamed to
 * fix the upstream typo).
 */
export const DocumentIllustration = ({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden
      className={cn(
        "bg-illustration ring-border-illustration w-16 space-y-2 rounded-md p-2 shadow-md ring-1 shadow-black/6.5 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <div className="bg-foreground/15 size-2.5 rounded-full" />
        <div className="bg-foreground/15 h-[3px] w-4 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <div className="bg-foreground/15 h-[3px] w-2.5 rounded-full" />
          <div className="bg-foreground/15 h-[3px] w-6 rounded-full" />
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-foreground/15 h-[3px] w-2.5 rounded-full" />
          <div className="bg-foreground/15 h-[3px] w-6 rounded-full" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="bg-foreground/15 h-[3px] w-full rounded-full" />
        <div className="flex items-center gap-1">
          <div className="bg-foreground/15 h-[3px] w-2/3 rounded-full" />
          <div className="bg-foreground/15 h-[3px] w-1/3 rounded-full" />
        </div>
      </div>
      <Signature className="ml-auto size-3" />
    </div>
  );
};
