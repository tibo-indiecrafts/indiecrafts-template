/* eslint-disable -- Acme Pro upstream illustration kept verbatim */

import { TrendingUp, SignalHigh, WifiHigh } from "lucide-react";

export const MobileWalletAreaIllustration = () => (
  <div aria-hidden className="relative max-w-92 min-w-92 mask-b-from-75% px-4 pt-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
      <div className="bg-card ring-border-illustration overflow-hidden rounded-t-[2rem] px-6 pt-2 pb-16 shadow ring-1 shadow-black/6.5">
        <StatusBar />
        <div className="mt-6 mb-12 text-sm font-medium">Irung's Wallet</div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          Total Balance
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
          <div>
            <span className="text-foreground align-baseline text-3xl font-bold">
              $230
            </span>
            <span className="text-foreground/50 align-baseline text-3xl font-bold">
              .56
            </span>
          </div>

          <div className="mt-8">
            <svg viewBox="0 0 280 80" className="h-20 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity="0.4" />
                  <stop offset="65%" stopColor="var(--color-card)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,60 Q20,55 40,50 T80,45 T120,35 T160,40 T200,25 T240,20 T280,10 L280,80 L0,80 Z"
                fill="url(#areaGradient)"
              />
              <path
                d="M0,60 Q20,55 40,50 T80,45 T120,35 T160,40 T200,25 T240,20 T280,10"
                fill="none"
                stroke="var(--color-chart-1)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="text-foreground/50 mt-4 flex justify-between px-12 text-xs">
            <span>1D</span>
            <span className="text-foreground font-medium">1W</span>
            <span>1M</span>
            <span>6M</span>
            <span>1Y</span>
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

export default MobileWalletAreaIllustration;
