import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MessageChatIllustration } from "./message-chat-illustration";

const meta: Meta<typeof MessageChatIllustration> = {
  title: "UI Illustrations/MessageChat",
  component: MessageChatIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MessageChatIllustration>;

export const Default: Story = {};
