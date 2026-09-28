import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Switch } from "./switch";
import docs from "./switch.md?raw";
import { Label } from "./label";

const meta = {
  title: "Web/UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
  args: { size: "default" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="airplane" {...args} />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  ),
};

export const Checked: Story = {
  args: { defaultChecked: true },
  render: Default.render,
};

/** Behavior: clicking toggles the switch on. */
export const Toggles: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sw = canvas.getByRole("switch", { name: "Airplane mode" });
    await expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
  },
};
