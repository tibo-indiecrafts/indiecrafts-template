import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Meeting4Illustration } from "./grid-2-solution-meeting-4";

const meta: Meta<typeof Meeting4Illustration> = {
  title: "UI Illustrations/Grid 2 Solution Meeting 4",
  component: Meeting4Illustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Meeting4Illustration>;
export const Default: Story = {};
