import { LogoIcon } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";

const DOC_TYPES = [
  { type: "PDF", chip: "bg-rose-500 shadow-rose-900/25" },
  { type: "DOC", chip: "bg-blue-500 shadow-blue-900/25" },
  { type: "TXT", chip: "bg-orange-600 shadow-orange-900/25" },
] as const;

/**
 * Animated data-flow illustration — a SOURCE card on the left feeds
 * an animated dashed beam into the brand logo node, which then
 * fans out three more beams to PDF / DOC / TXT document mocks on the
 * right. Beam keyframes live in `flow-illustration.css` and are
 * picked up via the auto-aggregator. Pure decoration; mock labels
 * stay hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/features-carousel-5` (upstream `Flow5Illustration`;
 * renamed since no Flow1..4 exist).
 */
export const FlowIllustration = () => {
  return (
    <div
      aria-hidden
      className="relative mx-auto flex w-fit min-w-[420px] items-center justify-center"
    >
      <svg
        viewBox="0 0 661 363"
        fill="none"
        className="text-foreground/15 pointer-events-none absolute inset-0 mx-auto h-full w-4/5"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Static rails */}
        <path
          d="M0.5 181.5H330"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2}
        />
        <path
          d="M330 181.5H660"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2}
        />
        <path
          d="M343.5 173.5H449.28C467.782 173.5 482.78 158.502 482.78 140V64.5C482.78 29.1538 511.434 0.5 546.78 0.5H660.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2}
        />
        <path
          d="M343.5 189.5H449.28C467.782 189.5 482.78 204.498 482.78 223V298.5C482.78 333.846 511.434 362.5 546.78 362.5H660.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2}
        />

        {/* Animated dashed beams */}
        <path
          d="M0.5 181.5H330"
          strokeLinecap="round"
          stroke="url(#flow-gradient-center)"
          strokeWidth="2"
          strokeDasharray="80 400"
          strokeDashoffset="400"
          style={{ animation: "var(--animate-flow-source-to-logo)" }}
        />
        <path
          d="M330 181.5H660"
          strokeLinecap="round"
          stroke="url(#flow-gradient-center)"
          strokeWidth="2"
          strokeDasharray="80 400"
          strokeDashoffset="400"
          style={{ animation: "var(--animate-flow-logo-to-docs)" }}
        />
        <path
          d="M343.5 173.5H449.28C467.782 173.5 482.78 158.502 482.78 140V64.5C482.78 29.1538 511.434 0.5 546.78 0.5H660.5"
          strokeLinecap="round"
          stroke="url(#flow-gradient-fan)"
          strokeWidth="2"
          strokeDasharray="80 400"
          strokeDashoffset="400"
          style={{ animation: "var(--animate-flow-logo-to-docs)" }}
        />
        <path
          d="M343.5 189.5H449.28C467.782 189.5 482.78 204.498 482.78 223V298.5C482.78 333.846 511.434 362.5 546.78 362.5H660.5"
          strokeLinecap="round"
          stroke="url(#flow-gradient-fan)"
          strokeWidth="2"
          strokeDasharray="80 400"
          strokeDashoffset="400"
          style={{ animation: "var(--animate-flow-logo-to-docs)" }}
        />

        <defs>
          <linearGradient id="flow-gradient-fan" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="currentColor" className="text-background/15" />
            <stop offset="25%" stopColor="var(--color-emerald-400)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--color-indigo-400)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-sky-400)" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient
            id="flow-gradient-center"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="181"
            x2="660"
            y2="181"
          >
            <stop
              offset="0%"
              stopColor="currentColor"
              className="text-background/15"
              stopOpacity={0}
            />
            <stop offset="25%" stopColor="var(--color-emerald-400)" />
            <stop offset="50%" stopColor="var(--color-indigo-400)" stopOpacity={0.5} />
            <stop offset="75%" stopColor="var(--color-blue-400)" />
            <stop offset="100%" stopColor="currentColor" className="text-background/15" />
          </linearGradient>
        </defs>
      </svg>

      <div className="bg-illustration ring-border-illustration relative z-10 mr-12 w-24 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5">
        <span className="block text-[10px] font-semibold">SOURCE</span>
        <div className="mt-2 space-y-1">
          <div className="bg-foreground/10 h-1 w-full rounded-full" />
          <div className="bg-foreground/10 h-1 w-3/4 rounded-full" />
          <div className="bg-foreground/10 h-1 w-1/2 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 mr-12 ml-10">
        <div className="dark:bg-illustration/75 dark:ring-border-illustration relative flex size-14 items-center justify-center rounded-full bg-black/75 shadow-xl ring-1 shadow-black/20 ring-black backdrop-blur">
          <LogoIcon className="size-5" />
        </div>
      </div>

      <div className="relative z-10 ml-8 flex flex-col gap-6">
        {DOC_TYPES.map(({ type, chip }) => (
          <div key={type} className="relative">
            <div
              className={cn(
                "after:border-foreground/15 absolute -right-3 bottom-2 z-2 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-lg text-shadow-sm after:absolute after:inset-0 after:rounded after:border",
                chip,
              )}
            >
              {type}
            </div>
            <div className="bg-illustration corner-tr-bevel ring-border-illustration relative z-1 w-16 space-y-3 rounded-md rounded-tr-[15%] p-3 shadow-md ring-1 shadow-black/6.5">
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="bg-foreground/10 h-0.5 w-full rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full" />
                  <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                  <div className="bg-foreground/10 h-0.5 w-2/3 rounded-full" />
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                </div>
                <div className="flex gap-1">
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                  <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                </div>
              </div>
              <div className="flex gap-1 pt-1">
                <div className="bg-foreground h-0.5 w-4 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
