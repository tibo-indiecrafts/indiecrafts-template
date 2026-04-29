import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

const meta: Meta<typeof RadioGroup> = {
  title: "UI Primitives/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" className="w-64">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r-default" />
        <Label htmlFor="r-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r-comfortable" />
        <Label htmlFor="r-comfortable">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r-compact" />
        <Label htmlFor="r-compact">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup
      defaultValue="card"
      className="flex w-72 items-center gap-4"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="card" id="p-card" />
        <Label htmlFor="p-card">Card</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="bank" id="p-bank" />
        <Label htmlFor="p-bank">Bank</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="paypal" id="p-paypal" />
        <Label htmlFor="p-paypal">PayPal</Label>
      </div>
    </RadioGroup>
  ),
};
