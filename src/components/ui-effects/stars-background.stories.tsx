import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StarsBackground } from "./stars-background";

const meta: Meta<typeof StarsBackground> = {
  title: "UI Effects/StarsBackground",
  component: StarsBackground,
  parameters: { layout: "fullscreen" },
  argTypes: {
    starDensity: {
      control: { type: "range", min: 0.00005, max: 0.001, step: 0.00005 },
    },
    twinkleProbability: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
    },
    minTwinkleSpeed: {
      control: { type: "range", min: 0.1, max: 3, step: 0.1 },
    },
    maxTwinkleSpeed: {
      control: { type: "range", min: 0.5, max: 5, step: 0.1 },
    },
    allStarsTwinkle: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof StarsBackground>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-[460px] w-full overflow-hidden bg-slate-950">
    {children}
  </div>
);

const Body = ({ title, body }: { title: string; body: string }) => (
  <div className="relative z-10 grid h-full place-items-center px-6 text-center">
    <div>
      <h2 className="text-3xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm text-white/70">{body}</p>
    </div>
  </div>
);

/**
 * Default — canvas-rendered stars with most twinkling. Density scales with
 * canvas area, so smaller stages render fewer stars automatically.
 */
export const Default: Story = {
  args: {
    starDensity: 0.00015,
    allStarsTwinkle: true,
    twinkleProbability: 0.7,
    minTwinkleSpeed: 0.5,
    maxTwinkleSpeed: 1,
  },
  render: (args) => (
    <Stage>
      <StarsBackground {...args} />
      <Body
        title="A field of stars"
        body="Subtle twinkle on a canvas backdrop."
      />
    </Stage>
  ),
};

/** Dense — `starDensity={0.0008}` cranks up the count. */
export const Dense: Story = {
  args: { starDensity: 0.0008 },
  render: (args) => (
    <Stage>
      <StarsBackground {...args} />
      <Body title="Dense night" body="Higher density = more stars per pixel." />
    </Stage>
  ),
};

/** No twinkle — `allStarsTwinkle={false}` and 0 probability for a still sky. */
export const Still: Story = {
  args: { allStarsTwinkle: false, twinkleProbability: 0 },
  render: (args) => (
    <Stage>
      <StarsBackground {...args} />
      <Body title="Still sky" body="Stars hold opacity instead of twinkling." />
    </Stage>
  ),
};

/** Fast twinkle — `min/maxTwinkleSpeed` lowered for a frantic shimmer. */
export const FastTwinkle: Story = {
  args: { minTwinkleSpeed: 0.1, maxTwinkleSpeed: 0.4 },
  render: (args) => (
    <Stage>
      <StarsBackground {...args} />
      <Body
        title="Fast shimmer"
        body="Lower speeds mean tighter twinkle cycles."
      />
    </Stage>
  ),
};
