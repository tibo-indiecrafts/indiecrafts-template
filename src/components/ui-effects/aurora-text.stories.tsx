import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuroraText } from "./aurora-text";

const meta: Meta<typeof AuroraText> = {
  title: "UI Effects/AuroraText",
  component: AuroraText,
  parameters: { layout: "centered" },
  argTypes: {
    speed: { control: { type: "range", min: 0.25, max: 4, step: 0.25 } },
  },
};
export default meta;

type Story = StoryObj<typeof AuroraText>;

/** Default 4-color gradient (pink → purple → blue → sky). */
export const Default: Story = {
  render: () => (
    <h1 className="text-5xl font-bold">
      <AuroraText>Aurora text effect</AuroraText>
    </h1>
  ),
};

/** Custom palette — pass your own gradient stops. */
export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4 text-4xl font-bold">
      <AuroraText colors={["#10b981", "#22d3ee", "#3b82f6"]}>
        Emerald · Cyan · Blue
      </AuroraText>
      <AuroraText colors={["#f97316", "#ef4444", "#ec4899"]}>
        Sunset
      </AuroraText>
      <AuroraText colors={["#facc15", "#a855f7", "#0ea5e9", "#10b981"]}>
        Four-stop palette
      </AuroraText>
    </div>
  ),
};

/** Speed scale — slower / faster aurora cycles. */
export const Speeds: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3 text-3xl font-bold">
      <AuroraText speed={0.5}>Slow (0.5×)</AuroraText>
      <AuroraText>Default (1×)</AuroraText>
      <AuroraText speed={3}>Fast (3×)</AuroraText>
    </div>
  ),
};

/** Inline within heading copy — composes naturally with surrounding text. */
export const Inline: Story = {
  render: () => (
    <h2 className="max-w-2xl text-center text-5xl leading-tight font-bold">
      Build an <AuroraText>indie business</AuroraText> in plain JavaScript.
    </h2>
  ),
};
