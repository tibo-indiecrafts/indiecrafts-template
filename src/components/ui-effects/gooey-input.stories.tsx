import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef, useState } from "react";
import { GooeyInput } from "./gooey-input";

const meta: Meta<typeof GooeyInput> = {
  title: "UI Effects/Inputs/GooeyInput",
  component: GooeyInput,
  parameters: { layout: "centered" },
  argTypes: {
    collapsedWidth: { control: { type: "range", min: 80, max: 200, step: 5 } },
    expandedWidth: { control: { type: "range", min: 160, max: 360, step: 10 } },
    expandedOffset: { control: { type: "range", min: 0, max: 120, step: 5 } },
    gooeyBlur: { control: { type: "range", min: 0, max: 12, step: 0.5 } },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof GooeyInput>;

const Stage = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const active = document.activeElement as HTMLElement | null;
    if (active && root.contains(active)) {
      active.blur();
    }
  }, []);
  return (
    <div
      ref={ref}
      className="bg-background flex min-h-[260px] w-full items-center justify-center p-10"
    >
      {children}
    </div>
  );
};

export const Default: Story = {
  args: { placeholder: "Type to search..." },
  render: (args) => (
    <Stage>
      <GooeyInput {...args} />
    </Stage>
  ),
};

export const Wider: Story = {
  args: {
    placeholder: "Search the docs...",
    collapsedWidth: 130,
    expandedWidth: 320,
    expandedOffset: 60,
  },
  render: (args) => (
    <Stage>
      <GooeyInput {...args} />
    </Stage>
  ),
};

export const HeavyBlur: Story = {
  args: { gooeyBlur: 9, expandedOffset: 70 },
  render: (args) => (
    <Stage>
      <GooeyInput {...args} />
    </Stage>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Stage>
        <div className="flex flex-col items-center gap-4">
          <GooeyInput
            value={value}
            onValueChange={setValue}
            placeholder="Try typing..."
          />
          <p className="text-muted-foreground text-sm">
            Current value: <code className="text-foreground">{value || "<empty>"}</code>
          </p>
        </div>
      </Stage>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Search disabled" },
  render: (args) => (
    <Stage>
      <GooeyInput {...args} />
    </Stage>
  ),
};
