import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "./animated-grid-pattern";

const meta: Meta<typeof AnimatedGridPattern> = {
  title: "UI Effects/Backgrounds/AnimatedGridPattern",
  component: AnimatedGridPattern,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AnimatedGridPattern>;

const Frame = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="bg-background relative flex min-h-svh items-center justify-center overflow-hidden p-12">
    <div
      className={cn(
        "bg-card relative flex h-[480px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-2xl border",
        className,
      )}
    >
      {children}
    </div>
  </div>
);

/** Default — 50 squares fading in/out at 1s duration. */
export const Default: Story = {
  render: () => (
    <Frame>
      <AnimatedGridPattern className="inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent)]" />
      <p className="relative z-10 text-2xl font-medium">Animated grid backdrop</p>
    </Frame>
  ),
};

/** Larger cells — `width={60} height={60}` for sparser grid. */
export const LargeCells: Story = {
  render: () => (
    <Frame>
      <AnimatedGridPattern
        width={60}
        height={60}
        className="inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent)]"
      />
      <p className="relative z-10 text-2xl font-medium">60×60 cells</p>
    </Frame>
  ),
};

/** Dashed stroke — `strokeDasharray={4}` for a faint dashed grid. */
export const DashedStroke: Story = {
  render: () => (
    <Frame>
      <AnimatedGridPattern
        strokeDasharray={4}
        className="inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent)]"
      />
      <p className="relative z-10 text-2xl font-medium">Dashed stroke</p>
    </Frame>
  ),
};

/** More squares + faster cycle — denser shimmer. */
export const Dense: Story = {
  render: () => (
    <Frame>
      <AnimatedGridPattern
        numSquares={120}
        duration={2}
        repeatDelay={0}
        className="inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent)]"
      />
      <p className="relative z-10 text-2xl font-medium">120 squares · 2s cycle</p>
    </Frame>
  ),
};

/** Higher max-opacity — squares fade in more boldly. */
export const HighOpacity: Story = {
  render: () => (
    <Frame>
      <AnimatedGridPattern
        maxOpacity={0.7}
        className="inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent)]"
      />
      <p className="relative z-10 text-2xl font-medium">maxOpacity = 0.7</p>
    </Frame>
  ),
};
