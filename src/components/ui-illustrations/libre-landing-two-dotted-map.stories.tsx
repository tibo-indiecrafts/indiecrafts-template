import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Map } from "./libre-landing-two-dotted-map";

const meta: Meta<typeof Map> = {
  title: "UI Illustrations/Libre Landing Two Dotted Map",
  component: Map,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Map>;
export const Default: Story = {};
