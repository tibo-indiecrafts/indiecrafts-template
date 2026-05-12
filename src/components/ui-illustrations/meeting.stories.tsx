import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MeetingIllustration } from "./meeting";

const meta: Meta<typeof MeetingIllustration> = {
  title: "UI Illustrations/Meeting",
  component: MeetingIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MeetingIllustration>;
export const Default: Story = {};
