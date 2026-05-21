import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { TextScramble } from "./index";

const meta: Meta<typeof TextScramble> = {
  title: "UI Effects/Text/TextScramble",
  component: TextScramble,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TextScramble>;

export const Basic: Story = {
  render: () => (
    <TextScramble className="font-mono text-sm uppercase">Text Scramble</TextScramble>
  ),
};

export const CustomCharacterSet: Story = {
  render: () => (
    <TextScramble className="font-mono text-sm" duration={1.2} characterSet=". ">
      Generating the interface...
    </TextScramble>
  ),
};

export const HoverTrigger: Story = {
  render: () => {
    function Demo() {
      const [trigger, setTrigger] = React.useState(false);
      return (
        <button
          type="button"
          className="text-zinc-500 transition-colors hover:text-black dark:hover:text-white"
        >
          <TextScramble
            as="span"
            className="text-sm"
            speed={0.01}
            trigger={trigger}
            onHoverStart={() => setTrigger(true)}
            onScrambleComplete={() => setTrigger(false)}
          >
            Tyler, The Creator - I Hope You Find Your Way Home
          </TextScramble>
        </button>
      );
    }
    return <Demo />;
  },
};
