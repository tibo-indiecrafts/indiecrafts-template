import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CollaborationIllustration } from "./collaboration";

const meta: Meta<typeof CollaborationIllustration> = {
  title: "UI Illustrations/Collaboration",
  component: CollaborationIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CollaborationIllustration>;
export const Default: Story = {};
