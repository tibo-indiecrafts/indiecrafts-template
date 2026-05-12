import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Map } from "./dotted-map-02";

const meta: Meta<typeof Map> = {
  title: "UI Illustrations/Grid 1 Landing Dotted Map",
  component: Map,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Map>;
export const Default: Story = {};
