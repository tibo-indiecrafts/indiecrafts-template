import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "UI Primitives/Select",
  component: Select,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Select>;

/** Single-choice select with a placeholder. */
export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="date">Date</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** Pre-selected value via `defaultValue`. */
export const WithDefault: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[220px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** Grouped items with labels and a separator. */
export const Grouped: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="Pick a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="pst">Pacific Standard Time</SelectItem>
          <SelectItem value="mst">Mountain Standard Time</SelectItem>
          <SelectItem value="cst">Central Standard Time</SelectItem>
          <SelectItem value="est">Eastern Standard Time</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
          <SelectItem value="cet">Central European Time</SelectItem>
          <SelectItem value="msk">Moscow Standard Time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/** Disabled trigger and a disabled item — both states are reachable. */
export const Disabled: Story = {
  render: () => (
    <div className="grid gap-3">
      <Select disabled>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Disabled trigger" />
        </SelectTrigger>
        <SelectContent />
      </Select>
      <Select>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="One item disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise" disabled>
            Enterprise (contact sales)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

/** Compact size — used inline in tight UI like a data table cell. */
export const SmallSize: Story = {
  render: () => (
    <Select defaultValue="all">
      <SelectTrigger size="sm" className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
  ),
};
