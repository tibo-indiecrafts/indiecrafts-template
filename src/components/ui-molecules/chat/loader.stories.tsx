import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Loader } from "./loader";

const meta: Meta<typeof Loader> = {
  title: "UI Molecules/Chat/Loader",
  component: Loader,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Loader>;

export const Default: Story = {};
export const Typing: Story = {
  args: { variant: "typing", size: "sm" },
};
