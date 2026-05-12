import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { DocumentIllustation } from "@/components/ui-illustrations/grid-1-landing-document-illustration";

export const InvoiceIllustration = ({ className }: { className?: string }) => {
  return (
    <div aria-hidden className="relative">
      <div
        className={cn(
          "before:bg-background before:border-border after:border-border after:bg-background/50 group relative -mx-4 mask-b-from-65% px-4 pt-6 before:absolute before:inset-x-6 before:top-4 before:bottom-0 before:z-1 before:rounded-xl before:border before:shadow after:absolute after:inset-x-9 after:top-2 after:bottom-0 after:rounded-xl after:border after:shadow",
          className,
        )}
      >
        <div className="bg-illustration ring-border-illustration relative z-10 overflow-hidden rounded-xl p-8 text-sm shadow-lg ring-1 shadow-indigo-900/15">
          <div className="mb-6 flex items-start justify-between">
            <div className="space-y-0.5">
              <LogoIcon />
              <div className="mt-4 font-mono text-xs">INV-456789</div>
              <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">
                $284,342.57
              </div>
              <div className="text-xs font-medium">Due in 15 days</div>
            </div>
            <DocumentIllustation />
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
