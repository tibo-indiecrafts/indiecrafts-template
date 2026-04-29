import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Meteors } from "./meteors";

const meta: Meta<typeof Meteors> = {
  title: "UI Effects/Meteors",
  component: Meteors,
  parameters: { layout: "fullscreen" },
  argTypes: {
    number: { control: { type: "range", min: 5, max: 80, step: 5 } },
  },
};
export default meta;

type Story = StoryObj<typeof Meteors>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex min-h-[480px] w-full items-center justify-center overflow-hidden bg-slate-950">
    {children}
  </div>
);

/**
 * Default — 20 meteor streaks fall diagonally across the frame at randomised
 * delays + durations. Mount inside a `relative overflow-hidden` parent so
 * the absolute streaks stay within the canvas.
 */
export const Default: Story = {
  args: { number: 20 },
  render: (args) => (
    <Stage>
      <Meteors {...args} />
      <div className="relative px-6 text-center">
        <h2 className="text-3xl font-semibold text-white">Meteor shower</h2>
        <p className="mt-2 max-w-md text-sm text-white/70">
          Each streak picks its own delay and duration so the shower feels
          natural rather than mechanical.
        </p>
      </div>
    </Stage>
  ),
};

/** Sparse — `number={5}` for a calmer night-sky vibe. */
export const Sparse: Story = {
  args: { number: 5 },
  render: (args) => (
    <Stage>
      <Meteors {...args} />
      <h3 className="relative text-2xl font-semibold text-white">
        Just a few
      </h3>
    </Stage>
  ),
};

/** Heavy — `number={60}` for a dense storm. */
export const Heavy: Story = {
  args: { number: 60 },
  render: (args) => (
    <Stage>
      <Meteors {...args} />
      <h3 className="relative text-2xl font-semibold text-white">
        60 streaks
      </h3>
    </Stage>
  ),
};

/** Tinted — `className` tints the streak head + glow. */
export const Tinted: Story = {
  args: { number: 30 },
  render: (args) => (
    <Stage>
      <Meteors
        {...args}
        className="bg-cyan-400 before:from-cyan-300 before:to-transparent"
      />
      <h3 className="relative text-2xl font-semibold text-white">
        Cyan trail
      </h3>
    </Stage>
  ),
};

/** Card backdrop — meteors confined to a card, not the whole viewport. */
export const InCard: Story = {
  parameters: { layout: "centered" },
  render: () => (
    <div className="relative h-72 w-[420px] overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/10">
      <Meteors number={20} />
      <div className="relative flex h-full flex-col items-start justify-end p-6">
        <h3 className="text-xl font-semibold text-white">Stargazer</h3>
        <p className="mt-2 max-w-xs text-sm text-white/70">
          A subscription tier that unlocks the deluxe template features.
        </p>
      </div>
    </div>
  ),
};
