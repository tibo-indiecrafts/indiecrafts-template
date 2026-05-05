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

/**
 * Storybook's iframe pulls focus to the first focusable element on render,
 * which lands on the gooey trigger button. Blurring the active element on
 * mount keeps the canvas in its resting state — click the pill to interact.
 */
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

/**
 * Default — click the pill to expand it into a search input. The detached
 * icon bubble re-attaches to the pill via the SVG gooey filter.
 */
export const Default: Story = {
  args: { placeholder: "Type to search..." },
  render: (args) => (
    <Stage>
      <GooeyInput {...args} />
    </Stage>
  ),
};

/** Wider — `expandedWidth={320}` accommodates longer queries. */
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

/** Heavy gooey blur — `gooeyBlur={9}` exaggerates the metaball merge effect. */
export const HeavyBlur: Story = {
  args: { gooeyBlur: 9, expandedOffset: 70 },
  render: (args) => (
    <Stage>
      <GooeyInput {...args} />
    </Stage>
  ),
};

/** Controlled — capture the current value via `onValueChange`. */
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

/** Disabled — the trigger and input both respect `disabled`. */
export const Disabled: Story = {
  args: { disabled: true, placeholder: "Search disabled" },
  render: (args) => (
    <Stage>
      <GooeyInput {...args} />
    </Stage>
  ),
};
