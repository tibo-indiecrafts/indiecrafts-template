import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Map } from "./grid-2-product-two-dotted-map";

const meta: Meta<typeof Map> = {
  title: "UI Illustrations/Grid 2 Product Two Dotted Map",
  component: Map,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Map>;
export const Default: Story = {};
