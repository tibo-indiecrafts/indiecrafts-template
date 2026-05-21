import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Spotlight } from "./index";

const meta: Meta<typeof Spotlight> = {
  title: "UI Effects/Hover & Interactions/Spotlight",
  component: Spotlight,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Spotlight>;

export const Basic: Story = {
  render: () => (
    <div className="relative aspect-video h-[200px] rounded-sm border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black">
      <Spotlight
        className="bg-zinc-700 blur-2xl"
        size={64}
        springOptions={{ bounce: 0.3, duration: 0.1 }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white p-2 dark:bg-black">
        <svg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 70 70"
          aria-label="MP Logo"
          width="70"
          height="70"
          className="h-8 w-auto stroke-black dark:stroke-white"
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

export const CustomColor: Story = {
  render: () => (
    <div className="relative aspect-video h-[200px] rounded-sm border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-black">
      <Spotlight
        className="blur-xl [--spot-from:var(--color-blue-800)] [--spot-to:var(--color-blue-400)] [--spot-via:var(--color-blue-600)] dark:[--spot-from:var(--color-blue-900)] dark:[--spot-to:var(--color-blue-900)] dark:[--spot-via:var(--color-blue-500)]"
        size={64}
      />
      <div className="absolute inset-0">
        <svg className="h-full w-full" aria-hidden="true">
          <defs>
            <pattern
              id="spotlight-grid-pattern"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 4H4M4 4V0M4 4H8M4 4V8"
                stroke="currentColor"
                strokeOpacity="0.3"
                className="stroke-zinc-300 dark:stroke-zinc-700"
              />
              <rect
                x="3"
                y="3"
                width="2"
                height="2"
                fill="currentColor"
                fillOpacity="0.25"
                className="fill-zinc-300 dark:fill-zinc-700"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spotlight-grid-pattern)" />
        </svg>
      </div>
    </div>
  ),
};

export const Border: Story = {
  render: () => (
    <div className="relative aspect-video h-[200px] overflow-hidden rounded-xl bg-zinc-300/30 p-px dark:bg-zinc-700/30">
      <Spotlight
        className="blur-3xl [--spot-from:var(--color-blue-600)] [--spot-to:var(--color-blue-400)] [--spot-via:var(--color-blue-500)] dark:[--spot-from:var(--color-blue-200)] dark:[--spot-to:var(--color-blue-400)] dark:[--spot-via:var(--color-blue-300)]"
        size={124}
      />
      <div className="relative h-full w-full rounded-xl bg-white dark:bg-black" />
    </div>
  ),
};
