import { cn } from "@/lib/utils";

export const DocumentAnalysisIllustration = () => {
  return (
    <div aria-hidden className="bg-foreground/3 relative isolate rounded border p-2">
      <CardDecorator className="opacity-50" />
      <div className="animate-scan absolute inset-x-4 inset-y-6 z-10 mix-blend-color">
        <div className="via-primary animate-hue-rotate absolute -inset-x-[9px] m-auto h-8.5 -translate-y-1/2 rounded-md bg-linear-to-b from-transparent to-transparent" />
      </div>
      <div className="animate-scan absolute inset-x-4 inset-y-6 z-10">
        <div className="bg-foreground absolute -inset-x-4 m-auto h-px rounded-full" />
        <div className="to-primary absolute -inset-x-4 m-auto h-px rounded-full bg-linear-to-r from-emerald-500 blur" />
      </div>
      <div
        aria-hidden
        className="bg-card ring-border-illustration w-20 space-y-2 rounded-md p-3 shadow-lg ring-1 shadow-black/6.5"
      >
        <div className="flex items-center gap-1">
          <div className="bg-border size-2.5 rounded-full" />
          <div className="bg-border h-[3px] w-4 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <div className="bg-border h-[3px] w-2.5 rounded-full" />
            <div className="bg-border h-[3px] w-6 rounded-full" />
          </div>
          <div className="flex items-center gap-1">
            <div className="bg-border h-[3px] w-2.5 rounded-full" />
            <div className="bg-border h-[3px] w-6 rounded-full" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="bg-border h-[3px] w-full rounded-full" />
          <div className="flex items-center gap-1">
            <div className="bg-border h-[3px] w-2/3 rounded-full" />
            <div className="bg-border h-[3px] w-1/3 rounded-full" />
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1">
            <div className="bg-border h-[3px] w-2/3 rounded-full" />
            <div className="bg-border h-[3px] w-1/3 rounded-full" />
            <div className="bg-border h-[3px] w-1/3 rounded-full" />
          </div>

          <div className="bg-border h-[3px] w-full rounded-full" />
          <div className="flex items-center gap-1">
            <div className="bg-border h-[3px] w-2/3 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CardDecorator = ({ className }: { className?: string }) => (
  <>
    <span
      className={cn(
        "border-foreground absolute -top-px -left-px block size-2 rounded-tl border-t border-l",
        className,
      )}
    ></span>
    <span
      className={cn(
        "border-foreground absolute -top-px -right-px block size-2 rounded-tr border-t border-r",
        className,
      )}
    ></span>
    <span
      className={cn(
        "border-foreground absolute -bottom-px -left-px block size-2 rounded-bl border-b border-l",
        className,
      )}
    ></span>
    <span
      className={cn(
        "border-foreground absolute -right-px -bottom-px block size-2 rounded-br border-r border-b",
        className,
      )}
    ></span>
  </>
);

export default DocumentAnalysisIllustration;
