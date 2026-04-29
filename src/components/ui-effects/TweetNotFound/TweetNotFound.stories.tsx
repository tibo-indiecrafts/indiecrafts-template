import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TweetNotFound } from "./index";

const meta: Meta<typeof TweetNotFound> = {
  title: "UI Effects/TweetNotFound",
  component: TweetNotFound,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TweetNotFound>;

export const Default: Story = {};
