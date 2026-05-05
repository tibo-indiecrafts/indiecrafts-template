import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuroraBackground } from "./aurora-background";

const meta: Meta<typeof AuroraBackground> = {
  title: "UI Effects/Backgrounds/AuroraBackground",
  component: AuroraBackground,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AuroraBackground>;

/** Default — radial gradient mask + animated aurora behind centered content. */
export const Default: Story = {
  render: () => (
    <AuroraBackground>
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-center text-4xl font-semibold md:text-7xl">
          Background lights
        </h2>
        <p className="text-muted-foreground max-w-md text-center text-sm md:text-base">
          And thus the night sky shimmered, an infinite canvas pierced by countless points
          of celestial light.
        </p>
        <button className="bg-foreground text-background mt-2 rounded-full px-4 py-2 text-sm font-medium">
          Explore
        </button>
      </div>
    </AuroraBackground>
  ),
};

/**
 * `showRadialGradient={false}` — full-bleed aurora with no spotlight mask.
 * Useful when the aurora itself is the focal point.
 */
export const FullBleed: Story = {
  render: () => (
    <AuroraBackground showRadialGradient={false}>
      <div className="relative z-10 px-4 text-center">
        <h2 className="text-4xl font-semibold md:text-6xl">Full-bleed aurora</h2>
      </div>
    </AuroraBackground>
  ),
};

/**
 * Empty stage — no children. Verifies the background animates on its own when
 * used purely as a hero backdrop.
 */
export const EmptyStage: Story = {
  render: () => <AuroraBackground>{null}</AuroraBackground>,
};

/** Custom container className — `h-[60vh]` shrinks the stage from full screen. */
export const ShortStage: Story = {
  render: () => (
    <AuroraBackground className="h-[60vh]">
      <div className="relative z-10 px-4 text-center">
        <h3 className="text-3xl font-semibold">60vh stage</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Pass a height utility via `className` for inline hero accents.
        </p>
      </div>
    </AuroraBackground>
  ),
};
