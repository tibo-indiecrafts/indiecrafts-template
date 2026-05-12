import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spotlight } from "./spotlight-new";

const meta: Meta<typeof Spotlight> = {
  title: "UI Effects/Hover & Interactions/SpotlightNew",
  component: Spotlight,
  parameters: { layout: "fullscreen" },
  argTypes: {
    duration: { control: { type: "range", min: 2, max: 14, step: 0.5 } },
    xOffset: { control: { type: "range", min: 20, max: 300, step: 10 } },
    width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    height: { control: { type: "range", min: 600, max: 2000, step: 50 } },
    smallWidth: { control: { type: "range", min: 80, max: 400, step: 10 } },
  },
};
export default meta;

type Story = StoryObj<typeof Spotlight>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex min-h-[640px] w-full items-center justify-center overflow-hidden bg-slate-950">
    {children}
  </div>
);

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="relative z-50 px-6 text-center">
    <h2 className="bg-gradient-to-br from-slate-200 to-slate-500 bg-clip-text text-4xl font-semibold text-transparent md:text-6xl">
      {title}
    </h2>
    <p className="mt-4 max-w-md text-sm text-white/70 md:text-base">{body}</p>
  </div>
);

export const Default: Story = {
  args: { duration: 7, xOffset: 100 },
  render: (args) => (
    <Stage>
      <Spotlight {...args} />
      <Body
        title="A subtle spotlight"
        body="Two soft blue gradients sweep across the canvas like stage lights."
      />
    </Stage>
  ),
};

export const Slow: Story = {
  args: { duration: 14, xOffset: 80 },
  render: (args) => (
    <Stage>
      <Spotlight {...args} />
      <Body
        title="Calm stage"
        body="A slower sweep keeps focus on the foreground content."
      />
    </Stage>
  ),
};

export const BrandTinted: Story = {
  render: () => (
    <Stage>
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, color-mix(in oklab, var(--color-primary) 12%, transparent) 0, color-mix(in oklab, var(--color-primary) 4%, transparent) 50%, transparent 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-primary) 8%, transparent) 0, color-mix(in oklab, var(--color-primary) 3%, transparent) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--color-primary) 6%, transparent) 0, color-mix(in oklab, var(--color-primary) 3%, transparent) 80%, transparent 100%)"
      />
      <Body
        title="Brand glow"
        body="All three gradients reference --color-primary via color-mix."
      />
    </Stage>
  ),
};

export const WideSweep: Story = {
  args: { xOffset: 250, duration: 9 },
  render: (args) => (
    <Stage>
      <Spotlight {...args} />
      <Body title="Wider sweep" body="The cones travel further per cycle." />
    </Stage>
  ),
};
