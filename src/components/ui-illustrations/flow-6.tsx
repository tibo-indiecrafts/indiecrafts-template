"use client";

import { Globe, Server, ArrowLeftRight } from "lucide-react";
import { motion } from "motion/react";

const requestTransition = {
  duration: 2,
  ease: "easeInOut" as const,
  repeat: Infinity,
};

const responseTransition = {
  duration: 2,
  ease: "easeInOut" as const,
  repeat: Infinity,
};

export const Flow6Illustration = () => {
  return (
    <div
      aria-hidden
      className="relative flex min-h-[420px] w-fit min-w-[420px] flex-col items-center justify-center"
    >
      <svg
        viewBox="0 0 280 120"
        fill="none"
        className="text-foreground/15 pointer-events-none absolute inset-0 mx-auto h-full w-3/5"
      >
        <path d="M60 50 H220" stroke="currentColor" strokeLinecap="round" />
        <path d="M60 70 H220" stroke="currentColor" strokeLinecap="round" />

        {/* Paths shadow */}

        <path
          d="M60 50 H220"
          stroke="currentColor"
          strokeLinecap="round"
          className="text-background -translate-y-px"
        />
        <path
          d="M60 70 H220"
          stroke="currentColor"
          strokeLinecap="round"
          className="text-background -translate-y-px"
        />

        <motion.path
          d="M60 50 H220"
          pathLength="1"
          stroke="var(--color-blue-400)"
          strokeLinecap="round"
          strokeDasharray="0.2 2"
          initial={{ strokeDashoffset: 1.2 }}
          animate={{ strokeDashoffset: -1 }}
          transition={requestTransition}
        />
        <motion.path
          d="M60 70 H220"
          pathLength="1"
          stroke="var(--color-emerald-400)"
          strokeLinecap="round"
          strokeDasharray="0.2 2"
          initial={{ strokeDashoffset: -1 }}
          animate={{ strokeDashoffset: 1.2 }}
          transition={responseTransition}
        />

        <defs>
          <linearGradient
            id="flow6-request"
            gradientUnits="userSpaceOnUse"
            x1="60"
            y1="50"
            x2="220"
            y2="50"
          >
            <stop offset="0%" stopColor="currentColor" className="text-blue-950" />
            <stop offset="100%" stopColor="currentColor" className="text-blue-400" />
          </linearGradient>
          <linearGradient
            id="flow6-response"
            gradientUnits="userSpaceOnUse"
            x1="220"
            y1="70"
            x2="60"
            y2="70"
          >
            <stop offset="0%" stopColor="currentColor" className="text-emerald-900" />
            <stop offset="100%" stopColor="currentColor" className="text-emerald-500" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 flex items-center gap-32">
        <div className="bg-illustration ring-border-illustration relative w-28 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5">
          <div className="relative mb-2 flex items-center gap-1">
            <div className="bg-illustration flex size-5 items-center justify-center rounded-full border shadow">
              <Globe className="size-3.5 text-blue-500" />
            </div>
            <div className="text-xs font-semibold">CLIENT</div>
          </div>
          <div className="-translate-x-px space-y-1 pl-2">
            <div className="flex items-center gap-2.5">
              <div className="size-1.5 rounded-full bg-blue-500" />
              <div className="text-foreground/50 text-[10px]">GET /api</div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="size-1.5 rounded-full bg-emerald-500" />
              <div className="text-foreground/50 text-[10px]">200 OK</div>
            </div>
          </div>
        </div>

        <div className="bg-illustration absolute left-1/2 z-10 flex size-10 -translate-x-1/2 rounded-full shadow *:m-auto">
          <ArrowLeftRight className="text-foreground size-4" />
        </div>

        <div className="bg-illustration ring-border-illustration w-28 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5">
          <div className="relative mb-2 flex items-center gap-1">
            <Server className="size-4 text-emerald-500" />

            <div className="text-xs font-semibold">SERVER</div>
          </div>
          <div className="space-y-1">
            <div className="bg-foreground/10 h-1 w-full rounded-full" />
            <div className="bg-foreground/10 h-1 w-3/4 rounded-full" />
            <div className="bg-foreground/10 h-1 w-1/2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flow6Illustration;
