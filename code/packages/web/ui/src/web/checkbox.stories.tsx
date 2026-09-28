import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "./checkbox";
import docs from "./checkbox.md?raw";
import { Label } from "./label";

const meta = {
  title: "Web/UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="news" defaultChecked />
      <Label htmlFor="news">Subscribe to the newsletter</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="unavailable" disabled />
      <Label htmlFor="unavailable">Unavailable option</Label>
    </div>
  ),
};

/** Behavior: clicking the box toggles its checked state. */
export const Toggles: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
