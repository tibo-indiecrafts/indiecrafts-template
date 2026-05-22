import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BlobCursor } from "./index";

const meta: Meta<typeof BlobCursor> = {
  title: "UI Effects/Cursor/BlobCursor",
  component: BlobCursor,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BlobCursor>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <BlobCursor
        blobType="circle"
        fillColor="#5227FF"
        trailCount={3}
        sizes={[60, 125, 75]}
        innerSizes={[20, 35, 25]}
        innerColor="rgba(255,255,255,0.8)"
        opacities={[0.6, 0.6, 0.6]}
        shadowColor="rgba(0,0,0,0.75)"
        shadowBlur={5}
        shadowOffsetX={10}
        shadowOffsetY={10}
        filterStdDeviation={30}
        useFilter
        fastDuration={0.1}
        slowDuration={0.5}
        zIndex={100}
      />
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black">
      <BlobCursor
        blobType="square"
        fillColor="#FF9FFC"
        trailCount={4}
        sizes={[40, 80, 60, 30]}
        innerSizes={[12, 22, 18, 10]}
        opacities={[0.7, 0.5, 0.4, 0.3]}
      />
    </div>
  ),
};
