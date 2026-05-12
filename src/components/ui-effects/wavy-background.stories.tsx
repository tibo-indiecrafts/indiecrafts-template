import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WavyBackground } from "./wavy-background";

const meta: Meta<typeof WavyBackground> = {
  title: "UI Effects/Backgrounds/WavyBackground",
  component: WavyBackground,
  parameters: { layout: "fullscreen" },
  argTypes: {
    speed: { control: "inline-radio", options: ["slow", "fast"] },
    blur: { control: { type: "range", min: 0, max: 30, step: 1 } },
    waveOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    waveWidth: { control: { type: "range", min: 10, max: 200, step: 5 } },
    backgroundFill: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof WavyBackground>;

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="px-6 text-center">
    <h2 className="text-3xl font-semibold text-white drop-shadow-md md:text-5xl">
      {title}
    </h2>
    <p className="mt-3 max-w-md text-sm text-white/80 md:text-base">{body}</p>
  </div>
);

export const Default: Story = {
  args: { blur: 10, speed: "fast", waveOpacity: 0.5 },
  render: (args) => (
    <WavyBackground {...args}>
      <Body
        title="Wavy backdrop"
        body="A gentle simplex-noise wave field, perfect for hero sections."
      />
    </WavyBackground>
  ),
};

export const Slow: Story = {
  args: { speed: "slow" },
  render: (args) => (
    <WavyBackground {...args}>
      <Body title="Slow tides" body="Calmer, more deliberate motion." />
    </WavyBackground>
  ),
};

export const BrandPalette: Story = {
  args: {
    colors: ["#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca"],
    backgroundFill: "#0f172a",
  },
  render: (args) => (
    <WavyBackground {...args}>
      <Body title="Brand waves" body="Indigo sweep aligned with theme.config.ts brand." />
    </WavyBackground>
  ),
};

export const Sharper: Story = {
  args: { blur: 2 },
  render: (args) => (
    <WavyBackground {...args}>
      <Body title="Sharper edges" body="Less Gaussian blur reveals each wave stroke." />
    </WavyBackground>
  ),
};

export const WiderStrokes: Story = {
  args: { waveWidth: 120 },
  render: (args) => (
    <WavyBackground {...args}>
      <Body title="Heavier" body="Bigger brush strokes for bolder presence." />
    </WavyBackground>
  ),
};
