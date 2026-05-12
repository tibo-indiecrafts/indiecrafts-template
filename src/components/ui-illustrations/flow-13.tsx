"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Eye, ShoppingBag, ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { LogoIcon } from "@/components/logo";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { Openai } from "@/components/ui-primitives/svgs/openai";
import { Deepseek } from "@/components/ui-primitives/svgs/deepseek";
import { TextShimmer } from "@/components/ui-primitives/text-shimmer";
import { ResponseStream } from "@/components/ui-primitives/response-stream";

const CYCLE_DURATION = 7000;

const events = [
  { id: 0, icon: Eye, label: "First Visit", color: "blue" },
  { id: 1, icon: ShoppingBag, label: "Order Placed", color: "emerald" },
  { id: 2, icon: ShoppingCart, label: "Cart Abandoned", color: "amber" },
];

const responses = [
  {
    id: 0,
    text: "Welcome! Take a moment to explore our amazing features and discover what we have to offer",
    color: "blue",
  },
  {
    id: 1,
    text: "Thank you for your order! Your purchase has been confirmed and is being processed",
    color: "emerald",
  },
  {
    id: 2,
    text: "You left items in your cart! Complete your purchase today and enjoy free shipping",
    color: "amber",
  },
];

const pathTransition = {
  duration: 1,
  ease: "easeInOut" as const,
};

