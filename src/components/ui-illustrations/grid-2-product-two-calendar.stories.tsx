import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarIllustration } from "./grid-2-product-two-calendar";

const meta: Meta<typeof CalendarIllustration> = {
  title: "UI Illustrations/Grid 2 Product Two Calendar",
  component: CalendarIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof CalendarIllustration>;
export const Default: Story = {};
