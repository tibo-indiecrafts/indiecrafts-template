import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kbd, KbdGroup } from "./kbd";

const meta: Meta<typeof Kbd> = {
  title: "UI Primitives/Kbd",
  component: Kbd,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Kbd>;

/** Single key. */
export const Default: Story = {
  render: () => <Kbd>⌘</Kbd>,
};

/** Multiple keys via `KbdGroup` — common chord pattern. */
export const Chord: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <span>+</span>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
};

/** Inline with prose. */
export const InProse: Story = {
  render: () => (
    <p className="max-w-md text-sm">
      Press{" "}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>/</Kbd>
      </KbdGroup>{" "}
      to open the help menu, or{" "}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      to invoke the command palette.
    </p>
  ),
};
