import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarActive } from "./index";

const meta: Meta<typeof BarActive> = {
  title: "UI Molecules/Chart/Bar/Active",
  component: BarActive,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof BarActive>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <BarActive />
      </div>
    </div>
  ),
};
