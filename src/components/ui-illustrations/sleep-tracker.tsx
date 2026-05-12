import { TrendingUp, SignalHigh, WifiHigh } from "lucide-react";

export const SleepTrackerIllustration = () => (
  <div aria-hidden className="relative min-w-92 mask-b-from-75% px-4 pt-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
      <div className="bg-card ring-border-illustration overflow-hidden rounded-t-[2rem] px-6 pt-2 pb-16 shadow ring-1 shadow-black/6.5">
        <StatusBar />
        <div className="mt-6 mb-8 text-sm font-medium">Sleep Analysis</div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          Sleep Quality
          <div className="flex items-center gap-1">
            <div className="flex size-3 rounded-xs bg-emerald-600">
              <TrendingUp className="m-auto size-2 text-white" />
            </div>
            <span className="border-t border-transparent text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Good
            </span>
          </div>
        </div>

        <div className="mt-0.5 flex flex-col justify-between">
          <div className="flex gap-2">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-3xl font-bold">7</span>
              <span className="text-foreground/50 text-xs">hr</span>
            </div>
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-3xl font-bold">
                42
              </span>
              <span className="text-foreground/50 text-xs">min</span>
            </div>
          </div>

          <div className="bg-foreground/5 mt-6 flex items-center justify-between rounded-2xl p-4 text-center">
            <div>
              <div className="text-muted-foreground text-xs">Bedtime</div>
              <div className="text-foreground mt-0.5 text-sm font-medium">11:24 PM</div>
            </div>
            <div className="bg-border h-6 w-px" />
            <div>
              <div className="text-muted-foreground text-xs">Wake up</div>
              <div className="text-foreground mt-0.5 text-sm font-medium">7:06 AM</div>
            </div>
            <div className="bg-border h-6 w-px" />
            <div>
              <div className="text-muted-foreground text-xs">Deep</div>
              <div className="text-foreground mt-0.5 text-sm font-medium">1h 45m</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-muted-foreground mb-2 text-xs">Sleep stages</div>
            <div className="flex h-4 gap-0.5 overflow-hidden rounded-lg *:rounded-sm">
              <div className="w-1/6 bg-emerald-300"></div>
              <div className="w-1/4 bg-emerald-400"></div>
              <div className="w-1/5 bg-emerald-600"></div>
              <div className="w-1/4 bg-emerald-800"></div>
              <div className="flex-1 bg-emerald-900"></div>
            </div>
            <div className="text-muted-foreground mt-1 flex justify-between text-xs">
              <span>Awake</span>
              <span>REM</span>
              <span>Light</span>
              <span>Deep</span>
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

export default SleepTrackerIllustration;
