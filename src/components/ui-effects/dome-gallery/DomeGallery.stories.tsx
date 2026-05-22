import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DomeGallery } from "./index";

const meta: Meta<typeof DomeGallery> = {
  title: "UI Effects/Gallery/DomeGallery",
  component: DomeGallery,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof DomeGallery>;

export const Showcase: Story = {
  render: () => (
    <div className="h-dvh w-dvw bg-black">
      <DomeGallery
        fit={0.8}
        minRadius={600}
        maxVerticalRotationDeg={0}
        segments={34}
        dragDampening={2}
        grayscale
      />
    </div>
  ),
};
