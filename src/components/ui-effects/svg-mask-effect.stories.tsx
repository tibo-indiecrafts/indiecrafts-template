import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MaskContainer } from "./svg-mask-effect";

const meta: Meta<typeof MaskContainer> = {
  title: "UI Effects/Particles & Effects/SvgMaskEffect",
  component: MaskContainer,
  parameters: { layout: "fullscreen" },
  argTypes: {
    size: { control: { type: "range", min: 4, max: 80, step: 2 } },
    revealSize: { control: { type: "range", min: 200, max: 1200, step: 50 } },
  },
};
export default meta;

type Story = StoryObj<typeof MaskContainer>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-950">{children}</div>
);

export const Default: Story = {
  args: { size: 10, revealSize: 600 },
  render: (args) => (
    <Stage>
      <MaskContainer
        {...args}
        revealText={
          <p className="mx-auto max-w-3xl text-center text-3xl font-bold text-slate-700 md:text-4xl dark:text-slate-300">
            Indiecrafts is a config-first Next.js template that makes shipping client
            sites a weekend project, not a quarter.
          </p>
        }
        className="rounded-md text-3xl font-bold text-white md:text-4xl dark:text-black"
      >
        Hover to reveal what we <span className="text-blue-500">really do</span>
      </MaskContainer>
    </Stage>
  ),
};

export const LargeReveal: Story = {
  args: { size: 10, revealSize: 900 },
  render: (args) => (
    <Stage>
      <MaskContainer
        {...args}
        revealText={
          <p className="mx-auto max-w-3xl text-center text-3xl font-bold text-slate-700 md:text-4xl dark:text-slate-300">
            A wider window into the message — useful for hero sections.
          </p>
        }
        className="rounded-md text-3xl font-bold text-white md:text-4xl dark:text-black"
      >
        Hover for a <span className="text-emerald-500">wider</span> view
      </MaskContainer>
    </Stage>
  ),
};

export const TinyRest: Story = {
  args: { size: 4, revealSize: 600 },
  render: (args) => (
    <Stage>
      <MaskContainer
        {...args}
        revealText={
          <p className="mx-auto max-w-3xl text-center text-3xl font-bold text-slate-700 md:text-4xl dark:text-slate-300">
            A pinhole that opens up when you approach.
          </p>
        }
        className="rounded-md text-3xl font-bold text-white md:text-4xl dark:text-black"
      >
        A tiny <span className="text-pink-500">peephole</span>
      </MaskContainer>
    </Stage>
  ),
};
