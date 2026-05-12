import { LogoIcon } from "@/components/layouts/_shared/logo";
import { Firebase } from "@/components/ui-primitives/svgs/firebase";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { cn } from "@/lib/utils";

type Node = {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const NODES: readonly Node[] = [
  { name: "Vercel", Icon: Vercel },
  { name: "Supabase", Icon: Supabase },
  { name: "Firebase", Icon: Firebase },
];

export const FlowCardsIllustration = () => {
  return (
    <div
      aria-hidden
      className="relative flex min-h-[420px] w-fit min-w-[420px] flex-col items-center"
    >
      <svg
        viewBox="0 0 227 274"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground/15 pointer-events-none absolute inset-0 mx-auto h-full w-3/5"
      >
        <path
          d="M226 2.5V62C226 73.0457 217.046 82 206 82H140.5C129.454 82 120.5 90.9543 120.5 102V151"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <path d="M112.5 0.5V273" stroke="currentColor" strokeLinecap="round" />
        <path
          d="M0.5 1V62.5C0.5 73.5457 9.45431 82.5 20.5 82.5H84.5C95.5457 82.5 104.5 91.4543 104.5 102.5V151"
          stroke="currentColor"
          strokeLinecap="round"
        />

        {/* Animated paths */}
        <path
          d="M226 2.5V62C226 73.0457 217.046 82 206 82H140.5C129.454 82 120.5 90.9543 120.5 102V151"
          stroke="url(#flow-cards-gradient)"
          strokeWidth="1"
          strokeDasharray="80 300"
          strokeDashoffset="680"
          style={{ animation: "flow-cards-beam-up 6.4s linear infinite" }}
        />
        <path
          d="M112.5 0.5V273"
          stroke="url(#flow-cards-gradient-vertical)"
          strokeWidth="1"
          strokeDasharray="80 300"
          strokeDashoffset="680"
          style={{
            animation: "flow-cards-beam-up 6.4s linear infinite",
            animationDelay: "2s",
          }}
        />
        <path
          d="M0.5 1V62.5C0.5 73.5457 9.45431 82.5 20.5 82.5H84.5C95.5457 82.5 104.5 91.4543 104.5 102.5V151"
          stroke="var(--color-foreground)"
          strokeWidth="1"
          strokeDasharray="80 300"
          strokeDashoffset="680"
          style={{ animation: "flow-cards-beam-up 6.4s linear infinite" }}
        />

        <defs>
          <linearGradient id="flow-cards-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9100" />
            <stop offset="25%" stopColor="#FFC400" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#FF9100" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#DD2C00" />
          </linearGradient>
          <linearGradient
            id="flow-cards-gradient-vertical"
            gradientUnits="userSpaceOnUse"
            x1="105"
            y1="30"
            x2="105"
            y2="320"
          >
            <stop offset="0%" stopColor="currentColor" className="text-background/15" />
            <stop offset="25%" stopColor="var(--color-emerald-400)" />
            <stop offset="50%" stopColor="var(--color-indigo-400)" stopOpacity={0.5} />
            <stop offset="75%" stopColor="var(--color-purple-400)" />
            <stop offset="100%" stopColor="currentColor" className="text-background/15" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 grid grid-cols-3 gap-3">
        {NODES.map(({ name, Icon }) => (
          <div
            key={name}
            className="bg-illustration ring-border-illustration row-span-3 grid w-28 grid-rows-subgrid gap-3 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs leading-tight font-medium">
                {name} <br /> Usage
              </div>
              <div
                className={cn(
                  "shrink-0 *:size-3.5",
                  name === "Vercel" && "*:fill-foreground",
                )}
              >
                <Icon />
              </div>
            </div>
            <div className="space-y-1.5 self-start">
              <div className="space-y-1.5">
                {[1, 2].map((row) => (
                  <div key={row} className="flex gap-2">
                    <div className="bg-foreground/10 h-1 flex-1 rounded-full" />
                    <div className="bg-foreground/10 h-1 w-8 rounded-full" />
                  </div>
                ))}
                <div className="flex gap-2">
                  <div className="bg-foreground/10 h-1 w-full rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                  <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                </div>
                <div className="mt-4 flex gap-1">
                  <div className="bg-foreground/10 h-1 w-2/3 rounded-full" />
                  <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                  <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-24 mb-20">
        <div className="dark:bg-illustration/75 dark:ring-border-illustration relative flex size-14 items-center justify-center rounded-full bg-black/75 shadow-xl ring-1 shadow-black/20 ring-black backdrop-blur">
          <LogoIcon className="size-6" />
        </div>
      </div>

      <div className="relative">
        <div className="after:border-foreground/15 absolute -right-4 bottom-4 z-2 rounded bg-rose-500 px-1.5 py-0.5 text-xs font-semibold text-white shadow-lg shadow-rose-900/25 text-shadow-sm after:absolute after:inset-0 after:rounded after:border">
          PDF
        </div>
        <div className="bg-illustration corner-tr-bevel ring-border-illustration relative z-1 w-24 space-y-3 rounded-md rounded-tr-[15%] p-3 shadow-md ring-1 shadow-black/6.5">
          <div className="text-xs font-semibold">INVOICE</div>
          <div className="space-y-1.5">
            {[1, 2].map((row) => (
              <div key={row} className="flex gap-2">
                <div className="bg-foreground/10 h-1 flex-1 rounded-full" />
                <div className="bg-foreground/10 h-1 w-8 rounded-full" />
              </div>
            ))}
            <div className="flex gap-2">
              <div className="bg-foreground/10 h-1 w-full rounded-full" />
            </div>
            <div className="flex gap-1">
              <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
              <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
              <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
            </div>
            <div className="flex gap-1">
              <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
              <div className="bg-foreground/10 h-1 w-2/3 rounded-full" />
              <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
            </div>
            <div className="flex gap-1">
              <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
              <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
            </div>
          </div>
          <div className="bg-foreground mt-1 h-1 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};
