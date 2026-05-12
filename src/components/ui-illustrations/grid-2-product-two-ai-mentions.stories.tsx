import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiMentionsIllustration } from "./grid-2-product-two-ai-mentions";

const meta: Meta<typeof AiMentionsIllustration> = {
  title: "UI Illustrations/Grid 2 Product Two Ai Mentions",
  component: AiMentionsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiMentionsIllustration>;
export const Default: Story = {};
