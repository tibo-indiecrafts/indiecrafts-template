import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GridScan } from "./index";

const meta: Meta<typeof GridScan> = {
  title: "UI Effects/Backgrounds/GridScan",
  component: GridScan,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GridScan>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <GridScan
        sensitivity={0.55}
        lineThickness={1}
        linesColor="#2F293A"
        gridScale={0.1}
        scanColor="#FF9FFC"
        scanOpacity={0.4}
        enablePost
        bloomIntensity={0.6}
        chromaticAberration={0.002}
        noiseIntensity={0.01}
        lineJitter={0.1}
        scanGlow={0.5}
        scanSoftness={2}
      />
    </div>
  ),
};
