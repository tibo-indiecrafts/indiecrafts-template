import { Lightbulb, PenLine, Search, Sparkle } from "lucide-react";

export const AIIllustration2 = () => {
  return (
    <div aria-hidden className="w-76">
      <div
        data-theme="dark"
        className="border-foreground/10 bg-background/85 flex h-96 flex-col rounded-2xl border p-4 shadow-2xl ring-1 shadow-black/75 ring-black backdrop-blur-lg"
      >
        <div>
          <div className="animate-hue-rotate relative size-fit">
            <div className="relative flex size-5 items-center justify-center rounded-full bg-conic/decreasing from-violet-500 via-lime-300 to-violet-400 blur-md"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkle className="size-4 fill-white stroke-white drop-shadow-sm" />
            </div>
          </div>
          <p className="mt-3 text-sm leading-tight text-balance">
            Hi Irung, how can I help you today?
          </p>
        </div>

        <div className="my-6 text-sm">
          <div className="text-muted-foreground text-xs">Suggesttions</div>
          <div className="-mx-2 mt-2 cursor-pointer">
            <div className="hover:bg-foreground/5 flex items-center gap-2 rounded-lg px-2 py-1.5">
              <Search className="size-4" />
              <span>Ask Anything</span>
            </div>
            <div className="hover:bg-foreground/5 flex items-center gap-2 rounded-lg px-2 py-1.5">
              <PenLine className="size-4" />
              <span>Write a cover letter</span>
            </div>
            <div className="hover:bg-foreground/5 flex items-center gap-2 rounded-lg px-2 py-1.5">
              <Lightbulb className="size-4" />
              <span>Explore ideas</span>
            </div>
          </div>
        </div>
        <div className="bg-foreground/3 ring-border-illustration mt-auto overflow-hidden rounded-lg shadow ring-1 shadow-indigo-950/10">
          <div className="text-muted-foreground bg-foreground/3 border-foreground/5 rounded-lg border-b p-3 text-xs">
            <span>Added corresponding “ghost” stroke lines for both series.</span>
          </div>

          <div className="text-muted-foreground px-3 py-2 text-xs">
            <span>Reply...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIllustration2;
