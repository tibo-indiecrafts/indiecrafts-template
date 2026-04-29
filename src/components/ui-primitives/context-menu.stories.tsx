import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "UI Primitives/ContextMenu",
  component: ContextMenu,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

const Trigger = ({ children = "Right-click me" }: { children?: string }) => (
  <ContextMenuTrigger className="border-muted-foreground/25 text-muted-foreground flex h-32 w-72 items-center justify-center rounded-md border border-dashed text-sm">
    {children}
  </ContextMenuTrigger>
);

/** Standard items + shortcuts. */
export const Default: Story = {
  render: () => (
    <ContextMenu>
      <Trigger />
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/** Mixed item types — checkbox + radio group. */
export const Mixed: Story = {
  render: () => (
    <ContextMenu>
      <Trigger>Right-click for view options</Trigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Display</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show bookmarks</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>People</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuRadioItem value="pedro">Pedro</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
