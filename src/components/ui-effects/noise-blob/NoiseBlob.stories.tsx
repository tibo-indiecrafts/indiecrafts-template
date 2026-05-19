import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NoiseBlob } from "./index";

const meta: Meta<typeof NoiseBlob> = {
  title: "UI Effects/Particles & Effects/NoiseBlob",
  component: NoiseBlob,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof NoiseBlob>;

export const Default: Story = {
  render: () => (
    <div className="h-[480px] w-[480px]">
      <NoiseBlob />
    </div>
  ),
};

export const HighIntensity: Story = {
  render: () => (
    <div className="h-[480px] w-[480px]">
      <NoiseBlob idleIntensity={0.6} hoverIntensity={1.4} speed={0.6} />
    </div>
  ),
};
