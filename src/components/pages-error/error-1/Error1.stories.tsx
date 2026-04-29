import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Error1 } from "./Error1";

const meta: Meta<typeof Error1> = {
  title: "Pages/Error/Error1",
  component: Error1,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Error1>;

export const Default: Story = {};

/** Bare layout — useful for embedding inside other shells. */
export const FullBleed: Story = { args: { layout: "full-bleed" } };
