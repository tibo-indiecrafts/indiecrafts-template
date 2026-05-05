import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarHorizontal } from "./index";

const meta: Meta<typeof BarHorizontal> = {
  title: "UI Molecules/Chart/Bar/Horizontal",
  component: BarHorizontal,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BarHorizontal>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <BarHorizontal />
      </div>
    </div>
  ),
};
