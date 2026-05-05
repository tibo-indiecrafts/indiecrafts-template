import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UptimeIllustration } from "./uptime-illustration";

const meta: Meta<typeof UptimeIllustration> = {
  title: "UI Illustrations/UptimeIllustration",
  component: UptimeIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof UptimeIllustration>;

export const Default: Story = {};
