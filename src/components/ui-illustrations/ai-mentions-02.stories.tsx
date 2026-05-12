import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiMentionsIllustration } from "./ai-mentions-02";

const meta: Meta<typeof AiMentionsIllustration> = {
  title: "UI Illustrations/Grid 2 Product Ai Mentions",
  component: AiMentionsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof AiMentionsIllustration>;
export const Default: Story = {};
