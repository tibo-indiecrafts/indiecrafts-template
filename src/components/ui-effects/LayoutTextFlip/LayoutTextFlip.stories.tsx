import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LayoutTextFlip } from "./index";

const meta: Meta<typeof LayoutTextFlip> = {
  title: "UI Effects/LayoutTextFlip",
  component: LayoutTextFlip,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LayoutTextFlip>;

/** Default — 3-second rotation between words. */
export const Default: Story = {};

/** Fast — 1-second rotation, useful for tight hero sections. */
export const Fast: Story = {
  args: { duration: 1000 },
};

/** Slow — 8-second rotation; eases reading and reduces motion intensity. */
export const Slow: Story = {
  args: { duration: 8000 },
};
