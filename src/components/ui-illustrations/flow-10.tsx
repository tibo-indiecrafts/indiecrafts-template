"use client";

import { useState, useEffect } from "react";
import { Webhook, Send } from "lucide-react";
import { motion } from "motion/react";
import { Shopify } from "@/components/ui-primitives/svgs/shopify";
import { PolarDark as Polar } from "@/components/ui-primitives/svgs/polar";
import { ClerkIconDark as Clerk } from "@/components/ui-primitives/svgs/clerk";

const PATH_DURATION = 1.2;
const DELIVERY_DURATION = 1;
const CYCLE_TIME = PATH_DURATION + DELIVERY_DURATION;

export const Flow10Illustration = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null as number | null);

  useEffect(() => {
    if (!isHovered) {
      queueMicrotask(() => setActiveProvider(null));
      return;
    }

    const intervals: (NodeJS.Timeout | number)[] = [];

    queueMicrotask(() => setActiveProvider(0));

    intervals.push(setTimeout(() => setActiveProvider(1), CYCLE_TIME * 1000));
    intervals.push(setTimeout(() => setActiveProvider(2), CYCLE_TIME * 2 * 1000));

    const loopInterval = setInterval(
      () => {
        setActiveProvider(0);
        setTimeout(() => setActiveProvider(1), CYCLE_TIME * 1000);
        setTimeout(() => setActiveProvider(2), CYCLE_TIME * 2 * 1000);
      },
      CYCLE_TIME * 3 * 1000,
    );

    intervals.push(loopInterval);

    return () => intervals.forEach((id) => clearTimeout(id as NodeJS.Timeout));
  }, [isHovered]);

  return (
    <motion.div
      aria-hidden
      className="relative flex min-h-[420px] w-fit min-w-[420px] items-center justify-center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 400 240"
        fill="none"
        className="text-foreground/15 pointer-events-none absolute inset-0 mx-auto h-full w-4/5"
      >
        {/* Input lines from triggers - converging pattern */}
        <path
          d="M60 30 Q80 30 90 50 L110 100 Q120 120 140 120"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
          strokeDasharray="1 5"
        />
        <path
          d="M60 120 H140"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
          strokeDasharray="1 5"
        />
        <path
          d="M60 210 Q80 210 90 190 L110 140 Q120 120 140 120"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
          strokeDasharray="1 5"
        />

        {/* Output line to endpoint */}
        <path
          d="M220 120 H340"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
        />

        <motion.path
          d="M60 30 Q80 30 90 50 L110 100 Q120 120 140 120"
          pathLength="1"
          stroke="var(--color-green-500)"
          strokeLinecap="round"
          strokeDasharray="0.3 2"
          initial={{ strokeDashoffset: 1.3 }}
          animate={
            activeProvider === 0 ? { strokeDashoffset: -1 } : { strokeDashoffset: 1.3 }
          }
          transition={
            activeProvider === 0
              ? { duration: PATH_DURATION, ease: "easeInOut" }
              : { duration: 0 }
          }
        />
        <motion.path
          d="M60 120 H140"
          pathLength="1"
          stroke="var(--color-muted-foreground)"
          strokeLinecap="round"
          strokeDasharray="0.3 2"
          initial={{ strokeDashoffset: 1.3 }}
          animate={
            activeProvider === 1 ? { strokeDashoffset: -1 } : { strokeDashoffset: 1.3 }
          }
          transition={
            activeProvider === 1
              ? { duration: PATH_DURATION, ease: "easeInOut" }
              : { duration: 0 }
          }
        />
        <motion.path
          d="M60 210 Q80 210 90 190 L110 140 Q120 120 140 120"
          pathLength="1"
          stroke="var(--color-foreground)"
          strokeLinecap="round"
          strokeDasharray="0.3 2"
          initial={{ strokeDashoffset: 1.3 }}
          animate={
            activeProvider === 2 ? { strokeDashoffset: -1 } : { strokeDashoffset: 1.3 }
          }
          transition={
            activeProvider === 2
              ? { duration: PATH_DURATION, ease: "easeInOut" }
              : { duration: 0 }
          }
        />

        <motion.path
          key={activeProvider}
          d="M220 120 H340"
          pathLength="1"
          stroke="var(--color-primary)"
          strokeLinecap="round"
          strokeDasharray="0.3 2"
          initial={{ strokeDashoffset: 1.3 }}
          animate={
            activeProvider !== null ? { strokeDashoffset: -1 } : { strokeDashoffset: 1.3 }
          }
          transition={
            activeProvider !== null
              ? {
                  duration: DELIVERY_DURATION,
                  delay: PATH_DURATION - 0.25,
                  ease: "easeOut",
                }
              : { duration: 0 }
          }
        />
      </svg>

      <div className="relative z-10 flex items-center gap-25">
        <div className="flex flex-col items-end gap-18 *:w-fit">
          <motion.div
            className="bg-illustration ring-border-illustration flex items-center gap-2 rounded-full py-2 pr-4 pl-3 shadow-md ring-1 shadow-black/6.5"
            animate={{ opacity: activeProvider === 0 ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Shopify className="size-4" />
            <span className="text-sm font-medium">New Order</span>
          </motion.div>
          <motion.div
            className="bg-illustration ring-border-illustration flex items-center gap-2 rounded-full py-2 pr-4 pl-3 shadow-md ring-1 shadow-black/6.5"
            animate={{ opacity: activeProvider === 1 ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Clerk className="*:fill-foreground size-4" />
            <span className="text-sm font-medium">User Signup</span>
          </motion.div>
          <motion.div
            className="bg-illustration ring-border-illustration flex items-center gap-2 rounded-full py-2 pr-4 pl-3 shadow-md ring-1 shadow-black/6.5"
            animate={{ opacity: activeProvider === 2 ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Polar className="*:fill-foreground! size-4" />
            <span className="text-sm font-medium">Payment</span>
          </motion.div>
        </div>

        <div
          data-theme="dark"
          className="bg-background/75 dark:bg-foreground/10 flex items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 shadow-lg ring-1 shadow-black/15 ring-black backdrop-blur"
        >
          <Webhook className="size-4 fill-violet-500/10 text-violet-500" />
          <span className="text-xs font-semibold">
            POST <span className="font-mono opacity-65">{"/webhook"}</span>
          </span>
        </div>

        <div className="bg-illustration ring-border-illustration flex items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 shadow-md ring-1 shadow-black/6.5">
          <Send className="size-4 fill-amber-500/10 text-amber-500" />
          <span className="text-xs font-semibold">External Endpoint</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Flow10Illustration;
