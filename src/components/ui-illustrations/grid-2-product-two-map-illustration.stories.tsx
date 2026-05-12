import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapIllustration } from "./grid-2-product-two-map-illustration";

const meta: Meta<typeof MapIllustration> = {
  title: "UI Illustrations/Grid 2 Product Two Map",
  component: MapIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MapIllustration>;
export const Default: Story = {};
