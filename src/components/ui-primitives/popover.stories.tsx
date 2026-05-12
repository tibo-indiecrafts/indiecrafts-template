import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta: Meta<typeof Popover> = {
  title: "UI Primitives/Popover",
  component: Popover,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-3">
          <div className="space-y-1">
            <h4 className="font-medium">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the width and height for the layer.
            </p>
          </div>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="w">Width</Label>
            <Input id="w" defaultValue="100%" className="col-span-2 h-8" />
            <Label htmlFor="h">Height</Label>
            <Input id="h" defaultValue="320px" className="col-span-2 h-8" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const InitiallyOpen: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm">
        Click outside or press <kbd>Esc</kbd> to dismiss.
      </PopoverContent>
    </Popover>
  ),
};

export const Placement: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-40 text-xs">
            Anchored on {side}
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
