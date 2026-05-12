import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextGenerateEffect } from "./text-generate-effect";

const meta: Meta<typeof TextGenerateEffect> = {
  title: "UI Effects/Text/TextGenerateEffect",
  component: TextGenerateEffect,
  parameters: { layout: "centered" },
  argTypes: {
    duration: { control: { type: "range", min: 0.1, max: 3, step: 0.1 } },
    filter: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof TextGenerateEffect>;

const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background flex min-h-[260px] w-full items-center justify-center p-10">
    <div className="max-w-xl">{children}</div>
  </div>
);

export const Default: Story = {
  args: { duration: 0.5, filter: true },
  render: (args) => (
    <Stage>
      <TextGenerateEffect
        {...args}
        words="The quick brown fox jumps over the lazy dog. Build something beautiful with type-safe configs and zero boilerplate."
      />
    </Stage>
  ),
};

export const NoBlur: Story = {
  args: { duration: 0.5, filter: false },
  render: (args) => (
    <Stage>
      <TextGenerateEffect
        {...args}
        words="A cleaner reveal — no blur filter, just opacity stagger."
      />
    </Stage>
  ),
};

export const Slow: Story = {
  args: { duration: 1.5, filter: true },
  render: (args) => (
    <Stage>
      <TextGenerateEffect
        {...args}
        words="Slow, deliberate, almost cinematic — perfect for an opener."
      />
    </Stage>
  ),
};

export const Hero: Story = {
  args: { duration: 0.5, filter: true },
  render: (args) => (
    <Stage>
      <TextGenerateEffect
        {...args}
        className="text-4xl md:text-5xl"
        words="Build sites that ship fast."
      />
    </Stage>
  ),
};

export const Branded: Story = {
  args: { duration: 0.5, filter: true },
  render: (args) => (
    <Stage>
      <TextGenerateEffect
        {...args}
        className="text-primary"
        words="Indiecrafts brand colour, faded in word by word."
      />
    </Stage>
  ),
};
