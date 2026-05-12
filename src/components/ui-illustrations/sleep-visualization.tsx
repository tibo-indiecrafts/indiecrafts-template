import { SignalHigh, WifiHigh, TrendingDown, ChevronRight } from "lucide-react";

export const SleepVisualization = () => {
  return (
    <div aria-hidden className="relative min-w-92 mask-b-from-75% px-4 pt-2">
      <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
        <div className="bg-card ring-border-illustration overflow-hidden rounded-t-[2rem] px-6 pt-2 pb-16 shadow ring-1 shadow-black/6.5">
          <StatusBar />
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <div className="text-sm font-medium">Sleep</div>
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="text-muted-foreground mt-6 flex items-center gap-2 border-t-2 border-transparent text-xs">
                  In Bed
                  <div className="flex items-center gap-1">
                    <div className="flex size-3 rounded-xs bg-rose-600">
                      <TrendingDown className="m-auto size-2 text-white" />
                    </div>
                    <span className="border-t border-transparent text-[11px] font-medium text-rose-600 dark:text-rose-400">
                      25%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="space-x-1">
                    <span className="text-title align-baseline text-3xl font-semibold">
                      5
                    </span>
                    <span className="text-foreground/50 text-xs">hr</span>
                  </div>
                  <div className="space-x-1">
                    <span className="text-title align-baseline text-3xl font-semibold">
                      45
                    </span>
                    <span className="text-foreground/50 text-xs">min</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-1">
                <div className="bg-border-illustration h-3 w-1.5 rounded" />
                <div className="bg-border-illustration h-5 w-1.5 rounded" />
                <div className="bg-border-illustration h-10 w-1.5 rounded" />
                <div className="bg-border-illustration h-4 w-1.5 rounded" />
                <div className="bg-border-illustration h-6 w-1.5 rounded" />
                <div className="bg-border-illustration h-5 w-1.5 rounded" />
                <div className="h-9 w-1.5 rounded bg-linear-to-b from-blue-300 to-blue-500" />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border p-4">
            <div className="flex justify-between">
              <div className="flex gap-1.5">
                <svg
                  className="size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 32 32"
                >
                  <g fill="none">
                    <path
                      fill="#ff6723"
                      d="M26 19.34c0 6.1-5.05 11.005-11.15 10.641c-6.269-.374-10.56-6.403-9.752-12.705c.489-3.833 2.286-7.12 4.242-9.67c.34-.445.689 3.136 1.038 2.742c.35-.405 3.594-6.019 4.722-7.991a.694.694 0 0 1 1.028-.213C18.394 3.854 26 10.277 26 19.34"
                    />
                    <path
                      fill="#ffb02e"
                      d="M23 21.851c0 4.042-3.519 7.291-7.799 7.144c-4.62-.156-7.788-4.384-7.11-8.739C9.07 14.012 15.48 10 15.48 10S23 14.707 23 21.851"
                    />
                  </g>
                </svg>
                <span className="text-sm font-medium">Show all Health Data</span>
              </div>
              <ChevronRight className="size-4" />
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

export default SleepVisualization;
