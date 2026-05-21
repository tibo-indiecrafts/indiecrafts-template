import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextRoll } from "./index";

const meta: Meta<typeof TextRoll> = {
  title: "UI Effects/Text/TextRoll",
  component: TextRoll,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TextRoll>;

export const Basic: Story = {
  render: () => (
    <TextRoll className="text-4xl text-black dark:text-white">motion-primitives</TextRoll>
  ),
};

export const CustomVariants: Story = {
  render: () => (
    <TextRoll
      className="text-4xl text-black dark:text-white"
      variants={{
        enter: {
          initial: { rotateX: 0, filter: "blur(0px)" },
          animate: { rotateX: 90, filter: "blur(2px)" },
        },
        exit: {
          initial: { rotateX: 90, filter: "blur(2px)" },
          animate: { rotateX: 0, filter: "blur(0px)" },
        },
      }}
    >
      motion-primitives
    </TextRoll>
  ),
};

export const CustomTransitionDelay: Story = {
  render: () => (
    <TextRoll
      className="overflow-clip text-4xl text-black dark:text-white"
      variants={{
        enter: {
          initial: { y: 0 },
          animate: { y: 40 },
        },
        exit: {
          initial: { y: -40 },
          animate: { y: 0 },
        },
      }}
      duration={0.3}
      getEnterDelay={(i) => i * 0.05}
      getExitDelay={(i) => i * 0.05 + 0.05}
      transition={{ ease: [0.175, 0.885, 0.32, 1.1] }}
    >
      motion-primitives
    </TextRoll>
  ),
};
