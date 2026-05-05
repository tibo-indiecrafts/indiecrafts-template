import { Signature } from "lucide-react";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";

/**
 * Layered invoice paper mock — stacked card with masked top, brand
 * mark, mock invoice number / amount / due-date, an inline document
 * thumbnail, and three placeholder rows (To / From / Address). Pure
 * decoration; no translations (mock copy is not user-facing). Sourced
 * from `@tailark-pro/features-1`. The tiny document thumbnail is
 * inlined as a private sub-component since it has no other consumer.
 */
export const InvoiceIllustration = ({ className }: { className?: string }) => {
  return (
    <div aria-hidden className="relative">
      <div
        className={cn(
          "before:bg-background before:border-border after:border-border after:bg-background/50 group relative -mx-4 mask-b-from-65% px-4 pt-6 before:absolute before:inset-x-6 before:top-4 before:bottom-0 before:z-1 before:rounded-2xl before:border after:absolute after:inset-x-9 after:top-2 after:bottom-0 after:rounded-2xl after:border",
          className,
        )}
      >
        <div className="bg-illustration ring-border-illustration relative z-10 overflow-hidden rounded-2xl border border-transparent p-8 text-sm shadow-xl ring-1 shadow-black/6.5">
          <div className="mb-6 flex items-start justify-between">
            <div className="space-y-0.5">
              <LogoIcon className="size-5" />
              <div className="mt-4 font-mono text-xs">INV-456789</div>
              <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">
                $284,342.57
              </div>
              <div className="text-xs font-medium">Due in 15 days</div>
            </div>
            <DocumentThumb />
          </div>

          <div className="space-y-1.5 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
            <div className="grid grid-cols-[auto_1fr] items-center">
              <span className="text-muted-foreground block w-18">To</span>
              <span className="bg-border h-2 w-1/4 rounded-full px-2" />
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center">
              <span className="text-muted-foreground block w-18">From</span>
              <span className="bg-border h-2 w-1/2 rounded-full px-2" />
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center">
              <span className="text-muted-foreground block w-18">Address</span>
              <span className="bg-border h-2 w-2/3 rounded-full px-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function DocumentThumb() {
  return (
    <div className="bg-illustration ring-border-illustration w-16 space-y-2 rounded-md p-2 shadow-md ring-1 shadow-black/6.5 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]">
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
      <Signature className="ml-auto size-3" aria-hidden />
    </div>
  );
}
