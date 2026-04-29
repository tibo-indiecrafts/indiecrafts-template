import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spotlight } from "./spotlight";

const meta: Meta<typeof Spotlight> = {
  title: "UI Effects/Spotlight",
  component: Spotlight,
  parameters: { layout: "fullscreen" },
  argTypes: {
    fill: { control: "color" },
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

/**
 * Default — single SVG-blur spotlight that fades in from the top-left over
 * 2s. Mount inside a `relative overflow-hidden` parent.
 */
export const Default: Story = {
  args: { fill: "white" },
  render: (args) => (
    <Stage>
      <Spotlight {...args} className="-top-40 left-0 md:-top-20 md:left-60" />
      <Body
        title="Spotlight"
        body="An SVG ellipse blurred into a soft glow that fades in once on mount."
      />
    </Stage>
  ),
};

/**
 * Brand fill — `fill` reads from the `--color-primary` token (SVG attributes
 * accept CSS vars), so a rebrand updates this spotlight automatically.
 */
export const BrandFill: Story = {
  args: { fill: "var(--color-primary)" },
  render: (args) => (
    <Stage>
      <Spotlight {...args} className="-top-40 left-0 md:-top-20 md:left-60" />
      <Body title="Brand light" body="Spotlight tinted to the template brand colour." />
    </Stage>
  ),
};

/** Right-side — position via `className`. */
export const RightSide: Story = {
  render: () => (
    <Stage>
      <Spotlight
        fill="#a855f7"
        className="-top-40 right-0 md:-top-20 md:right-60"
      />
      <Body
        title="From the right"
        body="Override the className to anchor the spotlight elsewhere."
      />
    </Stage>
  ),
};

/** Two spotlights — combine multiple instances for richer staging. */
export const TwoSpotlights: Story = {
  render: () => (
    <Stage>
      <Spotlight
        fill="#06b6d4"
        className="-top-40 left-0 md:-top-20 md:left-60"
      />
      <Spotlight
        fill="#ec4899"
        className="-top-40 right-0 md:-top-20 md:right-60"
      />
      <Body
        title="Stage left + right"
        body="Two cones from opposite sides — useful for product showcases."
      />
    </Stage>
  ),
};
