export const VisualizationIllustration = () => {
  return (
    <div
      aria-hidden
      className="group mask-b-from-75% px-4 pt-4 [--color-primary:var(--color-indigo-500)]"
    >
      <div className="bg-illustration ring-border-illustration relative z-10 rounded-xl p-6 shadow-xl ring-1 shadow-black/10">
        <div className="text-foreground font-medium">Spending Limit</div>
        <div className="text-muted-foreground mt-0.5 text-sm">
          New users by First user primary channel group
        </div>
        <div className="relative my-6 grid grid-cols-[auto_1fr] gap-3 border-l">
          <div className="h-full w-2 bg-[repeating-linear-gradient(var(--color-border),var(--color-border)_1px,transparent_1px,transparent_9px)]" />
          <div className="space-y-3 **:rounded">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <div className="from-primary inset-ring-foreground/10 h-5 w-full bg-linear-to-r to-blue-500 p-0.5 shadow-lg inset-ring-1 shadow-black/15">
                <div className="h-full bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-5" />
              </div>
              <span className="text-muted-foreground text-xs">32k</span>
            </div>
            <div className="grid w-2/3 grid-cols-[1fr_auto] items-center gap-2">
              <div className="h-5 rounded-r-md border border-emerald-400 p-0.5">
                <div className="h-full bg-[repeating-linear-gradient(-45deg,var(--color-emerald-400),var(--color-emerald-400)_1px,transparent_1px,transparent_4px)]" />
              </div>
              <span className="text-muted-foreground text-xs">22k</span>
            </div>
            <div className="grid w-2/5 grid-cols-[1fr_auto] items-center gap-2">
              <div className="h-5 rounded-r-md border p-0.5">
                <div className="h-full bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-15" />
              </div>
              <span className="text-muted-foreground text-xs">12k</span>
            </div>
          </div>
        </div>

        <div className="space-y-1 border-t border-dashed pt-6">
          <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            <div className="size-1.5 rounded-full bg-emerald-500"></div>
            <div className="line-clamp-1 text-sm font-medium">
              Running <span className="text-muted-foreground">(20%)</span> average of 12
              Minutes
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            <div className="bg-primary size-1.5 rounded-full"></div>
            <div className="line-clamp-1 text-sm font-medium">
              Swimming <span className="text-muted-foreground">(20%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
