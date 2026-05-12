import { LogoIcon } from "@/components/ui-primitives/libre-landing-logo";

export const ChipIllustration = () => {
  return (
    <div
      data-theme="dark"
      className="bg-background/25 relative w-fit rounded-2xl border p-1 inset-ring-1 inset-ring-white before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-b before:to-blue-500/15"
    >
      <div className="inset-ring-foreground/15 grid grid-rows-[auto_1fr_auto] gap-1 rounded-lg bg-zinc-700 p-2 shadow-xl inset-shadow-2xs inset-ring-1 shadow-black/25 inset-shadow-white">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
          <div className="flex size-2">
            <div className="bg-background border-foreground/50 m-auto size-1.5 rounded-full border"></div>
          </div>
          <div className="h-2 bg-[repeating-linear-gradient(90deg,var(--color-background),var(--color-background)_1px,transparent_1px,transparent_6px)]"></div>
          <div className="flex size-2">
            <div className="bg-background border-foreground/50 m-auto size-1.5 rounded-full border"></div>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto]">
          <div className="w-2 bg-[repeating-linear-gradient(var(--color-background),var(--color-background)_1px,transparent_1px,transparent_6px)]"></div>
          <div className="p-2">
            <div className="bg-background border-foreground/25 size-16 rounded-2xl border p-1">
              <div className="inset-ring-foreground/35 flex size-full rounded-[11px] bg-linear-to-br from-emerald-600/50 to-indigo-600/50 shadow-md inset-ring-1 shadow-indigo-600/15">
                <LogoIcon className="m-auto size-5 text-white drop-shadow-md" uniColor />
              </div>
            </div>
          </div>
          <div className="w-2 bg-[repeating-linear-gradient(var(--color-background),var(--color-background)_1px,transparent_1px,transparent_6px)]"></div>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1">
          <div className="flex size-2">
            <div className="bg-background border-foreground/50 m-auto size-1.5 rounded-full border"></div>
          </div>
          <div className="h-2 bg-[repeating-linear-gradient(90deg,var(--color-background),var(--color-background)_1px,transparent_1px,transparent_6px)]"></div>
          <div className="flex size-2">
            <div className="bg-background border-foreground/50 m-auto size-1.5 rounded-full border"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
