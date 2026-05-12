import { TrendingUp } from "lucide-react";

export const WalletIllustration = () => {
  return (
    <div className="">
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
          <span className="text-foreground align-baseline text-3xl font-bold">$230</span>
          <span className="text-foreground/50 align-baseline text-3xl font-bold">
            .56
          </span>
        </div>

        <div className="text-muted-foreground mt-8 flex items-end gap-1">
          {Array.from({ length: 38 }).map((_, index) => {
            return (
              <div
                key={index}
                className="bg-foreground/10 h-4 w-[3px] rounded-full last:h-20 last:bg-linear-to-b last:from-green-300 last:to-green-500"
              />
            );
          })}
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
  );
};
