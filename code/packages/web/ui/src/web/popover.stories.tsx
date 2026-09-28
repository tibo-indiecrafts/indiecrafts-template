import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "./popover";
import docs from "./popover.md?raw";
import { Button } from "./button";

const meta = {
  title: "Web/UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the layout dimensions for the selected layer.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

/** Behavior: trigger opens the popover content. */
export const Opens: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Open settings" }),
    );
    await expect(await screen.findByText("Dimensions")).toBeVisible();
  },
};
