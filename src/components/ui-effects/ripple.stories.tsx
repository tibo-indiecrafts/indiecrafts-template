import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Ripple } from "./ripple";

const meta: Meta<typeof Ripple> = {
  title: "UI Effects/Ripple",
  component: Ripple,
  parameters: { layout: "fullscreen" },
  argTypes: {
    mainCircleSize: {
      control: { type: "range", min: 80, max: 480, step: 10 },
    },
    mainCircleOpacity: {
      control: { type: "range", min: 0.05, max: 1, step: 0.05 },
    },
    numCircles: { control: { type: "range", min: 1, max: 16, step: 1 } },
  },
};
export default meta;

type Story = StoryObj<typeof Ripple>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background relative flex h-[460px] w-full items-center justify-center overflow-hidden">
    {children}
  </div>
);

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="relative z-10 px-6 text-center">
    <h2 className="text-foreground text-3xl font-semibold">{title}</h2>
    <p className="text-muted-foreground mt-2 max-w-md text-sm">{body}</p>
  </div>
);

/**
 * Default — eight concentric ripples expand from the centre. The component
 * is `pointer-events-none absolute inset-0` so it sits behind any foreground
 * content.
 */
export const Default: Story = {
  args: { mainCircleSize: 210, mainCircleOpacity: 0.24, numCircles: 8 },
  render: (args) => (
    <Stage>
      <Ripple {...args} />
      <Body
        title="Concentric pulse"
        body="A subtle hero backdrop that draws the eye to the centre."
      />
    </Stage>
  ),
};

/** Tighter — `numCircles={4}` and a smaller centre for a calmer look. */
export const Tight: Story = {
  args: { mainCircleSize: 140, mainCircleOpacity: 0.3, numCircles: 4 },
  render: (args) => (
    <Stage>
      <Ripple {...args} />
      <Body title="Few ripples" body="Less is sometimes more." />
    </Stage>
  ),
};

/** Dense — 14 ripples for a denser radar feel. */
export const Dense: Story = {
  args: { mainCircleSize: 260, mainCircleOpacity: 0.15, numCircles: 14 },
  render: (args) => (
    <Stage>
      <Ripple {...args} />
      <Body title="Radar" body="More circles, lower opacity." />
    </Stage>
  ),
};

/** Centerpiece — Ripple wrapped around a CTA pill. */
export const Centerpiece: Story = {
  render: () => (
    <Stage>
      <Ripple />
      <button className="bg-primary text-primary-foreground relative z-10 rounded-full px-6 py-3 text-sm font-semibold shadow-lg">
        Try the demo
      </button>
    </Stage>
  ),
};
