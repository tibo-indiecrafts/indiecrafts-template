import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BackgroundGradientAnimation } from "./background-gradient-animation";

const meta: Meta<typeof BackgroundGradientAnimation> = {
  title: "UI Effects/BackgroundGradientAnimation",
  component: BackgroundGradientAnimation,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BackgroundGradientAnimation>;

/** Default — purple/blue palette, mouse-interactive blob. */
export const Default: Story = {
  render: () => (
    <BackgroundGradientAnimation>
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center text-center text-3xl font-bold text-white md:text-7xl">
        <p className="bg-clip-text bg-gradient-to-b from-white/80 to-white/20 text-transparent drop-shadow-2xl">
          Gradient flow
        </p>
      </div>
    </BackgroundGradientAnimation>
  ),
};

/** Non-interactive — `interactive={false}` removes the mouse follower. */
export const NonInteractive: Story = {
  render: () => (
    <BackgroundGradientAnimation interactive={false}>
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center text-3xl font-bold text-white">
        Static gradient (no pointer follower)
      </div>
    </BackgroundGradientAnimation>
  ),
};

/** Custom palette — emerald + ocean blues. */
export const EmeraldOcean: Story = {
  render: () => (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(2, 44, 34)"
      gradientBackgroundEnd="rgb(8, 47, 73)"
      firstColor="34, 197, 94"
      secondColor="14, 165, 233"
      thirdColor="20, 184, 166"
      fourthColor="6, 182, 212"
      fifthColor="59, 130, 246"
      pointerColor="34, 197, 94"
    >
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center text-4xl font-bold text-white">
        Emerald ocean
      </div>
    </BackgroundGradientAnimation>
  ),
};

/** Smaller blobs — `size="40%"` shrinks each colour cloud. */
export const SmallBlobs: Story = {
  render: () => (
    <BackgroundGradientAnimation size="40%">
      <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center text-3xl font-bold text-white">
        size = &ldquo;40%&rdquo;
      </div>
    </BackgroundGradientAnimation>
  ),
};

/** Empty stage — no children. Ambient backdrop only. */
export const EmptyStage: Story = {
  render: () => <BackgroundGradientAnimation />,
};
