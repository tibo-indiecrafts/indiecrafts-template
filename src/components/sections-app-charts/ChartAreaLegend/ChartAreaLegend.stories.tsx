import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartAreaLegend } from "./index";

const meta: Meta<typeof ChartAreaLegend> = {
  title: "Sections/App/Charts/ChartAreaLegend",
  component: ChartAreaLegend,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartAreaLegend>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartAreaLegend />
      </div>
    </div>
  ),
};
