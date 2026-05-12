import { LogoIcon } from "@/components/ui-primitives/grid-2-landing-logo";

export const InvoiceIllustration = () => {
  return (
    <div aria-hidden className="relative">
      <div className="grid grid-cols-7 gap-px @3xl:grid-cols-4">
        <div className="grid grid-rows-3 gap-y-px">
          <div data-grid-content />
          <div data-grid-content />
          <div data-grid-content />
        </div>

        <div className="col-span-5 space-y-px @3xl:col-span-2">
          <div data-grid-content className="h-fit! p-6!">
            <div className="w-full space-y-1 text-sm [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
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
                <span className="bg-border h-2 w-3/4 rounded-full px-2" />
              </div>
            </div>
          </div>

          <div data-grid-content className="relative h-fit! p-2!">
            <div className="absolute inset-4 bg-linear-to-r from-purple-500 via-amber-500 to-indigo-500 opacity-25 blur-2xl"></div>

            <div className="bg-card ring-border-illustration relative rounded-xl p-6 shadow-xl ring-1 shadow-black/6">
              <div className="mb-6 flex items-start justify-between">
                <div className="space-y-0.5">
                  <LogoIcon />
                  <div className="mt-4 font-mono text-xs">INV-456789</div>
                  <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">
                    $284,342.57
                  </div>
                  <div className="text-xs font-medium">Due in 15 days</div>
                </div>
              </div>

              <div className="border-foreground/15 bg-foreground/3 mt-6 flex h-16 items-center justify-center rounded-md border border-dashed">
                <div className="text-foreground/50 border-foreground/35 border-b px-6 font-serif text-lg">
                  Sign here
                </div>
              </div>
            </div>
          </div>

          <div data-grid-content className="h-fit! p-6!">
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <LogoIcon
                  uniColor
                  className="*:stroke-foreground opacity-50 *:fill-transparent"
                />
                <div className="mt-4 font-mono text-xs">INV-456349</div>
                <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">
                  $57,452.64
                </div>
                <div className="text-xs font-medium">Due today</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-3 gap-y-px">
          <div data-grid-content />
          <div data-grid-content />
          <div data-grid-content />
        </div>
      </div>
    </div>
  );
};
