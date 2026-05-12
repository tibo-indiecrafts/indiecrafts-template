import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Map } from "./grid-2-landing-dotted-map";

const meta: Meta<typeof Map> = {
  title: "UI Illustrations/Grid 2 Landing Dotted Map",
  component: Map,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Map>;
export const Default: Story = {};
