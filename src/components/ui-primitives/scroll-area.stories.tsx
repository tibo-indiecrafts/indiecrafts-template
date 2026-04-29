import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { Separator } from "./separator";

const meta: Meta<typeof ScrollArea> = {
  title: "UI Primitives/ScrollArea",
  component: ScrollArea,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 50 }, (_, i) => `tag-${i + 1}`);

/** Vertical scroll — long list, fixed height. */
export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
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

/** Horizontal scroll — image strip with explicit `<ScrollBar orientation="horizontal" />`. */
export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 rounded-md border whitespace-nowrap">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 12 }, (_, i) => (
          <figure key={i} className="shrink-0">
            <div className="bg-muted flex size-40 items-center justify-center rounded-md">
              <span className="text-muted-foreground text-sm">Card {i + 1}</span>
            </div>
            <figcaption className="text-muted-foreground pt-2 text-xs">
              Item {i + 1}
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
