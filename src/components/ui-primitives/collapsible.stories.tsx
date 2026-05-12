import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "UI Primitives/Collapsible",
  component: Collapsible,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Collapsible>;

const items = ["@radix-ui/react-collapsible", "@radix-ui/react-icons"];

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[320px] space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repos</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2">
        {items.map((it) => (
          <div key={it} className="rounded-md border px-4 py-2 text-sm">
            {it}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const InitiallyOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[320px] space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Open by default</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {items.map((it) => (
          <div key={it} className="rounded-md border px-4 py-2 text-sm">
            {it}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled className="w-[320px] space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Locked</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="rounded-md border px-4 py-2 text-sm">Hidden until enabled.</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
