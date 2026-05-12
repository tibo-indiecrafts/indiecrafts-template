import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "UI Primitives/Separator",
  component: Separator,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[360px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">An open-source UI library.</p>
      </div>
      <Separator className="my-4" />
      <div className="text-muted-foreground flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="text-muted-foreground flex h-6 items-center gap-3 text-sm">
      <span>Home</span>
      <Separator orientation="vertical" />
      <span>About</span>
      <Separator orientation="vertical" />
      <span>Pricing</span>
    </div>
  ),
};

export const Semantic: Story = {
  render: () => (
    <div className="w-[360px]">
      <p className="text-sm">Section A</p>
      <Separator decorative={false} className="my-3" />
      <p className="text-sm">Section B (announced as a divider by AT)</p>
    </div>
  ),
};
