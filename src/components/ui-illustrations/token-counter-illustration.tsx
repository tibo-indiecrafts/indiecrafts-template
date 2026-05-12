export const TokenCounterIllustration = () => {
  return (
    <div aria-hidden className="-mx-4">
      <div className="mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top px-3 pt-1">
        <div className="ring-border-illustration bg-background/75 min-w-2xs rounded-t-2xl px-2 pt-4 shadow-lg ring-1 shadow-black/6.5">
          <div className="text-muted-foreground mb-3 flex items-center gap-2.5 px-3 font-medium">
            Usage
          </div>

          <div className="bg-illustration ring-border-illustration flex flex-col gap-5 rounded-t-xl px-5 pt-5 shadow ring-1">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground text-base">User prompt tokens</span>
                  <span className="text-foreground font-medium">43%</span>
                </div>
                <div className="text-muted-foreground text-xs">
                  Using a premium model costs one prompt credit per use.
                </div>
                <div className="relative mt-5">
                  <div className="bg-foreground/5 relative h-2 overflow-hidden rounded-full">
                    <div className="from-primary absolute inset-y-0 left-0 w-[43%] rounded-full bg-linear-to-l to-emerald-500 before:absolute before:inset-0 before:rounded-full before:border before:border-white/20 before:mask-x-from-65%" />
                  </div>
                  <div className="absolute inset-y-0 left-0 w-[43%] rounded-full bg-linear-to-l from-white to-emerald-500 opacity-35 blur" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">550 / 1,500 tokens</span>
                  <span className="text-emerald-500">950 left</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/50 rounded-lg border p-2">
                  <div className="text-muted-foreground">Est. Cost</div>
                  <div className="text-foreground mt-0.5 font-medium">$0.25</div>
                </div>
                <div className="bg-muted/50 rounded-lg border p-2">
                  <div className="text-muted-foreground">Requests</div>
                  <div className="text-foreground mt-0.5 font-medium">48</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
