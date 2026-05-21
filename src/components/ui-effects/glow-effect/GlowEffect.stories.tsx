import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import { GlowEffect } from "./index";

const meta: Meta<typeof GlowEffect> = {
  title: "UI Effects/Cards/GlowEffect",
  component: GlowEffect,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof GlowEffect>;

export const CardBackground: Story = {
  render: () => (
    <div className="relative h-44 w-64">
      <GlowEffect
        colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
        mode="static"
        blur="medium"
      />
      <div className="relative h-44 w-64 rounded-lg bg-black p-2 text-white dark:bg-white dark:text-black">
        <svg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 70 70"
          aria-label="MP Logo"
          width="70"
          height="70"
          className="absolute right-4 bottom-4 h-8 w-8"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
            d="M51.883 26.495c-7.277-4.124-18.08-7.004-26.519-7.425-2.357-.118-4.407-.244-6.364 1.06M59.642 51c-10.47-7.25-26.594-13.426-39.514-15.664-3.61-.625-6.744-1.202-9.991.263"
          />
        </svg>
      </div>
    </div>
  ),
};

export const Button: Story = {
  render: () => (
    <div className="relative">
      <GlowEffect
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        mode="colorShift"
        blur="soft"
        duration={3}
        scale={0.9}
      />
      <button
        type="button"
        className="relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-50 outline outline-1 outline-[#fff2f21f]"
      >
        Explore <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  ),
};

export const ToggleableCard: Story = {
  render: () => {
    function Demo() {
      const [isVisible, setIsVisible] = React.useState(false);
      return (
        <div className="relative h-[200px] w-[300px]">
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <GlowEffect
              colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
              mode="colorShift"
              blur="medium"
              duration={4}
            />
          </motion.div>
          <div className="relative flex h-full flex-col items-end justify-end rounded-md border border-zinc-300/40 bg-zinc-100 px-4 py-3 dark:border-zinc-700/40 dark:bg-zinc-900">
            <button
              type="button"
              aria-label="Load"
              onClick={() => setIsVisible((v) => !v)}
              className="relative ml-1 flex h-8 scale-100 items-center justify-center overflow-hidden rounded-lg border border-zinc-950/10 bg-white px-2 text-sm text-zinc-950 select-none focus-visible:ring-2 active:scale-[0.96] dark:border-zinc-50/10"
            >
              <span>{isVisible ? "Submitting..." : "Submit"}</span>
            </button>
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
