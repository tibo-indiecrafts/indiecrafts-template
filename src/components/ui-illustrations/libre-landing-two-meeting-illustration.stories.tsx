import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MeetingIllustration } from "./libre-landing-two-meeting-illustration";

const meta: Meta<typeof MeetingIllustration> = {
  title: "UI Illustrations/Libre Landing Two Meeting",
  component: MeetingIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MeetingIllustration>;
export const Default: Story = {};
