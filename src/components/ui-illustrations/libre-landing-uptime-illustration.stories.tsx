import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UptimeIllustration } from "./libre-landing-uptime-illustration";

const meta: Meta<typeof UptimeIllustration> = {
  title: "UI Illustrations/Libre Landing Uptime",
  component: UptimeIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof UptimeIllustration>;
export const Default: Story = {};
