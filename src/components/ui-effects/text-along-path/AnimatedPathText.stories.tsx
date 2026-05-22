import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui-primitives/button";

import { AnimatedPathText } from "./index";

const meta: Meta<typeof AnimatedPathText> = {
  title: "UI Effects/Text/AnimatedPathText",
  component: AnimatedPathText,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AnimatedPathText>;

const RECT_PATH =
  "M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20";

function Waitlist() {
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");

  const buttonCopy = {
    idle: "Subscribe",
    loading: (
      <motion.div className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-4 sm:w-4" />
    ),
    success: "Done ✓",
  } as const;

  const handleSubmit = useCallback(() => {
    if (buttonState === "success") return;
    setButtonState("loading");
    setTimeout(() => setButtonState("success"), 1750);
    setTimeout(() => {
      setButtonState("idle");
      setEmail("");
    }, 3500);
  }, [buttonState]);

  return (
    <div className="relative flex h-dvh w-dvw items-center justify-center bg-white text-[#0015ff]">
      <AnimatedPathText
        path={RECT_PATH}
        svgClassName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-2 sm:py-8"
        viewBox="-20 10 240 180"
        text="JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ JOIN THE WAITLIST ✉ "
        textClassName="text-[10.6px] lowercase text-[#0015ff]"
        duration={20}
        preserveAspectRatio="none"
        textAnchor="start"
      />

      <div className="absolute top-1/2 left-1/2 w-56 -translate-x-1/2 -translate-y-1/2 p-6 sm:w-80">
        <div className="space-y-2">
          <input
            type="email"
            aria-label="Email address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[#0015ff] bg-white px-3 py-2 text-xs placeholder:text-[#0015ff] focus:ring-blue-500/50 focus:outline-hidden sm:px-4 sm:py-2 sm:text-base"
          />
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={buttonState === "loading"}
            className="h-9 w-full rounded-lg bg-[#0015ff] px-3 py-2 text-xs text-white transition-colors hover:bg-[#0015ff]/90 sm:h-11 sm:px-8 sm:py-2 sm:text-base"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={buttonState}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
              >
                {buttonCopy[buttonState]}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Waitlist />,
};
