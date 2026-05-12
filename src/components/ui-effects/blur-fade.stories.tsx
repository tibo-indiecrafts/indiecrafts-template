import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlurFade } from "./blur-fade";

const meta: Meta<typeof BlurFade> = {
  title: "UI Effects/Particles & Effects/BlurFade",
  component: BlurFade,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BlurFade>;

export const Default: Story = {
  render: () => (
    <BlurFade>
      <h2 className="text-4xl font-bold">Hello, world.</h2>
    </BlurFade>
  ),
};

export const Directions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <BlurFade direction="up">
        <div className="bg-card rounded-md border px-6 py-4 text-sm">↑ up</div>
      </BlurFade>
      <BlurFade direction="down">
        <div className="bg-card rounded-md border px-6 py-4 text-sm">↓ down</div>
      </BlurFade>
      <BlurFade direction="left">
        <div className="bg-card rounded-md border px-6 py-4 text-sm">← left</div>
      </BlurFade>
      <BlurFade direction="right">
        <div className="bg-card rounded-md border px-6 py-4 text-sm">→ right</div>
      </BlurFade>
    </div>
  ),
};

export const Stagger: Story = {
  render: () => (
    <div className="grid w-[320px] gap-3">
      {["First", "Second", "Third", "Fourth", "Fifth"].map((label, i) => (
        <BlurFade key={label} delay={i * 0.12}>
          <div className="bg-card rounded-md border px-4 py-3 text-sm">{label}</div>
        </BlurFade>
      ))}
    </div>
  ),
};

export const HeavyBlur: Story = {
  render: () => (
    <BlurFade blur="14px" duration={0.8}>
      <h2 className="text-4xl font-bold">Heavier blur, slower duration</h2>
    </BlurFade>
  ),
};

export const CustomVariant: Story = {
  render: () => (
    <BlurFade
      variant={{
        hidden: { y: -30 },
        visible: { y: 0 },
      }}
      duration={0.6}
    >
      <h2 className="text-3xl font-bold">Custom y-offset variant</h2>
    </BlurFade>
  ),
};
