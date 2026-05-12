import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReplyIllustration } from "./reply-illustration";

const meta: Meta<typeof ReplyIllustration> = {
  title: "UI Illustrations/Reply",
  component: ReplyIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ReplyIllustration>;

export const Default: Story = {};
