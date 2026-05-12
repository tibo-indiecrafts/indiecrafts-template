"use client";

import { LogoIcon } from "@/components/logo";

export const Flow8Illustration = () => {
  return (
    <div
      aria-hidden
      className="relative flex min-h-[380px] w-fit min-w-[380px] items-center justify-center"
    >
      <style jsx>{`
        @keyframes region-flow {
          0% {
            stroke-dashoffset: 800;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {/* Flow lines SVG */}
      <svg
        viewBox="0 0 400 200"
        fill="none"
        className="text-foreground/15 pointer-events-none absolute inset-0 mx-auto h-full w-[90%]"
      >
        <defs>
          <linearGradient
            id="flow8-uk"
            gradientUnits="userSpaceOnUse"
            x1="115"
            y1="100"
            x2="300"
            y2="20"
          >
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="var(--color-sky-400)" />
          </linearGradient>
          <linearGradient
            id="flow8-us"
            gradientUnits="userSpaceOnUse"
            x1="115"
            y1="100"
            x2="300"
            y2="100"
          >
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="var(--color-emerald-400)" />
          </linearGradient>
          <linearGradient
            id="flow8-eu"
            gradientUnits="userSpaceOnUse"
            x1="115"
            y1="100"
            x2="300"
            y2="180"
          >
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="var(--color-sky-400)" />
          </linearGradient>
        </defs>

        {/* To UK */}
        <path
          d="M115 100 H180 Q200 100 210 70 L225 40 Q235 20 260 20 H300"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
        />
        {/* To US */}
        <path
          d="M115 100 H300"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
        />
        {/* To EU */}
        <path
          d="M115 100 H180 Q200 100 210 130 L225 160 Q235 180 260 180 H300"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
        />

        {/* Animated paths */}

        <path
          d="M115 100 H180 Q200 100 210 70 L225 40 Q235 20 260 20 H300"
          stroke="url(#flow8-uk)"
          strokeLinecap="round"
          strokeDasharray="40 300"
          strokeDashoffset="300"
          className="animate-[region-flow_2.5s_ease-in-out_infinite]"
        />
        <path
          d="M115 100 H300"
          stroke="url(#flow8-us)"
          strokeLinecap="round"
          strokeDasharray="40 300"
          strokeDashoffset="300"
          className="animate-[region-flow_2.5s_ease-in-out_infinite_0.3s]"
        />
        <path
          d="M115 100 H180 Q200 100 210 130 L225 160 Q235 180 260 180 H300"
          stroke="url(#flow8-eu)"
          strokeLinecap="round"
          strokeDasharray="40 300"
          strokeDashoffset="300"
          className="animate-[region-flow_2.5s_ease-in-out_infinite_0.6s]"
        />
      </svg>

      <div className="relative z-10 flex items-center gap-28">
        <div className="relative flex size-36 items-center justify-center rounded-full border border-dashed">
          <div className="dark:bg-illustration/75 dark:ring-border-illustration relative flex size-20 items-center justify-center rounded-full bg-black/75 shadow-xl ring-1 shadow-black/20 ring-black backdrop-blur">
            <LogoIcon className="size-6" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-illustration ring-border-illustration flex items-center gap-3 rounded-xl py-2 pr-4 pl-3 shadow-md ring-1 shadow-black/6.5">
            <span className="text-lg">🇬🇧</span>
            <span className="text-sm font-semibold">UK</span>
            <div className="flex size-6 items-center justify-center rounded-full bg-cyan-500">
              <span className="text-[8px] font-bold text-white">xero</span>
            </div>
          </div>

          <div className="bg-illustration ring-border-illustration flex items-center gap-3 rounded-xl py-2 pr-4 pl-3 shadow-md ring-1 shadow-black/6.5">
            <span className="text-lg">🇺🇸</span>
            <span className="text-sm font-semibold">US</span>
            <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500">
              <span className="text-[10px] font-bold text-white">qb</span>
            </div>
          </div>

          <div className="bg-illustration ring-border-illustration flex items-center gap-3 rounded-xl py-2 pr-4 pl-3 shadow-md ring-1 shadow-black/6.5">
            <span className="text-lg">🇪🇺</span>
            <span className="text-sm font-semibold">EU</span>
            <div className="flex size-6 items-center justify-center rounded-full bg-cyan-500">
              <span className="text-[8px] font-bold text-white">xero</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flow8Illustration;
