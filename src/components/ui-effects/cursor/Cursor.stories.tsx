/* eslint-disable @next/next/no-img-element -- decorative demo imagery; intrinsic sizing not via next/image */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import type { SVGProps } from "react";

import { Cursor } from "./index";

const meta: Meta<typeof Cursor> = {
  title: "UI Effects/Hover & Interactions/Cursor",
  component: Cursor,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Cursor>;

const PARIS_IMG =
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop";
const HERBS_IMG =
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=400&auto=format&fit=crop";
const CHURCH_IMG =
  "https://images.unsplash.com/photo-1473177104440-ffee2f376098?q=80&w=400&auto=format&fit=crop";

export const HoverMorph: Story = {
  render: () => {
    function Demo() {
      const [isHovering, setIsHovering] = React.useState(false);
      const targetRef = React.useRef<HTMLDivElement>(null);

      const handlePositionChange = (x: number, y: number) => {
        if (!targetRef.current) return;
        const rect = targetRef.current.getBoundingClientRect();
        setIsHovering(
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
        );
      };

      return (
        <div className="flex h-[400px] w-[480px] items-center justify-center">
          <Cursor
            attachToParent
            variants={{
              initial: { scale: 0.3, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              exit: { scale: 0.3, opacity: 0 },
            }}
            springConfig={{ bounce: 0.001 }}
            transition={{ ease: "easeInOut", duration: 0.15 }}
            onPositionChange={handlePositionChange}
          >
            <motion.div
              animate={{
                width: isHovering ? 80 : 16,
                height: isHovering ? 32 : 16,
              }}
              className="flex items-center justify-center rounded-3xl bg-gray-500/40 backdrop-blur-md dark:bg-gray-300/40"
            >
              <AnimatePresence>
                {isHovering ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="inline-flex w-full items-center justify-center"
                  >
                    <div className="inline-flex items-center text-sm text-white dark:text-black">
                      More <PlusIcon className="ml-1 h-4 w-4" aria-hidden="true" />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </Cursor>
          <div ref={targetRef}>
            <img
              src={PARIS_IMG}
              alt=""
              className="h-52 w-full max-w-48 rounded-lg border border-zinc-100 object-cover"
            />
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

const MouseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={31}
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <g clipPath="url(#cursor-mouse-clip)">
      <path
        fill="#22c55e"
        fillRule="evenodd"
        stroke="#fff"
        strokeLinecap="square"
        strokeWidth={2}
        d="M21.993 14.425 2.549 2.935l4.444 23.108 4.653-10.002z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="cursor-mouse-clip">
        <path fill="#22c55e" d="M0 0h26v31H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const LabelTag: Story = {
  render: () => (
    <div className="py-12">
      <div className="overflow-hidden rounded-xl bg-white p-2 shadow-md dark:bg-black">
        <Cursor
          attachToParent
          variants={{
            initial: { scale: 0.3, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.3, opacity: 0 },
          }}
          transition={{ ease: "easeInOut", duration: 0.15 }}
          className="top-4 left-12"
        >
          <div>
            <MouseIcon className="h-6 w-6" />
            <div className="mt-1 ml-4 rounded bg-green-500 px-2 py-0.5 text-neutral-50">
              The city below
            </div>
          </div>
        </Cursor>
        <img
          src={HERBS_IMG}
          alt=""
          className="h-40 w-full max-w-32 rounded-lg object-cover"
        />
      </div>
    </div>
  ),
};

export const ImagePreview: Story = {
  render: () => (
    <div>
      <div className="p-4">
        <Cursor
          attachToParent
          variants={{
            initial: { height: 0, opacity: 0, scale: 0.3 },
            animate: { height: "auto", opacity: 1, scale: 1 },
            exit: { height: 0, opacity: 0, scale: 0.3 },
          }}
          transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
          className="overflow-hidden"
          springConfig={{ bounce: 0.01 }}
        >
          <img src={CHURCH_IMG} alt="" className="h-40 w-40 rounded-lg object-cover" />
        </Cursor>
        Christian church, Eastern Europe
      </div>
    </div>
  ),
};