export const Flow13Illustration = () => {
  const [activeEvent, setActiveEvent] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showShimmer, setShowShimmer] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const spanRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEvent((prev) => (prev + 1) % events.length);
    }, CYCLE_DURATION);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (spanRef.current) {
        const width = (spanRef.current as HTMLElement).offsetWidth;
        setContainerWidth(width + 32);
      }
    };

    updateWidth();
    const timer = setTimeout(updateWidth, 50);

    return () => clearTimeout(timer);
  }, [activeEvent]);

  useEffect(() => {
    queueMicrotask(() => {
      setShowShimmer(false);
      setShowResponse(false);
    });
    const showShimmerTimer = setTimeout(() => setShowShimmer(true), 2000);
    const hideShimmerTimer = setTimeout(() => {
      setShowShimmer(false);
      setShowResponse(true);
    }, 4500);

    return () => {
      clearTimeout(showShimmerTimer);
      clearTimeout(hideShimmerTimer);
    };
  }, [activeEvent]);

  const currentEvent = useMemo(() => events[activeEvent], [activeEvent]);
  const currentResponse = useMemo(() => responses[activeEvent], [activeEvent]);

  return (
    <div
      aria-hidden
      className="relative flex size-fit min-h-[420px] min-w-[420px] items-center justify-center"
    >
      <div className="relative z-10 flex flex-col items-center">
        <svg
          viewBox="0 0 131 245"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground/10 absolute inset-x-0 top-8 mx-auto w-2/3"
        >
          <path d="M65.5 0V49" stroke="currentColor" />
          <path d="M65.5 106V155" stroke="currentColor" strokeLinecap="round" />
          <path
            d="M0.5 155.5C0.5 143.074 10.5736 133 23 133H26.119C38.5003 133 54.5209 132.623 59.5305 121.301C61.9802 115.764 63.8576 109.843 64 106"
            stroke="currentColor"
            strokeLinecap="round"
          />
          <path
            d="M130.5 155.5C130.5 143.074 120.426 133 108 133H104.881C92.4997 133 76.4791 132.623 71.4695 121.301C69.0198 115.764 67.1424 109.843 67 106"
            stroke="currentColor"
            strokeLinecap="round"
          />
          <path d="M65.5 244L65.5 195" stroke="currentColor" strokeLinecap="round" />
          <path d="M130.5 195V244" stroke="currentColor" strokeLinecap="round" />
          <path d="M0.5 195V244" stroke="currentColor" strokeLinecap="round" />

          <motion.path
            key={`event-acme-${activeEvent}`}
            d="M65.5 0V49"
            pathLength="1"
            stroke={`var(--color-${currentEvent.color}-400)`}
            strokeLinecap="round"
            strokeDasharray="0.3 2"
            initial={{ strokeDashoffset: 1.3 }}
            animate={{ strokeDashoffset: -2 }}
            transition={pathTransition}
          />

          <motion.path
            key={`acme-llm-center-${activeEvent}`}
            d="M65.5 106V155"
            pathLength="1"
            stroke="var(--color-indigo-400)"
            strokeLinecap="round"
            strokeDasharray="0.3 2"
            initial={{ strokeDashoffset: 1.3 }}
            animate={{ strokeDashoffset: -2 }}
            transition={{ ...pathTransition, delay: 0.5 }}
          />

          <motion.path
            key={`acme-llm-left-${activeEvent}`}
            d="M64 106C63.8576 109.843 61.9802 115.764 59.5305 121.301C54.5209 132.623 38.5003 133 26.119 133H23C10.5736 133 0.5 143.074 0.5 155.5"
            pathLength="1"
            stroke="var(--color-purple-400)"
            strokeLinecap="round"
            strokeDasharray="0.3 2"
            initial={{ strokeDashoffset: 1.3 }}
            animate={{ strokeDashoffset: -2 }}
            transition={{ ...pathTransition, delay: 0.6 }}
          />

          <motion.path
            key={`acme-llm-right-${activeEvent}`}
            d="M67 106C67.1424 109.843 69.0198 115.764 71.4695 121.301C76.4791 132.623 92.4997 133 104.881 133H108C120.426 133 130.5 143.074 130.5 155.5"
            pathLength="1"
            stroke="var(--color-cyan-400)"
            strokeLinecap="round"
            strokeDasharray="0.3 2"
            initial={{ strokeDashoffset: 1.3 }}
            animate={{ strokeDashoffset: -2 }}
            transition={{ ...pathTransition, delay: 0.7 }}
          />

          <motion.path
            key={`llm-response-center-${activeEvent}`}
            d="M65.5 195V244"
            pathLength="1"
            stroke={`var(--color-${currentResponse.color}-400)`}
            strokeLinecap="round"
            strokeDasharray="0.3 2"
            initial={{ strokeDashoffset: 1.3 }}
            animate={{ strokeDashoffset: -2 }}
            transition={{ ...pathTransition, delay: 1.5 }}
          />

          <motion.path
            key={`llm-response-right-${activeEvent}`}
            d="M130.5 195V244"
            pathLength="1"
            stroke={`var(--color-${currentResponse.color}-400)`}
            strokeLinecap="round"
            strokeDasharray="0.3 2"
            initial={{ strokeDashoffset: 1.3 }}
            animate={{ strokeDashoffset: -2 }}
            transition={{ ...pathTransition, delay: 1.6 }}
          />

          <motion.path
            key={`llm-response-left-${activeEvent}`}
            d="M0.5 195V244"
            pathLength="1"
            stroke={`var(--color-${currentResponse.color}-400)`}
            strokeLinecap="round"
            strokeDasharray="0.3 2"
            initial={{ strokeDashoffset: 1.3 }}
            animate={{ strokeDashoffset: -2 }}
            transition={{ ...pathTransition, delay: 1.7 }}
          />
        </svg>
        <motion.div
          className="bg-card ring-border-illustration h-8 overflow-hidden rounded-full px-4 ring-1"
          animate={{ width: containerWidth > 0 ? containerWidth : "auto" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeEvent}
              initial={{ opacity: 0, filter: "blur(4px)", x: -32 }}
              exit={{ opacity: 0, filter: "blur(4px)", x: 32 }}
              animate={{ opacity: 1, filter: "blur(0)", x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-8 items-center"
            >
              <span ref={spanRef} className="text-sm font-medium text-nowrap">
                {currentEvent.label}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="relative mt-14 mb-13.5 flex size-17 -translate-y-px">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-foreground/25 absolute inset-px animate-pulse"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="50"
              strokeDasharray="2 5"
              strokeLinejoin="round"
              strokeWidth={2}
              stroke="currentColor"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -100 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <div className="absolute inset-3 opacity-50">
            <div className="absolute inset-0 animate-pulse rounded-xl bg-linear-to-r from-purple-400 to-blue-500 blur-md" />
          </div>
          <div className="to-card/50 from-card ring-border-illustration relative m-auto flex size-11 items-center justify-center rounded-full bg-radial from-35% shadow-xl ring-1 shadow-black/6.5 backdrop-blur">
            <LogoIcon className="drop-shadow-background size-4 drop-shadow" uniColor />
          </div>
        </div>

        <div className="relative mb-14 flex items-center gap-8">
          <div className="bg-illustration ring-border-illustration flex size-11 rounded-full shadow-md ring-1 shadow-black/6.5 *:m-auto">
            <Gemini className="size-5" />
          </div>
          <div className="bg-illustration ring-border-illustration flex size-11 rounded-full shadow-md ring-1 shadow-black/6.5 *:m-auto">
            <Openai className="fill-foreground size-5" />
          </div>
          <div className="bg-illustration ring-border-illustration flex size-11 rounded-full shadow-md ring-1 shadow-black/6.5 *:m-auto">
            <Deepseek className="size-5" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-400 to-blue-500 opacity-25 mix-blend-lighten blur-md dark:mix-blend-overlay" />

          <div className="bg-illustration ring-border-illustration text-foreground/65 h-26 w-56 overflow-hidden rounded-2xl px-5 py-3 text-sm shadow-md ring-1 shadow-black/6.5">
            {showShimmer && <TextShimmer>Generating...</TextShimmer>}
            {showResponse && (
              <ResponseStream
                key={activeEvent}
                textStream={currentResponse.text}
                mode="typewriter"
                speed={25}
                segmentDelay={2}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flow13Illustration;
