import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { BoldIcon } from "lucide-react";
import { Toggle } from "./toggle";
import docs from "./toggle.md?raw";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
  args: {
    variant: "default",
    size: "default",
    "aria-label": "Toggle bold",
    children: <BoldIcon />,
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = { args: { variant: "outline" } };

export const Pressed: Story = { args: { defaultPressed: true } };

/** Behavior: clicking flips the pressed (`data-state`) state. */
export const Toggles: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole("button", { name: "Toggle bold" });
    await expect(btn).toHaveAttribute("data-state", "off");
    await userEvent.click(btn);
    await expect(btn).toHaveAttribute("data-state", "on");
  },
};
