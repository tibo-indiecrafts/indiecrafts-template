import { TrendingUp, SignalHigh, WifiHigh } from "lucide-react";

export const BankStatsIllustration = () => (
  <div aria-hidden className="relative min-w-92 mask-b-from-75% px-4 pt-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
      <div className="bg-card ring-border-illustration overflow-hidden rounded-t-[2rem] px-6 pt-2 pb-16 shadow ring-1">
        <StatusBar />
        <div className="mt-6 mb-8 text-sm font-medium">Monthly Overview</div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          Net Savings
          <div className="flex items-center gap-1">
            <div className="flex size-3 rounded-xs bg-emerald-600">
              <TrendingUp className="m-auto size-2 text-white" />
            </div>
            <span className="border-t border-transparent text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              38%
            </span>
          </div>
        </div>

        <div className="mt-0.5 flex flex-col justify-between">
          <div>
            <span className="text-foreground align-baseline text-3xl font-bold">
              $5,170
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-1">
            <div className="bg-foreground/5 rounded-2xl px-4 py-3">
              <span className="text-foreground/50 text-xs">Income</span>
              <div className="text-foreground mt-0.5 text-lg font-semibold">$8,450</div>
            </div>
            <div className="bg-foreground/5 rounded-2xl px-4 py-3">
              <span className="text-foreground/50 text-xs">Expenses</span>
              <div className="text-foreground mt-0.5 text-lg font-semibold">$3,280</div>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-foreground text-sm font-semibold">
              Spending Categories
            </div>
            <div className="mt-2 flex h-4 gap-0.5 overflow-hidden rounded-lg *:rounded-sm">
              <div className="w-3/6 bg-blue-500"></div>
              <div className="w-2/6 bg-indigo-500"></div>
              <div className="w-1/6 bg-purple-500"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="size-2 rounded-full bg-blue-500"></div>
                <span className="text-foreground">Food & Dining</span>
                <span className="text-foreground/50">$840</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="size-2 rounded-full bg-indigo-500"></div>
                <span className="text-foreground">Shopping</span>
                <span className="text-foreground/50">$520</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="size-2 rounded-full bg-purple-500"></div>
                <span className="text-foreground">Entertainment</span>
                <span className="text-foreground/50">$300</span>
              </div>
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

export default BankStatsIllustration;
