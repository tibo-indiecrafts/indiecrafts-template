import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PixelSnow } from "./index";

const meta: Meta<typeof PixelSnow> = {
  title: "UI Effects/Backgrounds/PixelSnow",
  component: PixelSnow,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PixelSnow>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <PixelSnow
        color="#ffffff"
        flakeSize={0.01}
        minFlakeSize={1.25}
        pixelResolution={200}
        speed={1.25}
        density={0.3}
        direction={125}
        brightness={1}
        depthFade={8}
        farPlane={20}
        gamma={0.4545}
        variant="square"
      />
    </div>
  ),
};

export const Snowflakes: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <PixelSnow
        variant="snowflake"
        color="#ffffff"
        flakeSize={0.02}
        minFlakeSize={2}
        pixelResolution={300}
        speed={0.6}
        density={0.4}
        direction={90}
      />
    </div>
  ),
};
