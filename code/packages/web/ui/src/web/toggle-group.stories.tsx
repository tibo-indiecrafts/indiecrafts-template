import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import docs from "./toggle-group.md?raw";

const meta = {
  title: "Web/UI/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        U
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/** Behavior: selecting an item moves the active (`data-state`) state. */
export const Selects: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole("radio", { name: "Align left" });
    const center = canvas.getByRole("radio", { name: "Align center" });
    await expect(left).toHaveAttribute("data-state", "on");
    await userEvent.click(center);
    await expect(center).toHaveAttribute("data-state", "on");
    await expect(left).toHaveAttribute("data-state", "off");
  },
};
