import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AIChatInterface } from "./ai-chat-interface";

const meta: Meta<typeof AIChatInterface> = {
  title: "UI Illustrations/Ai Chat Interface",
  component: AIChatInterface,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AIChatInterface>;
export const Default: Story = {};
