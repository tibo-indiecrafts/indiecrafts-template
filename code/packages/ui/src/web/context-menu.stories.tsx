import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "./context-menu";
import docs from "./context-menu.md?raw";

const meta = {
  title: "UI/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed text-sm">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuItem>Save as…</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
