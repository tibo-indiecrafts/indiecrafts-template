import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CollbarationCommentIllustration } from "./grid-2-solution-collaboration-comment";

const meta: Meta<typeof CollbarationCommentIllustration> = {
  title: "UI Illustrations/Grid 2 Solution Collaboration Comment",
  component: CollbarationCommentIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CollbarationCommentIllustration>;
export const Default: Story = {};
