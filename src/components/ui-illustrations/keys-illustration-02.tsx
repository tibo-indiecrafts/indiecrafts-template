import { Globe } from "lucide-react";

export const KeysIllustration = () => (
  <div
    aria-hidden
    className="flex aspect-video items-center justify-center text-white @4xl:aspect-auto"
  >
    <div className="relative mx-auto flex w-fit gap-3">
      <div className="border-foreground/15 absolute -inset-x-6 inset-y-0 border-y border-dashed"></div>
      <div className="border-foreground/15 absolute inset-x-0 -inset-y-6 border-x border-dashed"></div>
      <div className="ring-foreground relative flex aspect-square size-16 items-center rounded-[7px] border border-white/25 bg-zinc-700 p-3 shadow-lg ring inset-shadow-sm shadow-black/35 inset-shadow-white/25">
        <span className="absolute top-1 right-2 block text-sm">fn</span>
        <Globe className="mt-auto size-4" />
      </div>
      <div className="ring-foreground relative flex aspect-square size-16 items-center justify-center rounded-[7px] border border-white/25 bg-zinc-700 p-3 shadow-lg ring inset-shadow-sm shadow-black/35 inset-shadow-white/25">
        <span>K</span>
      </div>
    </div>
  </div>
);
