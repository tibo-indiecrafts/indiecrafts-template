import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MeetIllustration } from "./meet-illustration";

const meta: Meta<typeof MeetIllustration> = {
  title: "UI Illustrations/Meet",
  component: MeetIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MeetIllustration>;

export const Default: Story = {};
