import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapPinsIllustration } from "./map-pins-illustration";

const meta: Meta<typeof MapPinsIllustration> = {
  title: "UI Illustrations/MapPinsIllustration",
  component: MapPinsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MapPinsIllustration>;

export const Default: Story = {};
