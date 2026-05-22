import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { motion } from "motion/react";

import {
  CenterUnderline,
  ComesInGoesOutUnderline,
  GoesOutComesInUnderline,
  UnderlineToBackground,
} from "./index";

const meta: Meta = {
  title: "UI Effects/Text/TextUnderline",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const wordVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const SUBSCRIBE_WORDS = "Weekly goodies delivered straight to your inbox —".split(" ");

export const SubscribeBackground: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center bg-[#f5f5f5]">
      <motion.h2
        className="p-12 text-xl text-[#0015ff] md:p-24"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        {SUBSCRIBE_WORDS.map((word) => (
          <motion.span key={word} variants={wordVariants} className="mr-1 inline-block">
            {word}
          </motion.span>
        ))}{" "}
        <motion.span variants={wordVariants} className="inline-block">
          <UnderlineToBackground targetTextColor="#f0f0f0" className="cursor-pointer">
            subscribe
          </UnderlineToBackground>
        </motion.span>
      </motion.h2>
    </div>
  ),
};

export const Showcase: Story = {
  render: () => (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center bg-white">
      <div className="flex h-full flex-row items-start space-x-8 py-36 text-sm text-[#0015ff] uppercase sm:text-lg md:text-xl lg:text-2xl">
        <div>Contact</div>
        <ul className="flex h-full flex-col space-y-1">
          <li>
            <a href="https://linkedin.com">
              <CenterUnderline>LINKEDIN</CenterUnderline>
            </a>
          </li>
          <li>
            <a href="https://instagram.com">
              <ComesInGoesOutUnderline direction="right">
                INSTAGRAM
              </ComesInGoesOutUnderline>
            </a>
          </li>
          <li>
            <a href="https://x.com">
              <ComesInGoesOutUnderline direction="left">
                X (TWITTER)
              </ComesInGoesOutUnderline>
            </a>
          </li>
          <li className="pt-12">
            <ul className="flex h-full flex-col space-y-1">
              <li>
                <a href="mailto:fancy@fancy.dev">
                  <GoesOutComesInUnderline direction="left">
                    FANCY@FANCY.DEV
                  </GoesOutComesInUnderline>
                </a>
              </li>
              <li>
                <a href="mailto:hello@fancy.dev">
                  <GoesOutComesInUnderline direction="right">
                    HELLO@FANCY.DEV
                  </GoesOutComesInUnderline>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  ),
};
