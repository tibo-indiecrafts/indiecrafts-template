import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import { toast } from "sonner";
import { Toaster } from "./sonner";
import docs from "./sonner.md?raw";
import { Button } from "./button";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: docs,
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button onClick={() => toast.success("Changes saved")}>Show toast</Button>
    </>
  ),
};

/** Behavior: the button fires a toast that appears on screen. */
export const ShowsToast: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show toast" }));
    // The toast animates in, so assert it mounted rather than final visibility.
    await expect(await screen.findByText("Changes saved")).toBeInTheDocument();
  },
};
