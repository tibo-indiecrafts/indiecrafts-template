import { TrendingUp, SignalHigh, WifiHigh } from "lucide-react";

export const RunningVisualization = () => {
  return (
    <div aria-hidden className="relative min-w-92 mask-b-from-75% px-4 pt-2">
      <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
        <div className="bg-card ring-border-illustration overflow-hidden rounded-t-[2rem] px-6 pt-2 pb-16 shadow ring-1 shadow-black/6.5">
          <StatusBar />
          <div className="text-muted-foreground mt-6 flex items-center gap-2 text-xs">
            Running
            <div className="flex items-center gap-1">
              <div className="flex size-3 rounded-xs bg-emerald-600">
                <TrendingUp className="m-auto size-2 text-white" />
              </div>
              <span className="border-t border-transparent text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                65%
              </span>
            </div>
          </div>

          <div className="mt-0.5 flex flex-col justify-between">
            <div className="flex gap-2">
              <div className="space-x-1">
                <span className="text-title align-baseline text-3xl font-semibold">
                  11
                </span>
                <span className="text-foreground/50 text-xs">hr</span>
              </div>
              <div className="space-x-1">
                <span className="text-title align-baseline text-3xl font-semibold">
                  59
                </span>
                <span className="text-foreground/50 text-xs">min</span>
              </div>
            </div>

            <div className="text-muted-foreground mt-12 grid h-32 grid-cols-7 items-end *:h-full">
              <div className="flex flex-col items-center justify-end gap-2 text-xs">
                <div className="bg-foreground/10 h-10 w-1/2 rounded" />
                Sun
              </div>
              <div className="flex flex-col items-center justify-end gap-2 text-xs">
                <div className="bg-foreground/10 h-16 w-1/2 rounded" />
                Mon
              </div>
              <div className="flex flex-col items-center justify-end gap-2 text-xs">
                <div className="bg-foreground/10 h-20 w-1/2 rounded" />
                Tue
              </div>
              <div className="flex flex-col items-center justify-end gap-2 text-xs">
                <div className="bg-foreground/10 h-28 w-1/2 rounded" />
                Wed
              </div>
              <div className="flex flex-col items-center justify-end gap-2 text-xs">
                <div className="bg-foreground/10 h-16 w-1/2 rounded" />
                Thu
              </div>
              <div className="flex flex-col items-center justify-end gap-2 text-xs">
                <div className="bg-foreground/10 h-12 w-1/2 rounded" />
                Fri
              </div>
              <div className="flex flex-col items-center justify-end gap-2 text-xs">
                <div className="h-24 w-1/2 rounded bg-gradient-to-b from-green-300 to-green-500" />
                Sat
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default RunningVisualization;
