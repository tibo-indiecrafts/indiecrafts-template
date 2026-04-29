import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "UI Primitives/Progress",
  component: Progress,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Progress>;

/** Static value — exercises the indicator translation. */
export const Default: Story = {
  render: () => <Progress value={66} className="w-[320px]" />,
};

/** Stepped values — show the bar at common percentages. */
export const Steps: Story = {
  render: () => (
    <div className="grid w-[320px] gap-4">
      {[0, 25, 50, 75, 100].map((v) => (
        <div key={v} className="grid gap-1">
          <p className="text-muted-foreground text-xs">{v}%</p>
          <Progress value={v} />
        </div>
      ))}
    </div>
  ),
};

/** Indeterminate — `value` undefined; the indicator parks at -100% (looks empty). */
export const Indeterminate: Story = {
  render: () => <Progress className="w-[320px]" />,
};

/** Animated fill — climbs from 13% to 66% over 600ms. */
export const Animated: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState(13);
      useEffect(() => {
        const t = setTimeout(() => setValue(66), 600);
        return () => clearTimeout(t);
      }, []);
      return <Progress value={value} className="w-[320px]" />;
    };
    return <Demo />;
  },
};
