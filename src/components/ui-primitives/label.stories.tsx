import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "UI Primitives/Label",
  component: Label,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <Label className="flex items-center gap-2">
      <Checkbox defaultChecked />
      Accept terms and conditions
    </Label>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="group grid gap-2" data-disabled="true">
      <Label htmlFor="locked">API Token</Label>
      <Input id="locked" disabled defaultValue="••••••••••" />
    </div>
  ),
};
