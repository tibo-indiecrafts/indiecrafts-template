import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CollaborationTextIllustration } from "./collaboration-text-illustration";

const meta: Meta<typeof CollaborationTextIllustration> = {
  title: "UI Illustrations/CollaborationText",
  component: CollaborationTextIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CollaborationTextIllustration>;

export const Default: Story = {};
