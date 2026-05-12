import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapIllustration } from "./grid-1-landing-map-illustration";

const meta: Meta<typeof MapIllustration> = {
  title: "UI Illustrations/Grid 1 Landing Map",
  component: MapIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MapIllustration>;
export const Default: Story = {};
