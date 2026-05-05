import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextScramble } from "./text-scramble";

const meta: Meta<typeof TextScramble> = {
  title: "UI Effects/Text/TextScramble",
  component: TextScramble,
  parameters: { layout: "centered" },
  args: {
    children: "Anna Johnson",
    className: "font-mono text-2xl uppercase",
  },
};
export default meta;

type Story = StoryObj<typeof TextScramble>;

export const Default: Story = {};
