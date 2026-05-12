import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CollaborationCommentIllustration } from "./collaboration-comment-illustration";

const meta: Meta<typeof CollaborationCommentIllustration> = {
  title: "UI Illustrations/CollaborationComment",
  component: CollaborationCommentIllustration,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="relative h-96 w-[28rem]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CollaborationCommentIllustration>;

export const Default: Story = {};
