import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarIllustration } from "./calendar";

const meta: Meta<typeof CalendarIllustration> = {
  title: "UI Illustrations/Grid 2 Product Calendar",
  component: CalendarIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CalendarIllustration>;
export const Default: Story = {};
