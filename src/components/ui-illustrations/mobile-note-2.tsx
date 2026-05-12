import { SignalHigh, WifiHigh } from "lucide-react";

export const MobileNote2Illustration = () => (
  <div aria-hidden className="relative max-w-92 min-w-92 mask-b-from-65% px-4 pt-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
      <div className="ring-border-illustration bg-foreground/15 overflow-hidden rounded-t-[2rem] shadow ring-1 shadow-black/6.5 dark:bg-black">
        <div className="bg-card relative rounded-t-[2rem] rounded-b-3xl px-6 pb-6">
          <StatusBar />
          <div className="my-6 text-sm font-medium">New note</div>
          <div className="text-foreground/50 mb-2 text-2xl font-black">
            Add a Title...
          </div>
          <div className="text-foreground/50 text-sm">Add a description...</div>
        </div>
        <div className="mx-auto my-2 h-1 w-18 rounded-full bg-white dark:bg-white/15"></div>
        <div className="bg-card relative rounded-t-3xl p-6 pb-32">
          <div className="mb-6 text-sm font-medium">Note templates</div>
          <div className="grid grid-cols-3 gap-4">
            <div
              aria-hidden
              className="bg-illustration ring-border-illustration space-y-2 rounded-xl p-3 shadow-lg ring-1 shadow-black/6.5 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]"
            >
              <div className="space-y-1.5">
                <div className="mb-2 text-xs font-medium">Todo</div>
                <div className="flex items-center gap-1">
                  <div className="size-2.5 shrink-0 rounded-full border-1" />
                  <div className="bg-border h-[3px] w-12 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2.5 rounded-full border-1" />
                  <div className="bg-border h-[3px] w-6 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2.5 rounded-full border-1" />
                  <div className="bg-border h-[3px] w-9 rounded-full" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2.5 rounded-full border-1" />
                  <div className="bg-border h-[3px] w-3 rounded-full" />
                </div>
              </div>
            </div>
            <div className="bg-illustration ring-border-illustration overflow-hidden rounded-xl shadow-lg ring-1 shadow-black/6.5 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]">
              <div className="h-6 bg-linear-to-b from-amber-200 to-amber-300/75"></div>
              <span className="mt-px block h-[1.5px] bg-[linear-gradient(90deg,var(--color-foreground)_1.5px,transparent_1.5px)] bg-size-[6px_1.5px] bg-bottom bg-repeat-x opacity-30 dark:opacity-15" />
              <div className="space-y-3 p-3">
                <div className="bg-border h-[3px] w-9 rounded-full" />
                <div className="bg-border h-[3px] rounded-full" />
                <div className="bg-border h-[3px] rounded-full" />
                <div className="bg-border h-[3px] w-7 rounded-full" />
              </div>
            </div>
            <div className="bg-illustration ring-border-illustration space-y-2 rounded-xl p-3 shadow-lg ring-1 shadow-black/6.5 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]">
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
                <div className="bg-border h-[3px] w-full rounded-full" />

                <div className="bg-border h-[3px] w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatusBar = () => (
  <div className="relative flex items-center justify-between py-3 pl-4 text-xs">
    <span className="font-semibold">9:41</span>
    <div className="absolute inset-2 mx-auto w-20 rounded-full bg-black"></div>
    <div className="flex items-end gap-1">
      <SignalHigh className="size-4" />
      <WifiHigh className="size-4.5" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="-mb-px size-4"
      >
        <path
          fillRule="evenodd"
          d="M3.75 6.75a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 0 0-3-3h-15Zm15 1.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h15ZM4.5 9.75a.75.75 0 0 0-.75.75V15c0 .414.336.75.75.75H18a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75H4.5Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);

export default MobileNote2Illustration;
