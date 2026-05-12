import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "UI Primitives/Switch",
  component: Switch,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => (
    <Label className="flex items-center gap-2">
      <Switch id="airplane" />
      Airplane mode
    </Label>
  ),
};

export const Checked: Story = {
  render: () => (
    <Label className="flex items-center gap-2">
      <Switch defaultChecked />
      Notifications enabled
    </Label>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid gap-3">
      <Label className="flex items-center gap-2">
        <Switch disabled />
        Locked off
      </Label>
      <Label className="flex items-center gap-2">
        <Switch disabled defaultChecked />
        Locked on
      </Label>
    </div>
  ),
};

export const SettingsGroup: Story = {
  render: () => (
    <div className="w-[360px] divide-y rounded-lg border">
      {[
        { id: "a", label: "Marketing emails", on: true },
        { id: "b", label: "Security alerts", on: true },
        { id: "c", label: "Product updates", on: false },
      ].map((row) => (
        <Label
          key={row.id}
          className="flex items-center justify-between px-4 py-3 text-sm"
        >
          {row.label}
          <Switch defaultChecked={row.on} />
        </Label>
      ))}
    </div>
  ),
};
