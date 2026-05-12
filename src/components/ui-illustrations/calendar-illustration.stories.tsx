import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarIllustration } from "./calendar-illustration";

const meta: Meta<typeof CalendarIllustration> = {
  title: "UI Illustrations/Calendar",
  component: CalendarIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CalendarIllustration>;

export const Default: Story = {};
