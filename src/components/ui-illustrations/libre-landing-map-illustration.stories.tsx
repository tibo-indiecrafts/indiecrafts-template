import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapIllustration } from "./libre-landing-map-illustration";

const meta: Meta<typeof MapIllustration> = {
  title: "UI Illustrations/Libre Landing Map",
  component: MapIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MapIllustration>;
export const Default: Story = {};
