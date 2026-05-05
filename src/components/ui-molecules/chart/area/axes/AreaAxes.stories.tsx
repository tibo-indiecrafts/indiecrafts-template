import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaAxes } from "./index";

const meta: Meta<typeof AreaAxes> = {
  title: "UI Molecules/Chart/Area/Axes",
  component: AreaAxes,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaAxes>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaAxes />
      </div>
    </div>
  ),
};
