import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SplashCursor } from "./index";

const meta: Meta<typeof SplashCursor> = {
  title: "UI Effects/Hover & Interactions/SplashCursor",
  component: SplashCursor,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SplashCursor>;

export const Showcase: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#A855F7"
      />
    </div>
  ),
};

export const Rainbow: Story = {
  render: () => (
    <div className="relative h-dvh w-dvw bg-black">
      <SplashCursor
        DENSITY_DISSIPATION={2.5}
        VELOCITY_DISSIPATION={1.8}
        PRESSURE={0.1}
        CURL={4}
        SPLAT_RADIUS={0.25}
        SPLAT_FORCE={7000}
        COLOR_UPDATE_SPEED={14}
        SHADING
        RAINBOW_MODE
      />
    </div>
  ),
};
