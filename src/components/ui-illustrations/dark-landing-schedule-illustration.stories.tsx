import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScheduleIllustation } from "./dark-landing-schedule-illustration";

const meta: Meta<typeof ScheduleIllustation> = {
  title: "UI Illustrations/Dark Landing Schedule",
  component: ScheduleIllustation,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ScheduleIllustation>;
export const Default: Story = {};
