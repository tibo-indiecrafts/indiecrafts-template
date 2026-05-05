import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PhoneScreenshot } from "./phone-screenshot";

const meta: Meta<typeof PhoneScreenshot> = {
  title: "UI Illustrations/PhoneScreenshot",
  component: PhoneScreenshot,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PhoneScreenshot>;

export const Default: Story = {};
