import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatIllustration } from "./grid-1-landing-chat-illustration";

const meta: Meta<typeof ChatIllustration> = {
  title: "UI Illustrations/Grid 1 Landing Chat",
  component: ChatIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ChatIllustration>;
export const Default: Story = {};
