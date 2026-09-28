import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "./sheet";
import docs from "./sheet.md?raw";
import { Button } from "./button";

const meta = {
  title: "Web/UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the results shown.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Apply</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/** Behavior: trigger opens the side sheet (a portalled dialog). */
export const Opens: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open filters" }));
    await expect(await screen.findByRole("dialog")).toBeVisible();
    await expect(screen.getByText("Filters")).toBeVisible();
  },
};
