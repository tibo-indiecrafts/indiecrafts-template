import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScheduleIllustration } from "./schedule-illustration";

const meta: Meta<typeof ScheduleIllustration> = {
  title: "UI Illustrations/ScheduleIllustration",
  component: ScheduleIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ScheduleIllustration>;

export const Default: Story = {};
