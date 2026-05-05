import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PollIllustration } from "./poll-illustration";

const meta: Meta<typeof PollIllustration> = {
  title: "UI Illustrations/PollIllustration",
  component: PollIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PollIllustration>;

export const Default: Story = {};
