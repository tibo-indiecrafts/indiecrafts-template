import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ColourfulText from "./colourful-text";

const meta: Meta<typeof ColourfulText> = {
  title: "UI Effects/Text/ColourfulText",
  component: ColourfulText,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ColourfulText>;

export const Default: Story = {
  render: () => (
    <h1 className="text-foreground text-center text-5xl font-bold">
      Build something <ColourfulText text="beautiful" />
    </h1>
  ),
};

export const Inline: Story = {
  render: () => (
    <p className="text-foreground text-2xl">
      Designed for <ColourfulText text="indie" /> craftspeople.
    </p>
  ),
};

export const LongPhrase: Story = {
  render: () => (
    <h2 className="text-center text-3xl font-semibold">
      <ColourfulText text="design + craft + ship" />
    </h2>
  ),
};

export const DisplaySize: Story = {
  render: () => (
    <h1 className="text-center text-8xl font-black tracking-tight">
      <ColourfulText text="hello" />
    </h1>
  ),
};

export const MultipleSpans: Story = {
  render: () => (
    <h2 className="text-center text-4xl font-bold">
      <ColourfulText text="One" />
      {" · "}
      <ColourfulText text="Two" />
      {" · "}
      <ColourfulText text="Three" />
    </h2>
  ),
};
