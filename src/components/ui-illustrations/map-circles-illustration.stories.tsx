import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapCirclesIllustration } from "./map-circles-illustration";

const meta: Meta<typeof MapCirclesIllustration> = {
  title: "UI Illustrations/MapCircles",
  component: MapCirclesIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MapCirclesIllustration>;

export const Default: Story = {};
