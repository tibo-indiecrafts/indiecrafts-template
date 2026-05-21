import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Minus, Plus } from "lucide-react";
import { useInView } from "motion/react";
import * as React from "react";

import { AnimatedNumber } from "./index";

const meta: Meta<typeof AnimatedNumber> = {
  title: "UI Effects/Text/AnimatedNumber",
  component: AnimatedNumber,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AnimatedNumber>;

export const Basic: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState(0);
      React.useEffect(() => {
        setValue(2082);
      }, []);
      return (
        <div className="flex w-full items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden="true"
            className="mr-3 h-3 w-3 fill-transparent stroke-zinc-800 stroke-[1.3] dark:stroke-zinc-50"
          >
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
          </svg>
          <AnimatedNumber
            className="inline-flex items-center font-mono text-2xl font-light text-zinc-800 dark:text-zinc-50"
            springOptions={{ bounce: 0, duration: 2000 }}
            value={value}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const Counter: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState(1000);
      return (
        <div className="flex w-full items-center justify-center space-x-2 text-zinc-800 dark:text-zinc-50">
          <button
            type="button"
            aria-label="Decrement"
            onClick={() => setValue((prev) => prev - 100)}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <AnimatedNumber
            className="inline-flex items-center font-mono text-2xl font-light"
            springOptions={{ bounce: 0, duration: 1000 }}
            value={value}
          />
          <button
            type="button"
            aria-label="Increment"
            onClick={() => setValue((prev) => prev + 100)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      );
    }
    return <Demo />;
  },
};

export const InView: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState(0);
      const ref = React.useRef<HTMLDivElement>(null);
      const isInView = useInView(ref);
      React.useEffect(() => {
        if (isInView && value === 0) setValue(10000);
      }, [isInView, value]);
      return (
        <div className="flex w-full items-center justify-center" ref={ref}>
          <AnimatedNumber
            className="inline-flex items-center font-mono text-2xl font-light text-zinc-800 dark:text-zinc-50"
            springOptions={{ bounce: 0, duration: 10000 }}
            value={value}
          />
        </div>
      );
    }
    return <Demo />;
  },
};
