import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as ReiconReact from "reicon-react";
import { ReiconIcon } from "./ReiconIcon";

// reicon-react ships its glyphs as named exports; enumerate a sample so the story
// self-populates with real icon names rather than a guessed string.
const NAMES = Object.keys(ReiconReact)
  .filter((k) => /^[A-Z]/.test(k) && typeof (ReiconReact as Record<string, unknown>)[k] === "function")
  .slice(0, 18);

const meta = {
  title: "Icons/Web/ReiconIcon",
  component: ReiconIcon,
  tags: ["autodocs"],
  args: { name: NAMES[0] ?? "", size: 28, weight: "Outline" },
  argTypes: {
    name: { control: "select", options: NAMES },
    weight: { control: "inline-radio", options: ["Outline", "Filled"] },
    size: { control: { type: "range", min: 16, max: 64, step: 2 } },
  },
} satisfies Meta<typeof ReiconIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sample: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
      {NAMES.map((name) => (
        <div key={name} style={{ display: "grid", placeItems: "center", gap: 6, fontSize: 11 }}>
          <ReiconIcon {...args} name={name} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
