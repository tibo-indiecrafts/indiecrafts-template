import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { AnimatedCircularProgressBar } from "./animated-circular-progress-bar";

const meta: Meta<typeof AnimatedCircularProgressBar> = {
  title: "UI Effects/Loaders & Progress/AnimatedCircularProgressBar",
  component: AnimatedCircularProgressBar,
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    gaugePrimaryColor: { control: "color" },
    gaugeSecondaryColor: { control: "color" },
  },
};
export default meta;

type Story = StoryObj<typeof AnimatedCircularProgressBar>;

const baseColors = {
  gaugePrimaryColor: "#4f69d9",
  gaugeSecondaryColor: "#e5e7eb",
};

export const Default: Story = {
  args: { value: 66, ...baseColors },
};

export const Steps: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {[0, 25, 50, 75, 100].map((v) => (
        <AnimatedCircularProgressBar key={v} value={v} {...baseColors} />
      ))}
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState(13);
      useEffect(() => {
        const id = setInterval(() => setValue((v) => (v >= 87 ? 13 : v + 8)), 600);
        return () => clearInterval(id);
      }, []);
      return <AnimatedCircularProgressBar value={value} {...baseColors} />;
    };
    return <Demo />;
  },
};

export const Palettes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <AnimatedCircularProgressBar
        value={72}
        gaugePrimaryColor="#10b981"
        gaugeSecondaryColor="#dcfce7"
      />
      <AnimatedCircularProgressBar
        value={45}
        gaugePrimaryColor="#f59e0b"
        gaugeSecondaryColor="#fef3c7"
      />
      <AnimatedCircularProgressBar
        value={18}
        gaugePrimaryColor="#ef4444"
        gaugeSecondaryColor="#fee2e2"
      />
      <AnimatedCircularProgressBar
        value={94}
        gaugePrimaryColor="#a855f7"
        gaugeSecondaryColor="#f3e8ff"
      />
    </div>
  ),
};

export const CustomRange: Story = {
  args: { value: 125, min: 50, max: 200, ...baseColors },
};
