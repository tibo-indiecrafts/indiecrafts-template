import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MapIllustration } from "./map-illustration-06";

const meta: Meta<typeof MapIllustration> = {
  title: "UI Illustrations/Libre Landing Map",
  component: MapIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MapIllustration>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[420px] w-[720px] max-w-full">
      <MapIllustration />
    </div>
  ),
};
