import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FaultyTerminal } from "./index";

const meta: Meta<typeof FaultyTerminal> = {
  title: "UI Effects/Backgrounds/FaultyTerminal",
  component: FaultyTerminal,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof FaultyTerminal>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        timeScale={0.5}
        pause={false}
        scanlineIntensity={0.5}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
        chromaticAberration={0}
        dither={0}
        curvature={0.1}
        tint="#A7EF9E"
        mouseReact
        mouseStrength={0.5}
        pageLoadAnimation
        brightness={0.6}
      />
    </div>
  ),
};
