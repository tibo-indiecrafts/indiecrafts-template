import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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
