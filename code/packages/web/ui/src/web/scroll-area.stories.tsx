import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollArea } from "./scroll-area";
import docs from "./scroll-area.md?raw";
import { Separator } from "./separator";

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    // @debt ACCESSIBILITY - the Radix ScrollArea viewport takes no tabIndex, so a region with no focusable content can't be scrolled by keyboard.
    a11y: {
      config: {
        rules: [{ id: "scrollable-region-focusable", enabled: false }],
      },
    },
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 30 }, (_, i) => `v1.2.0-beta.${i + 1}`);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-56 w-56 rounded-md border">
      <div className="p-4">
        <p className="mb-2 text-sm font-medium">Tags</p>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
