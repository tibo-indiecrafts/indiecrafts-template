import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartAreaIcons } from "./index";

const meta: Meta<typeof ChartAreaIcons> = {
  title: "Sections/App/Charts/ChartAreaIcons",
  component: ChartAreaIcons,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ChartAreaIcons>;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-svh w-full p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl">
        <ChartAreaIcons />
      </div>
    </div>
  ),
};
