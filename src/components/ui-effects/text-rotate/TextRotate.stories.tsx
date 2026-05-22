import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LayoutGroup, motion } from "motion/react";

import { TextRotate } from "./index";

const meta: Meta<typeof TextRotate> = {
  title: "UI Effects/Text/TextRotate",
  component: TextRotate,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TextRotate>;

export const Showcase: Story = {
  render: () => (
    <div className="flex w-full items-center justify-center p-12 text-2xl font-bold sm:text-3xl md:text-5xl lg:text-6xl">
      <LayoutGroup>
        <motion.p className="flex whitespace-pre" layout>
          <motion.span
            className="pt-0.5 sm:pt-1 md:pt-2"
            layout
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            Make it{" "}
          </motion.span>
          <TextRotate
            as="span"
            texts={["work!", "fancy ✽", "right", "fast", "fun", "rock", "🕶️🕶️🕶️"]}
            mainClassName="text-white px-2 sm:px-2 md:px-3 bg-[#ff5941] overflow-hidden py-1 md:py-2 justify-center rounded-lg"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </motion.p>
      </LayoutGroup>
    </div>
  ),
};
