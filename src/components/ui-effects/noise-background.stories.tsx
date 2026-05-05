import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NoiseBackground } from "./noise-background";

const meta: Meta<typeof NoiseBackground> = {
  title: "UI Effects/Backgrounds/NoiseBackground",
  component: NoiseBackground,
  parameters: { layout: "fullscreen" },
  argTypes: {
    noiseIntensity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    speed: { control: { type: "range", min: 0, max: 0.5, step: 0.01 } },
    backdropBlur: { control: "boolean" },
    animating: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof NoiseBackground>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[460px] w-full items-center justify-center p-6">
    <div className="w-[640px]">{children}</div>
  </div>
);

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="flex h-72 flex-col items-center justify-center text-center">
    <h3 className="text-2xl font-bold text-white drop-shadow-md">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-white/80">{body}</p>
  </div>
);

/**
 * Default — three drifting radial gradients tinted pink/blue/amber overlay
 * a noise texture (`/public/noise.svg`). The gradients drift on
 * `useAnimationFrame`, randomly changing direction every 1.5–3s.
 */
export const Default: Story = {
  args: { noiseIntensity: 0.2, speed: 0.1, animating: true },
  render: (args) => (
    <Stage>
      <NoiseBackground {...args}>
        <Body
          title="Drifting noise"
          body="Three radial gradients, one noise overlay, one container."
        />
      </NoiseBackground>
    </Stage>
  ),
};

/**
 * Brand palette — three RGB stops around the template&apos;s indigo brand
 * (`oklch(0.55 0.18 260)`). The gradients render to a canvas so we use
 * concrete RGB strings rather than CSS vars.
 */
export const BrandPalette: Story = {
  args: {
    gradientColors: ["rgb(99, 102, 241)", "rgb(79, 70, 229)", "rgb(165, 180, 252)"],
  },
  render: (args) => (
    <Stage>
      <NoiseBackground {...args}>
        <Body
          title="Brand tides"
          body="Three indigo stops aligned with the template brand."
        />
      </NoiseBackground>
    </Stage>
  ),
};

/** Heavy noise — `noiseIntensity={0.6}` makes the grain more prominent. */
export const HeavyNoise: Story = {
  args: { noiseIntensity: 0.6 },
  render: (args) => (
    <Stage>
      <NoiseBackground {...args}>
        <Body title="Grainy" body="More noise feels analogue; less feels digital." />
      </NoiseBackground>
    </Stage>
  ),
};

/** Static — `animating={false}` freezes the gradients in place. */
export const Static: Story = {
  args: { animating: false },
  render: (args) => (
    <Stage>
      <NoiseBackground {...args}>
        <Body
          title="Frozen frame"
          body="Useful when motion is distracting from the foreground content."
        />
      </NoiseBackground>
    </Stage>
  ),
};

/** Backdrop blur — `backdropBlur` applies a frosted glass overlay. */
export const BackdropBlur: Story = {
  args: { backdropBlur: true },
  render: (args) => (
    <Stage>
      <NoiseBackground {...args}>
        <Body
          title="Frosted"
          body="Adds a subtle backdrop-blur layer above the gradients."
        />
      </NoiseBackground>
    </Stage>
  ),
};
