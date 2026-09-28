import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./drawer";
import docs from "./drawer.md?raw";
import { Button } from "./button";

const meta = {
  title: "Web/UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/** Behavior: trigger opens the drawer content. */
export const Opens: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open drawer" }));
    await expect(await screen.findByText("Move goal")).toBeVisible();
  },
};
