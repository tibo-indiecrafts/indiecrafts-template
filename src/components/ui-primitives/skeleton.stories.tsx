import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI Primitives/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

/** Single-line placeholder. */
export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[260px]" />,
};

/** Card placeholder — avatar + two text lines (chat-list pattern). */
export const ListItem: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
      </div>
    </div>
  ),
};

/** Article placeholder — title + paragraph stack. */
export const Article: Story = {
  render: () => (
    <div className="w-[360px] space-y-3">
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="mt-4 h-32 w-full rounded-md" />
    </div>
  ),
};
