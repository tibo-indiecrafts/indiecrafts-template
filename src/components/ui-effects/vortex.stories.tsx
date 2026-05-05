import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Vortex } from "./vortex";

const meta: Meta<typeof Vortex> = {
  title: "UI Effects/Backgrounds/Vortex",
  component: Vortex,
  parameters: { layout: "fullscreen" },
  argTypes: {
    particleCount: { control: { type: "range", min: 50, max: 1500, step: 50 } },
    baseHue: { control: { type: "range", min: 0, max: 360, step: 5 } },
    baseSpeed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    rangeSpeed: { control: { type: "range", min: 0.5, max: 5, step: 0.1 } },
    baseRadius: { control: { type: "range", min: 0.5, max: 4, step: 0.1 } },
    rangeRadius: { control: { type: "range", min: 0.5, max: 6, step: 0.1 } },
    backgroundColor: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof Vortex>;

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="relative z-20 px-6 text-center">
    <h2 className="text-3xl font-semibold text-white md:text-5xl">{title}</h2>
    <p className="mt-4 max-w-md text-sm text-white/80 md:text-base">{body}</p>
  </div>
);

/**
 * Default — 700 noise-driven particles swirl on a black canvas. The
 * component fills its container; mount in a fixed-height parent.
 */
export const Default: Story = {
  args: { particleCount: 700, baseHue: 220 },
  render: (args) => (
    <div className="h-[640px] w-full">
      <Vortex {...args} containerClassName="flex items-center justify-center">
        <Body
          title="Particle vortex"
          body="A swirling mass of simplex-noise driven particles."
        />
      </Vortex>
    </div>
  ),
};

/** Sparse — `particleCount={250}` for a calmer galaxy feel. */
export const Sparse: Story = {
  args: { particleCount: 250 },
  render: (args) => (
    <div className="h-[640px] w-full">
      <Vortex {...args} containerClassName="flex items-center justify-center">
        <Body title="Sparse" body="Fewer particles, more space." />
      </Vortex>
    </div>
  ),
};

/** Magenta hue — `baseHue={320}` for a warmer palette. */
export const MagentaHue: Story = {
  args: { baseHue: 320 },
  render: (args) => (
    <div className="h-[640px] w-full">
      <Vortex {...args} containerClassName="flex items-center justify-center">
        <Body title="Hot palette" body="Hue shifted to magenta + amber." />
      </Vortex>
    </div>
  ),
};

/**
 * Cyan particles — `baseHue={190}` shifts the swarm toward cyan/teal. Note
 * that `backgroundColor` is most effective when near-black; the upstream
 * uses additive compositing (`globalCompositeOperation: "lighter"`) which
 * washes lighter backdrops toward white over a few frames.
 */
export const CyanParticles: Story = {
  args: { baseHue: 190, backgroundColor: "#000000" },
  render: (args) => (
    <div className="h-[640px] w-full">
      <Vortex {...args} containerClassName="flex items-center justify-center">
        <Body
          title="Cyan vortex"
          body="Hue rotated to cyan/teal on a true-black canvas."
        />
      </Vortex>
    </div>
  ),
};

/** Faster — `rangeSpeed={3}` widens the velocity distribution. */
export const Faster: Story = {
  args: { rangeSpeed: 3, baseSpeed: 0.5 },
  render: (args) => (
    <div className="h-[640px] w-full">
      <Vortex {...args} containerClassName="flex items-center justify-center">
        <Body title="Quick swirl" body="Higher rangeSpeed for kinetic energy." />
      </Vortex>
    </div>
  ),
};
