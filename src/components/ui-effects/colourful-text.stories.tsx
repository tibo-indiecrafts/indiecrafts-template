import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ColourfulText from "./colourful-text";

const meta: Meta<typeof ColourfulText> = {
  title: "UI Effects/Text/ColourfulText",
  component: ColourfulText,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ColourfulText>;

/** Default — single colourful word in a heading; colours shuffle every 5 s. */
export const Default: Story = {
  render: () => (
    <h1 className="text-foreground text-center text-5xl font-bold">
      Build something <ColourfulText text="beautiful" />
    </h1>
  ),
};

/** Inline within prose — no colour clash with surrounding muted text. */
export const Inline: Story = {
  render: () => (
    <p className="text-foreground text-2xl">
      Designed for <ColourfulText text="indie" /> craftspeople.
    </p>
  ),
};

/** Long phrase — proves per-character animation scales to longer strings. */
export const LongPhrase: Story = {
  render: () => (
    <h2 className="text-center text-3xl font-semibold">
      <ColourfulText text="design + craft + ship" />
    </h2>
  ),
};

/** Display sized — 8xl headline use as a hero accent. */
export const DisplaySize: Story = {
  render: () => (
    <h1 className="text-center text-8xl font-black tracking-tight">
      <ColourfulText text="hello" />
    </h1>
  ),
};

/** Multiple words — each animated independently; staggered colour cycles. */
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
