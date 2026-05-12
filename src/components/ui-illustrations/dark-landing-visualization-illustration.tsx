export const MainIllustration = () => {
  return (
    <div className="bg-foreground/5 ring-foreground/10 relative z-10 rounded-lg p-5 pb-4 shadow-xl ring-1 inset-shadow-sm shadow-black/5 inset-shadow-white/5">
      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground text-sm">56 GB / 128 GB</span>
          <span className="text-foreground">45%</span>
        </div>
        <div className="bg-foreground/5 relative my-1.5 h-1.5 rounded-full before:absolute before:inset-0 before:z-1 before:w-3/5 before:rounded-full before:bg-linear-to-r before:from-white before:to-indigo-500 after:absolute after:inset-0 after:w-3/5 after:bg-linear-to-r after:from-white after:to-indigo-900 after:opacity-50 after:blur-xs" />
      </div>
    </div>
  );
};

export const VisualizationIllustration = () => {
  return (
    <div className="group relative -mx-8 -my-8 mask-radial-from-50% mask-radial-to-[75%_50%] mask-radial-at-center max-md:-mx-6">
      <div className="grid grid-cols-5 items-center gap-2">
        <div className="*:ring-foreground/5 grid h-full grid-rows-[1fr_auto_1fr] space-y-2 *:rounded-2xl *:ring-1">
          <div></div>
          <div className="bg-card/50 h-24"></div>
          <div></div>
        </div>
        <div className="col-span-3 grid grid-rows-[1fr_auto_1fr] space-y-2">
          <div className="bg-card/50 ring-foreground/5 flex rounded-b-xl p-6 ring-1"></div>
          <div className="relative">
            <div className="bg-foreground/15 absolute inset-0 blur-2xl"></div>
            <div className="bg-background/75 ring-foreground/10 relative rounded-2xl p-2 shadow-2xl ring-1 shadow-black/15">
              <MainIllustration />
            </div>
          </div>
          <div className="bg-card/50 ring-foreground/5 rounded-t-xl p-6 ring-1"></div>
        </div>
        <div className="*:ring-foreground/5 grid h-full grid-rows-[1fr_auto_1fr] space-y-2 *:rounded-2xl *:ring-1">
          <div></div>
          <div className="bg-card/50 h-24"></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
