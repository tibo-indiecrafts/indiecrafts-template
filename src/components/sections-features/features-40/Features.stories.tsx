import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Features from "./Features";

const meta: Meta<typeof Features> = {
  title: "Sections/Features/Features40",
  component: Features,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Features>;

export const Default: Story = {
  args: { id: "features-40-storybook" },
};
