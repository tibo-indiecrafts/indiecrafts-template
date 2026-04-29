import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartAreaStacked } from "./index";

const meta: Meta<typeof ChartAreaStacked> = {
  title: "Sections/App/Charts/ChartAreaStacked",
  component: ChartAreaStacked,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartAreaStacked>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartAreaStacked />
      </div>
    </div>
  ),
};
