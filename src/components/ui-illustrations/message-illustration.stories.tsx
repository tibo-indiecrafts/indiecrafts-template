import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageIllustration } from "./message-illustration";

const meta: Meta<typeof MessageIllustration> = {
  title: "UI Illustrations/MessageIllustration",
  component: MessageIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MessageIllustration>;

export const Default: Story = {};
