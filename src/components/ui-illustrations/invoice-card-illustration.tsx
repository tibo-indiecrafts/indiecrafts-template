import { LogoIcon } from "@/components/layouts/_shared/logo";
import { DocumentIllustration } from "@/components/ui-illustrations/document-illustration";
import { cn } from "@/lib/utils";

export const InvoiceCardIllustration = ({ className }: { className?: string }) => {
  return (
    <div aria-hidden className={cn(className)}>
      <div className="bg-card ring-border-illustration relative overflow-hidden rounded-2xl border border-transparent p-8 text-sm shadow-lg ring-1 shadow-black/6.5">
        <div className="mb-6 flex items-start justify-between [--color-background:color-mix(in_oklab,var(--color-foreground)10%,var(--color-zinc-950))]">
          <div className="space-y-0.5">
            <LogoIcon />
            <div className="mt-4 font-mono text-xs">INV-456789</div>
            <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">
              $284,342.57
            </div>
            <div className="text-xs font-medium">Due in 15 days</div>
          </div>
          <DocumentIllustration />
        </div>

        <div className="mb-12 space-y-1.5 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
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
  );
};
