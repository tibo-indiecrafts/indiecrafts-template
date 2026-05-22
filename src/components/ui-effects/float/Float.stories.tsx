import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { motion } from "motion/react";

import { Float } from "./index";

const meta: Meta<typeof Float> = {
  title: "UI Effects/Hover & Interactions/Float",
  component: Float,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Float>;

const ALBUM_COVER =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop";

export const Showcase: Story = {
  render: () => (
    <div className="text-foreground dark:text-muted flex h-dvh w-dvw flex-col items-center justify-center bg-white">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.5, ease: "easeOut" }}
        >
          <Float>
            <div className="relative h-32 w-32 cursor-pointer overflow-hidden shadow-2xl transition-transform duration-200 hover:scale-105 sm:h-40 sm:w-40 md:h-48 md:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element -- external Unsplash URL */}
              <img
                src={ALBUM_COVER}
                alt="Album cover"
                className="absolute top-0 left-0 h-full w-full object-cover"
              />
            </div>
          </Float>
        </motion.div>
        <motion.h2
          className="z-10 pt-8 text-xl uppercase sm:pt-12 sm:text-3xl md:pt-16 md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.7, ease: "easeOut" }}
        >
          Album of the week
        </motion.h2>
      </div>
    </div>
  ),
};
