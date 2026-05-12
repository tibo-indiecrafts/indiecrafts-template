import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RideSharingIllustration } from "./ride-sharing";

const meta: Meta<typeof RideSharingIllustration> = {
  title: "UI Illustrations/Ride Sharing",
  component: RideSharingIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof RideSharingIllustration>;
export const Default: Story = {};
