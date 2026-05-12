"use client";

import { useState } from "react";
import { CreditCard, Receipt, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const pathTransition = {
  duration: 0.65,
  ease: "easeOut" as const,
};

export const Flow4Illustration = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      aria-hidden
      className="relative flex min-h-[420px] w-fit min-w-[420px] flex-col items-center justify-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 240 280"
        fill="none"
        className="text-foreground/15 pointer-events-none absolute inset-0 mx-auto h-full w-3/5 -translate-y-3.5"
      >
        <motion.path
          d="M120 40 V100"
          stroke="currentColor"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: isHovered ? 0.3 : 0 }}
        />
        <motion.path
          d="M120 140 V200"
          stroke="currentColor"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: isHovered ? 0.9 : 0 }}
        />

        {isHovered && (
          <>
            <motion.path
              key="beam-1"
              d="M120 40 V100"
              stroke="url(#flow4-gradient)"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="0.3 2"
              initial={{ strokeDashoffset: 1.3, opacity: 0 }}
              animate={{ strokeDashoffset: -2, opacity: 1 }}
              transition={{
                ...pathTransition,
                delay: 0.2,
                opacity: { duration: 0.2, delay: 0.2 },
              }}
            />
            <motion.path
              key="beam-2"
              d="M120 140 V200"
              stroke="url(#flow4-gradient)"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="0.3 2"
              initial={{ strokeDashoffset: 1.3, opacity: 0 }}
              animate={{ strokeDashoffset: -2, opacity: 1 }}
              transition={{
                ...pathTransition,
                delay: 1.2,
                opacity: { duration: 0.2, delay: 1.2 },
              }}
            />
          </>
        )}

        <defs>
          <linearGradient
            id="flow4-gradient"
            gradientUnits="userSpaceOnUse"
            x1="120"
            y1="0"
            x2="120"
            y2="280"
          >
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--color-amber-400)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        className="bg-illustration ring-border-illustration relative z-10 w-36 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5"
        initial={{ scale: 1 }}
        animate={isHovered ? { scale: 1 } : { scale: 1 }}
      >
        <div className="mb-2 flex items-center gap-2">
          <CreditCard className="size-4 text-amber-500" />
          <span className="text-[10px] font-semibold">PAYMENT</span>
        </div>
        <div className="space-y-1.5">
          <div className="bg-foreground/10 h-1.5 w-full rounded-full" />
          <div className="flex gap-2">
            <div className="bg-foreground/10 h-1.5 flex-1 rounded-full" />
            <div className="bg-foreground/10 h-1.5 w-8 rounded-full" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-illustration ring-border-illustration relative z-10 my-14 flex gap-3 overflow-hidden rounded-xl p-3 pr-6 shadow-md ring-1 shadow-black/6.5"
        initial={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(4px)" }}
        animate={
          isHovered
            ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, scale: 0.98, y: 8, filter: "blur(4px)" }
        }
        transition={{ duration: 0.2, delay: isHovered ? 0.6 : 0, ease: "easeOut" }}
      >
        <div className="border-foreground absolute inset-1 w-1/2 rounded-l-lg border [background-image:linear-gradient(-45deg,var(--color-emerald-500)_25%,transparent_25%,transparent_50%,var(--color-emerald-500)_50%,var(--color-emerald-500)_75%,transparent_75%,transparent)] mask-r-from-25% [background-size:5px_5px] opacity-10" />
        <CheckCircle2
          strokeWidth={1.5}
          className="fill-illustration size-6 -translate-y-0.5 text-emerald-600 drop-shadow *:first:stroke-transparent dark:text-emerald-400"
        />

        <div className="space-y-0.5">
          <div className="text-sm font-semibold">Verified</div>
          <div className="text-foreground/50 text-xs">Payment processed</div>
        </div>
      </motion.div>

      <motion.div
        className="bg-illustration ring-border-illustration relative z-10 w-26 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5"
        initial={{ opacity: 0, scale: 0.98, y: 8, filter: "blur(4px)" }}
        animate={
          isHovered
            ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, scale: 0.98, y: 8, filter: "blur(4px)" }
        }
        transition={{ duration: 0.2, delay: isHovered ? 1.6 : 0, ease: "easeOut" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Receipt className="size-4 text-violet-500" />
          <span className="text-[10px] font-semibold">RECEIPT</span>
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="bg-foreground/10 h-1 w-12 rounded-full" />
              <div className="bg-foreground/10 h-1 w-6 rounded-full" />
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

          <div className="border-foreground/10 mt-2 border-t pt-2">
            <div className="flex justify-between">
              <div className="bg-foreground/20 h-1.5 w-8 rounded-full" />
              <div className="h-1.5 w-10 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Flow4Illustration;
