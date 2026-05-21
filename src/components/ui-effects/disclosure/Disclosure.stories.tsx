import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { motion } from "motion/react";
import * as React from "react";

import { Disclosure, DisclosureContent, DisclosureTrigger } from "./index";

const meta: Meta<typeof Disclosure> = {
  title: "UI Effects/Modals & Overlays/Disclosure",
  component: Disclosure,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Disclosure>;

export const Basic: Story = {
  render: () => (
    <Disclosure className="w-[330px] rounded-md border border-zinc-200 px-3 dark:border-zinc-700">
      <DisclosureTrigger>
        <span className="block w-full py-2 text-sm">Show more</span>
      </DisclosureTrigger>
      <DisclosureContent>
        <div className="overflow-hidden pb-3">
          <div className="pt-1 font-mono text-sm">
            <p>
              This example demonstrates how you can use{" "}
              <strong className="font-bold">Disclosure</strong> component.
            </p>
            <pre className="mt-2 rounded-md bg-zinc-100 p-2 text-xs dark:bg-zinc-950">
              {`function DisclosureBasic() {
  return (
    <Disclosure>
      <DisclosureTrigger>
        <span>Show more</span>
      </DisclosureTrigger>
      <DisclosureContent>
        <div>hey</div>
      </DisclosureContent>
    </Disclosure>
  );
}`}
            </pre>
          </div>
        </div>
      </DisclosureContent>
    </Disclosure>
  ),
};

const MOUNTAIN_IMG =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop";

export const Card: Story = {
  render: () => {
    function Demo() {
      const [isOpen, setIsOpen] = React.useState(false);

      const imageVariants = {
        collapsed: { scale: 1, filter: "blur(0px)" },
        expanded: { scale: 1.1, filter: "blur(3px)" },
      };
      const contentVariants = {
        collapsed: { opacity: 0, y: 0 },
        expanded: { opacity: 1, y: 0 },
      };
      const transition = {
        type: "spring" as const,
        stiffness: 26.7,
        damping: 4.1,
        mass: 0.2,
      };

      return (
        <div className="relative h-[350px] w-[290px] overflow-hidden rounded-xl">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Collapse" : "Expand"}
            className="block h-full w-full"
          >
            <motion.img
              src={MOUNTAIN_IMG}
              alt="Mountain landscape"
              className="pointer-events-none h-full w-full object-cover select-none"
              animate={isOpen ? "expanded" : "collapsed"}
              variants={imageVariants}
              transition={transition}
            />
          </button>
          <Disclosure
            open={isOpen}
            onOpenChange={setIsOpen}
            className="absolute right-0 bottom-0 left-0 rounded-xl bg-zinc-900 px-4 pt-2 dark:bg-zinc-50"
            variants={contentVariants}
            transition={transition}
          >
            <DisclosureTrigger className="pb-2 text-[14px] font-medium text-white dark:text-zinc-900">
              lesothers.studio
            </DisclosureTrigger>
            <DisclosureContent>
              <div className="flex flex-col gap-2 pb-4 text-[13px] text-zinc-300 dark:text-zinc-700">
                <p>How beautiful the mountain is 🗻</p>
                <p className="line-clamp-3">
                  The “This is trail running” campaign highlights the new trail collection
                  from <strong className="font-medium">@salomon</strong>, trying to touch
                  the sensations experienced by runners. With each model, its natural
                  environment. To capture the Pulsar Trail Pro 2, we took athletes
                  trudging through the French Alps at 2,000 m altitude.
                </p>
                <button
                  type="button"
                  className="mt-3 w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-1 text-zinc-50 transition-colors duration-300 hover:bg-zinc-800"
                >
                  Learn More
                </button>
              </div>
            </DisclosureContent>
          </Disclosure>
        </div>
      );
    }
    return <Demo />;
  },
};
