import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Beams } from "./index";

const meta: Meta<typeof Beams> = {
  title: "UI Effects/Backgrounds/Beams",
  component: Beams,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Beams>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <Beams
        beamWidth={3}
        beamHeight={30}
        beamNumber={20}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
      />
    </div>
  ),
};
