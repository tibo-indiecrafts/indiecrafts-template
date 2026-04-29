import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartAreaStackedExpand } from "./index";

const meta: Meta<typeof ChartAreaStackedExpand> = {
  title: "Sections/App/Charts/ChartAreaStackedExpand",
  component: ChartAreaStackedExpand,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartAreaStackedExpand>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartAreaStackedExpand />
      </div>
    </div>
  ),
};
