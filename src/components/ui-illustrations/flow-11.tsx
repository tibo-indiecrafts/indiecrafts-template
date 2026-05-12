"use client";

import { Database, RefreshCw } from "lucide-react";

export const Flow11Illustration = () => {
  return (
    <div
      aria-hidden
      className="relative flex min-h-[420px] w-fit min-w-[420px] items-center justify-center"
    >
      <style jsx>{`
        @keyframes sync-left {
          0% {
            stroke-dashoffset: 300;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes sync-right {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 300;
          }
        }
        @keyframes sync {
          0%,
          100% {
            transform: rotate(90deg);
          }
          50% {
            transform: rotate(0deg);
          }
        }
      `}</style>

      <svg
        viewBox="0 0 400 200"
        fill="none"
        className="text-foreground/15 pointer-events-none absolute inset-0 mx-auto h-full w-4/5 -translate-x-6.5"
      >
        <path
          d="M140 90 H200 Q220 90 230 60 L245 35 Q255 15 280 15 H340"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
        />
        <path
          d="M140 100 H340"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
        />
        <path
          d="M140 110 H200 Q220 110 230 140 L245 165 Q255 185 280 185 H340"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
        />

        <path
          d="M140 90 H200 Q220 90 230 60 L245 35 Q255 15 280 15 H340"
          stroke="var(--color-cyan-500)"
          strokeLinecap="round"
          strokeDasharray="5 25"
          strokeDashoffset="300"
          className="animate-[sync-left_2s_ease-in-out_infinite]"
        />
        <path
          d="M140 100 H340"
          stroke=" var(--color-indigo-400)"
          strokeLinecap="round"
          strokeDasharray="5 25"
          strokeDashoffset="300"
          className="animate-[sync-left_2s_ease-in-out_infinite_0.2s]"
        />
        <path
          d="M140 110 H200 Q220 110 230 140 L245 165 Q255 185 280 185 H340"
          stroke="var(--color-emerald-500)"
          strokeLinecap="round"
          strokeDasharray="5 25"
          strokeDashoffset="300"
          className="animate-[sync-left_2s_ease-in-out_infinite_0.4s]"
        />
      </svg>

      <div className="relative z-10 flex items-center gap-16">
        <div className="bg-illustration ring-border-illustration relative w-28 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5">
          <div className="mb-2">
            <div className="text-xs font-semibold">Primary</div>
            <div className="text-foreground/50 text-[10px]">Write</div>
          </div>
          <div className="space-y-1">
            <div className="bg-foreground/10 h-1 w-full rounded-full" />
            <div className="bg-foreground/10 h-1 w-3/4 rounded-full" />
          </div>
        </div>

        <div className="bg-illustration absolute relative inset-0 z-10 m-auto flex size-10 -translate-x-8 rounded-full shadow *:m-auto">
          <RefreshCw className="text-foreground size-4 animate-[sync_2s_ease-in-out_infinite] *:first:opacity-50 *:nth-2:opacity-50" />
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-illustration ring-border-illustration flex items-center gap-2 rounded-xl py-2 pr-3 pl-2 shadow-md ring-1 shadow-black/6.5">
            <div className="after:border-foreground/5 relative flex size-6 items-center justify-center rounded-md bg-cyan-500/10 after:absolute after:inset-0 after:rounded-md after:border">
              <Database className="size-3 text-cyan-500" />
            </div>
            <div className="text-[10px] font-medium">Replica 1</div>
          </div>
          <div className="bg-illustration ring-border-illustration flex items-center gap-2 rounded-xl py-2 pr-3 pl-2 shadow-md ring-1 shadow-black/6.5">
            <div className="after:border-foreground/5 relative flex size-6 items-center justify-center rounded-md bg-violet-500/10 after:absolute after:inset-0 after:rounded-md after:border">
              <Database className="size-3 text-violet-500" />
            </div>
            <div className="text-[10px] font-medium">Replica 2</div>
          </div>
          <div className="bg-illustration ring-border-illustration flex items-center gap-2 rounded-xl py-2 pr-3 pl-2 shadow-md ring-1 shadow-black/6.5">
            <div className="after:border-foreground/5 relative flex size-6 items-center justify-center rounded-md bg-emerald-500/10 after:absolute after:inset-0 after:rounded-md after:border">
              <Database className="size-3 text-emerald-500" />
            </div>
            <div className="text-[10px] font-medium">Replica 3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flow11Illustration;
