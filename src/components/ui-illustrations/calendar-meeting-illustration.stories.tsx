import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarMeetingIllustration } from "./calendar-meeting-illustration";

const meta: Meta<typeof CalendarMeetingIllustration> = {
  title: "UI Illustrations/CalendarMeetingIllustration",
  component: CalendarMeetingIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CalendarMeetingIllustration>;

export const Default: Story = {};
