import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AreaLegend } from "./index";

const meta: Meta<typeof AreaLegend> = {
  title: "UI Molecules/Chart/Area/Legend",
  component: AreaLegend,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AreaLegend>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <AreaLegend />
      </div>
    </div>
  ),
};
