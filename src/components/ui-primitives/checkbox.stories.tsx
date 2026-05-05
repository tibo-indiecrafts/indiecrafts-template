import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta: Meta<typeof Checkbox> = {
  title: "UI Primitives/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

/** Single checkbox + label, controlled by Radix's checked state. */
export const Default: Story = {
  render: () => (
    <Label className="flex items-center gap-2">
      <Checkbox />
      Subscribe to the newsletter
    </Label>
  ),
};

/** Checked at mount via `defaultChecked`. */
export const Checked: Story = {
  render: () => (
    <Label className="flex items-center gap-2">
      <Checkbox defaultChecked />
      Remember me
    </Label>
  ),
};

/** Indeterminate state — common in "select all" patterns. */
export const Indeterminate: Story = {
  render: () => (
    <Label className="flex items-center gap-2">
      <Checkbox checked="indeterminate" />
      Select all (some children selected)
    </Label>
  ),
};

/** Disabled checked + unchecked side by side. */
export const Disabled: Story = {
  render: () => (
    <div className="grid gap-3">
      <Label className="flex items-center gap-2">
        <Checkbox disabled />
        Disabled, unchecked
      </Label>
      <Label className="flex items-center gap-2">
        <Checkbox disabled defaultChecked />
        Disabled, checked
      </Label>
    </div>
  ),
};

/** Stacked list — common pattern for filter sets. */
export const List: Story = {
  render: () => (
    <fieldset className="grid gap-3">
      <legend className="text-muted-foreground mb-2 text-sm font-medium">
        Notify me when…
      </legend>
      <Label className="flex items-center gap-2">
        <Checkbox defaultChecked />
        Someone comments on my post
      </Label>
      <Label className="flex items-center gap-2">
        <Checkbox defaultChecked />
        Someone follows me
      </Label>
      <Label className="flex items-center gap-2">
        <Checkbox />I receive a direct message
      </Label>
    </fieldset>
  ),
};
