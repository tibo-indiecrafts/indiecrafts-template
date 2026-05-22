import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { motion, stagger, useAnimate } from "motion/react";
import { useEffect } from "react";

import { Floating, FloatingElement } from "./index";

const meta: Meta<typeof Floating> = {
  title: "UI Effects/Hover & Interactions/Floating",
  component: Floating,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Floating>;

// Curated public-domain image set replaces the upstream demo's
// `@/utils/demo-images` import (which isn't in this project).
const IMAGES = [
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=400&auto=format&fit=crop",
];

function Stage() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) });
  }, [animate]);

  return (
    <div
      ref={scope}
      className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-black"
    >
      <motion.div
        className="z-50 flex flex-col items-center space-y-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <p className="z-50 text-5xl text-white italic md:text-7xl">fancy.</p>
        <p className="z-50 w-20 cursor-pointer rounded-full bg-white py-2 text-xs text-black transition-transform hover:scale-110">
          Download
        </p>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={IMAGES[0]}
            alt=""
            className="h-16 w-16 cursor-pointer object-cover transition-transform duration-200 hover:scale-105 md:h-24 md:w-24"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={IMAGES[1]}
            alt=""
            className="h-20 w-20 cursor-pointer object-cover transition-transform duration-200 hover:scale-105 md:h-28 md:w-28"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={IMAGES[2]}
            alt=""
            className="h-40 w-28 cursor-pointer object-cover transition-transform duration-200 hover:scale-105 md:h-52 md:w-40"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[0%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={IMAGES[3]}
            alt=""
            className="h-24 w-24 cursor-pointer object-cover transition-transform duration-200 hover:scale-105 md:h-32 md:w-32"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={IMAGES[4]}
            alt=""
            className="h-28 w-28 cursor-pointer object-cover transition-transform duration-200 hover:scale-105 md:h-36 md:w-36"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[70%] left-[77%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={IMAGES[7]}
            alt=""
            className="h-28 w-28 cursor-pointer object-cover transition-transform duration-200 hover:scale-105 md:h-48 md:w-36"
          />
        </FloatingElement>
        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={IMAGES[5]}
            alt=""
            className="h-full w-40 cursor-pointer object-cover transition-transform duration-200 hover:scale-105 md:w-52"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={IMAGES[6]}
            alt=""
            className="h-24 w-24 cursor-pointer object-cover transition-transform duration-200 hover:scale-105 md:h-32 md:w-32"
          />
        </FloatingElement>
      </Floating>
    </div>
  );
}

export const Showcase: Story = {
  render: () => <Stage />,
};
