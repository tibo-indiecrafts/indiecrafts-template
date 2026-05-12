import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapIllustration } from "./map-2";

const meta: Meta<typeof MapIllustration> = {
  title: "UI Illustrations/Map 2",
  component: MapIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MapIllustration>;
export const Default: Story = {};
