import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaStacked } from "./index";

const meta: Meta<typeof AreaStacked> = {
  title: "UI Molecules/Chart/Area/Stacked",
  component: AreaStacked,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaStacked>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaStacked />
      </div>
    </div>
  ),
};
