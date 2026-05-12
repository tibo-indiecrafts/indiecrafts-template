import { Check, CircleDashed, GitBranch, SignalHigh, WifiHigh } from "lucide-react";

export const MobileAiAssistantIllustration = () => (
  <div aria-hidden className="relative max-w-92 min-w-92 mask-b-from-75% px-4 pt-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
      <div className="bg-card ring-border-illustration overflow-hidden rounded-t-[2rem] px-6 pt-2 pb-16 shadow ring-1 shadow-black/6.5">
        <StatusBar />
        <div className="mt-6 mb-6 text-sm font-medium">AI Assistant</div>

        <div className="bg-foreground/5 rounded-xl border p-3">
          <div className="text-foreground text-sm font-medium">
            Writing email draft...
          </div>
          <div className="text-muted-foreground mt-0.5 text-xs">
            Based on your meeting notes
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-muted-foreground text-xs">Task Progress</div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Check className="size-3.5" />
              </div>
              <span className="text-sm">Analyzing meeting notes</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Check className="size-3.5" />
              </div>
              <span className="text-sm">Extracting key points</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-6 animate-pulse items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <CircleDashed className="size-4 animate-spin" />
              </div>
              <span className="text-sm">Generating email draft</span>
            </div>

            <div className="flex items-center gap-3 opacity-50">
              <div className="bg-muted flex size-6 items-center justify-center rounded-full">
                <GitBranch className="size-3.5" />
              </div>
              <span className="text-muted-foreground text-sm">Review & refine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatusBar = () => (
  <div className="flex items-center justify-between py-2 pl-4 text-xs">
    <span className="font-semibold">9:41</span>
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

export default MobileAiAssistantIllustration;
