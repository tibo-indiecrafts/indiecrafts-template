import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SparklesCore } from "./sparkles";

const meta: Meta<typeof SparklesCore> = {
  title: "UI Effects/Particles & Effects/Sparkles",
  component: SparklesCore,
  parameters: { layout: "fullscreen" },
  argTypes: {
    minSize: { control: { type: "range", min: 0.1, max: 2, step: 0.1 } },
    maxSize: { control: { type: "range", min: 0.5, max: 4, step: 0.1 } },
    speed: { control: { type: "range", min: 0.1, max: 5, step: 0.1 } },
    particleDensity: {
      control: { type: "range", min: 10, max: 500, step: 10 },
    },
    particleColor: { control: "color" },
    background: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof SparklesCore>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex h-[460px] w-full items-center justify-center overflow-hidden bg-slate-950">
    {children}
  </div>
);

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="relative z-10 px-6 text-center">
    <h2 className="text-3xl font-semibold text-white">{title}</h2>
    <p className="mt-2 max-w-md text-sm text-white/70">{body}</p>
  </div>
);

export const Default: Story = {
  args: {
    background: "transparent",
    particleColor: "#ffffff",
    particleDensity: 100,
    minSize: 0.4,
    maxSize: 1.2,
    speed: 1,
  },
  render: (args) => (
    <Stage>
      <SparklesCore {...args} className="absolute inset-0" />
      <Body title="Sparkle field" body="A subtle particle backdrop for hero sections." />
    </Stage>
  ),
};

export const Dense: Story = {
  args: { particleDensity: 300, particleColor: "#ffffff" },
  render: (args) => (
    <Stage>
      <SparklesCore {...args} className="absolute inset-0" />
      <Body title="Dense" body="Higher density = more particles per area." />
    </Stage>
  ),
};

export const BrandColor: Story = {
  args: { particleColor: "#4f46e5", particleDensity: 200 },
  render: (args) => (
    <Stage>
      <SparklesCore {...args} className="absolute inset-0" />
      <Body title="Brand dust" body="Indigo particles aligned with the template brand." />
    </Stage>
  ),
};

export const LargeParticles: Story = {
  args: { minSize: 1, maxSize: 2.5, particleDensity: 60 },
  render: (args) => (
    <Stage>
      <SparklesCore {...args} className="absolute inset-0" />
      <Body title="Snowflakes" body="Bigger particles, fewer of them." />
    </Stage>
  ),
};

export const Slow: Story = {
  args: { speed: 0.3, particleDensity: 150 },
  render: (args) => (
    <Stage>
      <SparklesCore {...args} className="absolute inset-0" />
      <Body title="Slow drift" body="Lower speed feels meditative." />
    </Stage>
  ),
};
