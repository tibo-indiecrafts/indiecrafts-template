import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bold, Italic, Underline } from "lucide-react";
import { Toggle } from "./toggle";

const meta: Meta<typeof Toggle> = {
  title: "UI Primitives/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Toggle>;

/** Default — text label, off at mount. */
export const Default: Story = {
  render: () => <Toggle aria-label="Toggle italic">Italic</Toggle>,
};

/** Pressed via `defaultPressed`. */
export const Pressed: Story = {
  render: () => (
    <Toggle defaultPressed aria-label="Toggle bold">
      <Bold />
    </Toggle>
  ),
};

/** Outline variant — visible border. */
export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle underline">
      <Underline />
    </Toggle>
  ),
};

/** Sizes laid out side by side. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle size="sm" aria-label="bold">
        <Bold />
      </Toggle>
      <Toggle aria-label="italic">
        <Italic />
      </Toggle>
      <Toggle size="lg" aria-label="underline">
        <Underline />
      </Toggle>
    </div>
  ),
};

/** Disabled. */
export const Disabled: Story = {
  render: () => (
    <Toggle disabled aria-label="locked">
      Locked
    </Toggle>
  ),
};
